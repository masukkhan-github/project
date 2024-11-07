const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/vacation-home-isometric_1284-22628.jpg?t=st=1730032535~exp=1730036135~hmac=280b90af91a9588d33215f927ac9747cc058639728ebf0f0af98d6a8436b5966&w=740",
    set: (v) =>
      v === ""
        ? "https://img.freepik.com/free-vector/vacation-home-isometric_1284-22628.jpg?t=st=1730032535~exp=1730036135~hmac=280b90af91a9588d33215f927ac9747cc058639728ebf0f0af98d6a8436b5966&w=740"
        : v,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country:{
    type : String,
    required : true
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
