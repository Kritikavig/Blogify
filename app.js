require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const Blog = require('./models/blog')
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const cookieParser = require('cookie-parser');
const { checkForAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT||3000

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


//set view engine
app.set('view engine', 'ejs')
app.set("views", path.resolve("./views"));  //views yaha pr hai 
app.use(express.urlencoded({extended: false}))  //for forms
app.use(cookieParser());
app.use(checkForAuth("token"))            //token named cookie is formed during signin
app.use(express.static(path.resolve("./public"))) //treat public as dynamic folder 

app.use("/user", userRouter)
app.use("/blog", blogRouter)

app.get('/', async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home", {
      user : req.user,
      blogs : allBlogs
    })   //pass user obj at home page
})

app.listen(PORT, ()=> console.log('Server start'))
