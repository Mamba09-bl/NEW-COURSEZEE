const express = require("express")
const app = express()
const index = require("./routers/index")
const userRouter = require('./routers/user-router')
const fetch = require("node-fetch"); // works because we installed node-fetch@2
require("dotenv").config();
const cookieParser = require("cookie-parser");

const path = require("path")
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// require("dotenv").config();
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser());




app.use("/",index)
app.use('/users',userRouter)


 



app.listen(3000)

