const mongoose  = require("mongoose")

mongoose.connect(
  "mongodb+srv://hamzaahmed:hamza123@cluster0.k8hovee.mongodb.net/CoursEZA?retryWrites=true&w=majority"
);

const userSchema = mongoose.Schema({
    fullname : String,
    email:String,
    password:String,
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"home",
    }],
    cartlatest:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"new",
    }],
    
     cartgraphic:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"graphic",
    }]
    
})
module.exports = mongoose.model("user",userSchema)
