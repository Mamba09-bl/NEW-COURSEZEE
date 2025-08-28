const express = require("express")
const session = require("express-session");
const flash = require("connect-flash");
const router = express.Router()
const homeModule = require("../models/home-module")
const userModule = require("../models/user-module")
const newModule = require("../models/new-module")

const graphicModule = require("../models/graphic-module")
const authMiddleware = require("../middlewares/auth"); 
router.use(session({
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: true,
}));

// Flash middleware
router.use(flash());

router.get("/",(req,res)=>{
    res.render("signUp")
})
router.get("/login",(req,res)=>{
    res.render("login")
})

router.get("/home",authMiddleware,async (req, res) => {
  try {
    const playlist = 'PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w'; // e.g. ?playlistId=PLxxxx
     const home = await homeModule.find({})
     const user = await userModule.findOne({_id:req.user._id})
     console.log(req.user);
     
    

    // http://localhost:3000/courses?playlistId=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w

    // const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlist}&key=${process.env.YT_API_KEY}`;
    //www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&key=${process.env.YT_API_KEY}

    
    // const response = await fetch(url);
    // const data = await response.json();
    // console.log(data);
    let success = req.flash("success")

    // pass video items to EJS
    res.render("home", {home,success });
  } catch (err) {
    res.send("Error: " + err.message);
  }
}); 

// router.get('/buy', async (req, res) => {
//   const home = await homeModule.find({});
  

//   // collect all playlists into an array
//   const playlists = home.map(item => item.playlist);

//   console.log(playlists); // see all playlist IDs

//   res.render("buy", { home, playlists });
// });

router.get("/buy",async (req, res) => {
const check = await homeModule.find({})
const user = await userModule.find({})



  res.render("buy",{check});
});

