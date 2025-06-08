const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assuming you have a User model defined in models/user.js
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');  // passport is used for authentication
const { saveRedirectUrl } = require('../middlewares');
const userController = require('../controllers/users'); // Import your user controller

router.route("/signup")
  .get(userController.renderSignupForm) // Render your signup page here
  .post(wrapAsync(userController.signup)); // Handle user signup


router.route("/login")
  .get(userController.renderLoginForm) // Render your login page here
  .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    userController.login); // Handle user login




router.get('/logout',userController.logout); // Handle user logout



module.exports = router; // Export the router