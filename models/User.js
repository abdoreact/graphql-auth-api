const {model, Schema} = require("mongoose")
const {hash} = require("argon2")
const validator = require("validator")
const userSchema=new Schema({
    email:{
        type:String,
        required:[true, "Error. Email not provided"],
        validate:[validator.isEmail, "Error. Invalid email."],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Error. Password not provided."],
        minlength:[8, "Error. Password under eight characters."]
    }
})
userSchema.pre("save", async function(next){
    this.password=await hash(this.password)
    next()
})
module.exports = model('User', userSchema)