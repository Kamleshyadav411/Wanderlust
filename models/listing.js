const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, // Add required if you want to enforce it
  },
  image: {
    url: String,
    filename: String, // Assuming you want to store the filename as well
  },
  price: {
    type: Number,
    required: true, // Add required if you want to enforce it
  },
  location: {
    type: String,
    required: true, // Add required if you want to enforce it
  },
  country: {
    type: String,
    required: true, // Add required if you want to enforce it
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,   // Use ObjectId to reference Review documents
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // Add required if you want to enforce it
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // Specify that the type must be "Point"
      required: true, // Add required if you want to enforce it
       // Add required if you want to enforce it
    },
    coordinates: {
      type: [Number], // Array of numbers for longitude and latitude
      required: true,  // Add required if you want to enforce it
       // Add required if you want to enforce it
    },
  },
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;