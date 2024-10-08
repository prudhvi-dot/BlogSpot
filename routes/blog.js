const{Router} = require('express');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})
const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');
const path = require('path');

const router = Router();


router.get('/New',(req,res)=>{
    return res.render('addBlog',{user: req.user})
})
router.get('/:id',async (req,res)=>{
  const{id} = req.params;
  const comments = await Comment.find({blogId: id}).sort({ createdAt: -1 }).populate('createdBy');
  const blog = await Blog.findById(id).populate('createdBy');
  return res.render('blog',{blog,user:req.user,comments});
})
router.post('/comment/:blogId',(req,res)=>{
  const{content} = req.body;
  const{blogId} = req.params;

  const comment = Comment.create({content,blogId,createdBy:req.user._id});
  res.redirect(`/blog/${blogId}`);
})
router.post('/',upload.single('coverImage'),async (req,res)=>{
    const{title, body} = req.body;
    const url = req.file.path;
    const fileName = req.file.filename
  const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImage: {url,fileName}
    });
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;