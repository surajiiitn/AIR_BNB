const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default: "https://i.pinimg.com/736x/69/19/59/691959b187b2b253eb2a8aaff72200b5.jpg",
      set: v =>
        v === ""
          ? "https://i.pinimg.com/736x/69/19/59/691959b187b2b253eb2a8aaff72200b5.jpg"
          : v,
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User",
  }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
