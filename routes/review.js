const express = require("express");
const router = express.Router({mergeParams: true}); // mergeParams allows us to access params from the parent route (listings in this case)
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js"); // Import the validateReview middleware
const reviewController = require("../controllers/reviews.js");



// Reviews Route - Post
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Reviews Route - Delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));
module.exports = router;
