module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
    // redirect URL
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to create listing");
    res.redirect("/login");
  }

  next();
}

module.exports.saveredirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}