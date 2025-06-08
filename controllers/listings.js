const Listing = require("../models/listing"); // Import the Listing model
const mbxGeocoding= require("@mapbox/mapbox-sdk/services/geocoding"); // Import Mapbox Tilesets service
const mapToken = process.env.MAP_TOKEN; // Get the Mapbox token from environment variables
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); // Create a Mapbox Geocoding client

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};



module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};



module.exports.showListing = (async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("owner") // Populate the owner field with user data
    .populate({path:"reviews", populate:{path:"author",
    },
    }); // Populate the reviews and their authors
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    console.log(listing);       // Log the listing to check if it has reviews and owner populated
    res.render("listings/show", { listing,mapToken: process.env.MAP_TOKEN});
});



module.exports.createListing = (async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location, // Use the location from the form
        limit: 1
    }).send();
 
    res.redirect("/listings"); // Redirect to the index page after creating a new listing

    let url= req.file.path; // Get the image URL from the uploaded file
    let filename = req.file.filename; // Get the image filename from the uploaded file

    // Use req.body instead of req.body.listing if your form is not nested
    const newListing = new Listing(req.body.listing ? req.body.listing : req.body);
    newListing.owner = req.user._id;     // Set the owner to the current user
    newListing.image = { url, filename };  // Set the image field
    newListing.geometry = response.body.features[0].geometry; // Set the geometry field with the coordinates

   let savedListing= await newListing.save();
   console.log(savedListing); // Log the saved listing to check if it has the correct data
    req.flash("success", "Successfully created a new listing!");
    // Redirect to the index page after creating a new listing
    res.redirect("/listings");
});



module.exports.renderEditForm = (async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; // Store the original image before editing
    originalImageUrl.replace(/\/upload\//, "/upload/w_250/");  // Adjust the URL to match the image size in the edit form
    res.render("listings/edit", { listing, originalImageUrl });
});




module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined") {   // Check if a new file was uploaded
    // If a new file was uploaded, update the image field
    let url= req.file.path; // Get the image URL from the uploaded file
    let filename = req.file.filename; // Get the image filename from the uploaded file
    listing.image = { url, filename }; // Update the image field
    await listing.save();
    }

    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};



module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        return next(new ExpressError(404, "Listing not found"));
    }
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};