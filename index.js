const express = require("express");
require('dotenv').config();
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require("path");
const Blog = require('./models/blogSchema');
const checkForAuthentication = require("./middlewares/authentication");
const helmet = require('helmet');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({extended:true}));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://ka-f.fontawesome.com/", // Add Font Awesome Kit URL here
];
const fontSrcUrls = [
    "https://ka-f.fontawesome.com/", // Add Font Awesome Kit URL here
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", "https://ka-f.fontawesome.com/"], // Add Font Awesome URL here
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dxvqusbka/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


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