const mongoose  = require("mongoose")


const cartSchema = mongoose.Schema({
image:String,
price:Number,
playlist:String,
name:String,
discription:String
})
module.exports = mongoose.model("cart",cartSchema)