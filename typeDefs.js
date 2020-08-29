const {gql} = require("apollo-server-express")
module.exports = gql`
type User{
    email:String
    password:String
    _id:ID
    errors:Error
}
type Error{
    email:String,
    password:String
}
type Query{
    user(id:ID):User
    isAuth(jwt:String):Boolean        
}
type Mutation{
    register(email:String, password:String):User
    login(email:String, password:String):User
}
`