router.get("/courses", async (req, res) => {
  try {
    const playlist = req.query.playlistId; // e.g. ?playlistId=PLxxxx
    if (!playlist) return res.send("playlistId required in query");

    // http://localhost:3000/courses?playlistId=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${playlist}&key=${process.env.YT_API_KEY}`;
    //www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&key=${process.env.YT_API_KEY}

    
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    

    // pass video items to EJS
    res.render("courses", { lessons: data.items || [] });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

router.get("/details/:playlist", async (req, res) => {
  try {
     // e.g. ?playlistId=PLxxxx
    const playlist = req.params.playlist;
    
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${playlist}&key=${process.env.YT_API_KEY}`;
   
    
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    

    // pass video items to EJS
    res.render("details", { lessons: data.items || [] });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

router.get("/checkout",authMiddleware, async (req, res) => {
  const check = await userModule.findById(req.user._id).populate("cart");
   const checklatest = await userModule.findById(req.user._id).populate("cartlatest");
   const totalgraphic = await userModule.findById(req.user._id).populate("cartgraphic");

   const total = check.cart
  const latest = checklatest.cartlatest
  const cartgraphic = totalgraphic.cartgraphic

  let bill = 0;
 
  total.forEach((pr) => {
    bill += pr.price;
  });

   latest.forEach((pr) => {
    bill += pr.price;
  });

   cartgraphic.forEach((pr) => {
    bill += pr.price;
  });
 
const trending = await userModule.findById(req.user._id).populate("cartlatest");
const graphic = await userModule.findById(req.user._id).populate("cartgraphic");

console.log(trending);

  
  
  res.render("checkout", { user:check.cart,bill,latest:trending.cartlatest,graphic:graphic.cartgraphic});
});

router.get('/addtocart/:id',authMiddleware,async(req,res)=>{
  //  const user = await userModule.findOne({});
  req.user.cart.push(req.params.id); // add course to cart
  req.user.cartlatest.push(req.params.id);
  await req.user.save(); // save updated user
  console.log(req.user);
  
  req.flash("success","Added to cart")
  res.redirect("/home")
})

router.get('/addedtocart/:id',authMiddleware,async(req,res)=>{
  //  const user = await userModule.findOne({});
  req.user.cartlatest.push(req.params.id); // add course to cart
  await req.user.save(); // save updated user
  console.log(req.user);
  
  req.flash("success","Added to cart")
  res.redirect("/trending")
})


router.get('/cartadd/:id',authMiddleware,async(req,res)=>{
  //  const user = await userModule.findOne({});
  req.user.cartgraphic.push(req.params.id); // add course to cart
  await req.user.save(); // save updated user
  console.log(req.user);
  
  req.flash("success","Added to cart")
  res.redirect("/graphic")
})


router.get('/admin',async(req,res)=>{
  const home = await homeModule.find({})
  // console.log(home);
  
  res.render("admin",{home})
})

router.get("/remove/:id",authMiddleware,async(req,res)=>{
  // const user = await homeModule.findOneAndDelete({_id:req.params.id})
  // const user = await userModule.findOne({})
  
  console.log(req.user);
  

  const index = req.user.cart.indexOf(req.params.id);
  req.user.cart.splice(index, 1);

   const trending = req.user.cartlatest.indexOf(req.params.id);
  req.user.cartlatest.splice(trending, 1);

  // const graphic = req.user.cartgraphic.indexOf(req.params.id);
  // req.user.cartgraphic.splice(graphic, 1);cartgraphic
  await req.user.save()
  // console.log(user.cart)
  res.redirect('/checkout')
})

router.get("/delete/:id",authMiddleware,async(req,res)=>{
  const graphic = req.user.cartgraphic.indexOf(req.params.id);
  req.user.cartgraphic.splice(graphic, 1);
  await req.user.save()
  // console.log(user.cart)
  res.redirect('/checkout')
})


router.get("/cancel/:id",authMiddleware,async(req,res)=>{
  const cartlatest = req.user.cartlatest.indexOf(req.params.id);
  req.user.cartlatest.splice(cartlatest, 1);
  await req.user.save()
  // console.log(user.cart)
  res.redirect('/checkout')
})





router.get('/trending',authMiddleware,async(req,res)=>{
  const home = await userModule.find({}).populate('cart')
  const graphic = await userModule.find({}).populate('cartgraphic')

  const course = home
  const cographic = graphic

  let array = []
  let ar = []
  // console.log(course);
  for(let ary of course){
  for(let c of ary.cart){

    array.push(c) 
  }
  }


   for(let ary of cographic){
  for(let c of ary.cartgraphic){

    ar.push(c) 
  }
  }
  // console.log(array);
//   array
  let obj = {}

for (let c of array) {
  const id = c._id.toString(); // make ObjectId a string
  if (!obj[id]) {
    obj[id] = { course: c, count: 1 }  // store course + count
  } else {
    obj[id].count++;
  }
}

let objj = {}

for (let c of ar) {
  const id = c._id.toString(); // make ObjectId a string
  if (!objj[id]) {
    objj[id] = { course: c, count: 1 }  // store course + count
  } else {
    objj[id].count++;
  }
}
// console.log(obj);

// console.log(obj);


// FOR WHOLE
let maxCourse = null
let maxCount = 0

for (let id in obj) {
  if (obj[id].count > maxCount) {
    maxCourse = obj[id].course
    maxCount = obj[id].count
  }
}


let maxCoursee = null
let maxCountt = 0

for (let id in objj) {
  if (objj[id].count > maxCountt) {
    maxCoursee = objj[id].course
    maxCountt = objj[id].count
  }
}
// console.log("Most repeated course:", maxCoursee, "with count:", maxCountt)

// console.log(maxCourse);

const user = await newModule.find({}); // fetch all courses
const cart = await userModule.find({email:req.user.email})
// console.log(maxCourse);
let success = req.flash("success")
console.log(maxCoursee);
  res.render("trending",{maxCourse, user,success,maxCoursee })
})


router.get("/graphic",authMiddleware,async(req,res)=>{
  const graphic = await graphicModule.find({})
  
  let success = req.flash("success")

  res.render("graphic",{graphic,success})
})
module.exports = router