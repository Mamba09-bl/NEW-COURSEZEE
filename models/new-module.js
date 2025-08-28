const mongoose  = require("mongoose")


const newSchema = mongoose.Schema({
image:String,
price:Number,
playlist:String,
name:String,
discription:String
})
module.exports = mongoose.model("new",newSchema)