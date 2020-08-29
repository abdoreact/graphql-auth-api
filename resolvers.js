const User = require("./models/User")
const {sign, verify}=require("jsonwebtoken")
const jwtsecret=require("./config.json").jwt
const argon2 = require("argon2")
const createToken=(id) => {
    return sign({id}, jwtsecret, {
        expiresIn:60*60*24
    })
}
module.exports = {
    Query:{
        user:(_, {id}) => User.findById(id),
        isAuth:(_, {jwt}) => {
            try{
                if(verify(jwt, jwtsecret)){
                    return true
                } 
            }
            catch(err){
                return false
            }
        }
    },
    Mutation:{
        register:async (_, {email, password}) => {
            try{
                const user=await User.create({email, password})
                const token=createToken(user._id)
                return {_id:token}
            }   
            catch(err){
                const errors={email:'', password:''}
                if(err.code==11000){
                    return {errors:{
                        email:"Error. Email already in use.",
                        password:""
                    }}
                }
                Object.values(err.errors).forEach(({properties}) => {
                    errors[properties.path] = properties.message
                })
                return {errors}
            }     
        },
        login:async (_, {email, password}) => {
            const user=await User.findOne({email})
            if(!user){
                return {errors:{
                    email:"Error. Email not found.",
                    password:""
                }}
            }
            if(!await argon2.verify(user.password, password)){
                return{errors:{
                    email:"",
                    password:"Error. Incorrect password."
                }}
            }
            return {_id:createToken(user._id)}
        }
    }
}