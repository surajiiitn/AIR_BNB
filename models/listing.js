const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
