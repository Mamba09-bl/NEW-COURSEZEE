const mongoose  = require("mongoose")


const graphicSchema = mongoose.Schema({
image:String,
price:Number,
playlist:String,
name:String,
discription:String
})
module.exports = mongoose.model("graphic",graphicSchema)