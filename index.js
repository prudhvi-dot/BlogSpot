const express = require("express");
require('dotenv').config();
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require("path");
const Blog = require('./models/blogSchema');
const checkForAuthentication = require("./middlewares/authentication");

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public/"));
app.use(checkForAuthentication('token'));

app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render('home',{user: req.user, blogs: allBlogs});
})
app.get('/Blogs',async (req,res)=>{
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render('Blogs',{user: req.user, blogs: allBlogs});
})

app.use('/user',userRoute);
app.use('/blog',blogRoute);



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})