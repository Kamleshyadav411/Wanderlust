const Listing = require("./models/listing"); // Import the Listing model
const Review = require("./models/review"); // Import the Review model
const ExpressError = require("./utils/ExpressError.js"); // Import custom error class
const { listingSchema,reviewSchema } = require("./schema.js"); // Import the listing schema for validation
const review = require("./models/review.js");



module.exports.isLoggedIn = (req, res, next) => {
    // Middleware to check if the user is authenticated
    if (!req.isAuthenticated()) { // Check if the user is authenticated
        req.session.redirectTo = req.originalUrl; // Store the original URL
        // If not authenticated, flash an error message and redirect to the listings index
        req.flash("error", "You must be logged in to create a listing"); //
        return res.redirect("/login");
    }
    next(); // If authenticated, proceed to the next middleware or route handler

};

module.exports.saveRedirectUrl = (req, res, next) => {   // Middleware to save the redirect URL
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // Save the redirect URL to the session
    }
    next(); // Proceed to the next middleware or route handler
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;      // Get the listing ID from the request parameters
    let listing = await Listing.findById(id);     // Find the listing by ID
    if(!listing.owner.equals(res.locals.currentUser._id)) {      // Check if the current user is the owner of the listing
        req.flash("error", "You are not the owner of this listing"); // Flash an error message if not the owner
        return res.redirect(`/listings/${id}`);    // Redirect to the listing's show page
    }
    next();      // If the user is the owner, proceed to the next middleware or route handler
};


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



module.exports.isReviewAuthor = async (req, res, next) => {
    let {id,reviewId} = req.params;      // Get the listing ID from the request parameters
    let review = await Review.findById(reviewId);     // Find the listing by ID
    if(!review.author.equals(res.locals.currentUser._id)) {      // Check if the current user is the owner of the listing
        req.flash("error", "You are not the author of this review"); // Flash an error message if not the owner
        return res.redirect(`/listings/${id}`);    // Redirect to the listing's show page
    }
    next();      // If the user is the owner, proceed to the next middleware or route handler
};