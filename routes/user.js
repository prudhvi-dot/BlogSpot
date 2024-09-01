const {Router} = require('express');
const User = require('../models/userSchema');
const {createToken} = require('../services/authentication');
const {validateToken} = require('../services/authentication');
const router = Router();

router.get('/signup',(req,res)=>{
    res.render('signup',{user: req.user});
})
router.get('/signin',(req,res)=>{
    res.render('signin',{msg:'',user:req.user});
})
router.post('/signup',async (req,res)=>{
    
    const {fullName, email, password} = req.body;
    await User.create({fullName, email, password});
    return res.redirect('/');
})
router.post('/signin',async (req,res)=>{
    const{email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return  res.render('signin',{msg:'Invalid username or password',user:req.user});
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
      return  res.render('signin',{msg:'Invalid username or password',user:req.user});
    }

   const token =  createToken(user);
   res.cookie('token', token);
   return res.redirect('/');
   
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
})

module.exports = router;