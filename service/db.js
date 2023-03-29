const mongoose=require("mongoose")

//Connection String
mongoose.connect("mongodb://localhost:27017/bankServer",{useNewUrlParser:true})

//There is a chance for a parser issue to occur, so if an issue occur we have to drop that parser and use new parser., to execute such action we have to give {useNewUrlParser:true} while creating connection string.

//Model Creation
const User=mongoose.model("User",{ username:String, acno: Number, password: String, balance: Number, transaction: [] })

module.exports={
    User
}