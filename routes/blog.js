const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

//to upload image for blog
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

//get route to add new blog
router.get("/add-blog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

//post route to upload image
router.post("/", upload.single("coverImg"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImg: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

//route to render blog.ejs to display specific blog, by id 
//passing curr user and blog to blog.ejs

router.get("/:id", async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy")
  const comments = await Comment.find({blogId : req.params.id}).populate("createdBy")
  res.render("blog" , {
    user : req.user,
    blog,
    comments
  })
})

router.post("/comment/:id", async(req,res)=>{

  await Comment.create({
    content : req.body.content,
    blogId : req.params.id,
    createdBy : req.user._id
  });

  res.redirect(`/blog/${req.params.id}`)
})

module.exports = router;
