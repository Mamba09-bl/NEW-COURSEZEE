const express = require("express")
const router = express.Router()
const userModel = require("../models/user-module")
const bcrypt =  require("bcrypt")
const cookieParser =  require("cookie-parser")
const jwt = require("jsonwebtoken")
const  nodemailer = require("nodemailer")
const homeModule = require("../models/home-module")
const upload = require("../config/multer");
const authMiddleware = require("../middlewares/auth")
const userModule = require("../models/user-module")
const newModule = require("../models/new-module")
const graphicModule = require("../models/graphic-module")




router.post("/signup",(req,res)=>{
    let {username,email,password} = req.body
 
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            const user = await userModel.create({
                username,
                email,
                password:hash
            })
            let token = jwt.sign({email:email,id:user._id},"secret")
            res.cookie("token",token)
            res.redirect("/login")
            console.log(user);
        })
    })
})

router.post("/login",async(req,res)=>{
    let {email,password} = req.body

    let user = await userModel.findOne({email})
  if(!user) return res.status(401).send("Something went wrong")
    

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = jwt.sign({email:email,id:user._id},"secret")
            res.cookie("token",token)
            res.cookie("email", email);
            res.redirect("/trending")
             
              
        }else{
            res.send(" wrong")
        }
    })
})


  router.post('/checkout', authMiddleware,async (req, res) => {
   try {
     const { email, playlistIds } = req.body; // playlistIds will be an array if multiple

    // Make sure playlistIds is an array
     const user = await userModule.findOne({email:req.user.email}).populate("cart")
     const trending = await userModule.findOne({email:req.user.email}).populate("cartlatest")
     const graphic = await userModule.findOne({email:req.user.email}).populate("cartgraphic")
  const link = []
    user.cart.map((list)=>{
      link.push(list.playlist)
     })

     trending.cartlatest.map((list)=>{
      link.push(list.playlist)
     })

     graphic.cartgraphic.map((list)=>{
      link.push(list.playlist)
     })
     console.log(user);
    
   
    

     // Example: generate URLs for all playlists
    //   const urls = link.forEach(
    //    id => `http://localhost:3000/courses?playlistId=${id}`
    //  ).join("\n"); // combine into one string/  let url = ""
     
     let url = ""
     link.forEach(id=>{
      url += `https://courseze-4.onrender.com/courses?playlistId=${id}\n`
    })
  console.log(url);


 
 
     // Send email
     const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
       user: process.env.GMAIL_USER,
  pass: process.env.GMAIL_APP_PASS 
       },
     });

     await transporter.sendMail({
       from: "hamza.ahmed.abbasi07@gmail.com",
       to: email,
       subject: "Order placed from CourseZE",
      text:`Hi ${user.name || email},

🎉 Thank you for shopping with CourseZE!


Here are your course links:
${url}

Happy Learning! 🚀`,
   });

   res.redirect("/home");
  } catch (err) {
    res.send("Error: " + err.message);
  }
 });



router.post('/create',upload.single("image"),async(req,res)=>{
  
  let {price,playlist,name,discription} = req.body 
  const user = await homeModule.create({
    price,
    playlist,
    name,
    discription,
    image:req.file.filename
  })
  console.log(user);
   console.log("Uploaded filename:", req.file.filename);
  res.redirect("/admin")
})



router.post('/new',upload.single("image"),async(req,res)=>{
  
  let {price,playlist,name,discription} = req.body 
  const user = await newModule.create({
    price,
    playlist,
    name,
    discription,
    image:req.file.filename
  })
  console.log(user);
   console.log("Uploaded filename:", req.file.filename);
  res.redirect("/admin")
})
router.post('/graphic',upload.single("image"),async(req,res)=>{
  
  let {price,playlist,name,discription} = req.body 
  const user = await graphicModule.create({
    price,
    playlist,
    name,
    discription,
    image:req.file.filename
  })
  console.log(user);
   console.log("Uploaded filename:", req.file.filename);
  res.redirect("/graphic")
})
module.exports = router
