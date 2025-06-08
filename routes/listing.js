const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middlewares.js"); // Import the isLoggedIn middleware


const listingsController = require("../controllers/listings.js"); // Import the listings controller

const multer = require("multer"); // used for handling file uploads
const { cloudinary, storage } = require("../cloudConfig.js"); // Import cloudinary configuration
const upload = multer({ storage: storage }); // Set the destination for uploaded files


router.route("/")
.get( wrapAsync(listingsController.index))    // Index route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,
     wrapAsync(listingsController.createListing));  // Create route


// New route (must be before /:id)
router.get("/new",isLoggedIn,listingsController.renderNewForm);



router.route("/:id")
.get(wrapAsync(listingsController.showListing))  // Show route
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingsController.updateListing))  // Update route
.delete( isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing)); // Delete route



// Edit route (must be before /:id)
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingsController.renderEditForm));


module.exports = router;