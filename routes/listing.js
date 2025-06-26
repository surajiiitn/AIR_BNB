const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../Utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }else{
    next();
  }
}

//Index 
router.get("/",wrapAsync(async (req,res)=>{
    let allListing = await Listing.find({});
    res.render("listings/index.ejs",{ allListing });
    console.log(allListing);
}));


//New 
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
}); 


//Show 

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;

    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{ listing });
    
}));

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    // let {title, description ,image,price ,country,location} = req.body;

      if(!req.body.listing){
        throw new ExpressError(404,"Send Valid data");
      }

        let newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New Listing Added");
        res.redirect("/listings");   
}));

//Edit Route 
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Listing Updated");

  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);

  console.log(deletedListing);
  req.flash("success","Listing Deleted");

  res.redirect("/listings");
}));

module.exports = router;