const mongoose  = require("mongoose")


const homeSchema = mongoose.Schema({
image:String,
price:Number,
playlist:String,
name:String,
discription:String
})
module.exports = mongoose.model("home",homeSchema)