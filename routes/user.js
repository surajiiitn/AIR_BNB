const express = require("express");
const router = express.Router({mergeParams :true});
const User = require("../models/user.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const passport = require("passport");
const {saveredirectUrl} = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async (req,res)=>{

    try{
        let {username, email, password} = req.body;
        const newUser =  new User({email ,username});

        await User.register(newUser,password);
        req.login(newUser,(err)=>{
            if(err){
                return err;
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings");
        })``
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login",(req,res)=>{
    res.render('users/login.ejs');
});

router.post("/login",saveredirectUrl,passport.authenticate("local", { failureRedirect : '/login',failureFlash : true}),async (req,res)=>{
    req.flash("success","welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);``
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
})
module.exports = router; 