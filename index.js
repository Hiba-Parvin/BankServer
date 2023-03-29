//Importing express and storing it in a variable
const express = require("express")

//import ds
const ds = require("./service/dataService")

//import jsonwebtoken
const jwt = require("jsonwebtoken")

//App creation
const app = express()

//To Covert All Datas From JSON To Js
app.use(express.json())

//Middleware Creation
const jwtMiddleware = (req, res, next) => {
try{
    //accessing data from request body
    const token = req.headers['access_token']

    //verifying the token with secret key
    const data = jwt.verify(token, "superkey123")

    console.log(data);

    next()
}
catch{
    res.status(422).json({
        status:false,
        message:"Please Login.",
        statusCode:404
    })
}
}

//register - post
app.post("/register", (req, res) => {
    const result = ds.register(req.body.acno, req.body.uname, req.body.psw)
    res.status(result.statusCode).json(result)

})

//login - get
app.post("/login", (req, res) => {
    const result = ds.login(req.body.acno, req.body.psw)
    res.status(result.statusCode).json(result)

})

//deposit - patch
app.post("/deposit", jwtMiddleware ,(req, res) => {
    const result = ds.deposit(req.body.acno, req.body.psw, req.body.amnt)
    res.status(result.statusCode).json(result)

})


//withdraw - patch
app.post("/withdraw", jwtMiddleware , (req, res) => {
    const result = ds.withdraw(req.body.acno, req.body.psw, req.body.amnt)
    res.status(result.statusCode).json(result)

})

//transaction - get
app.get("/transaction", jwtMiddleware , (req, res) => {
    const result = ds.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)

})

//delete - delete


//resolve api

// app.get("/",(req,res)=>{
//     res.send('Get Method Working...!!')
// })

// app.post("/",(req,res)=>{
//     res.send('Post Method Working...!!')
// })

// app.put("/",(req,res)=>{
//     res.send('Put Method Working...!!')
// })

// app.patch("/",(req,res)=>{
//     res.send('Patch Method Working...!!')
// })

// app.delete("/",(req,res)=>{
//     res.send('Delete Method Working...!!')
// })

//Setting port
app.listen(3000, () => { console.log("Server Started At Port : 3000"); })