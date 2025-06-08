const User = require('../models/user');  // Import the User model


module.exports.renderSignupForm=(req, res) => {
    res.render('users/signup', { title: 'Sign Up' });
  };  // Render your signup page here



module.exports.signup = async (req, res) => {
    // Extract nested user fields from req.body
    try{
      const { username, email, password } = req.body.user;
    const newUser = new User({ username, email });
   const registeredUser = await User.register(newUser, password);    // Use passport-local-mongoose's register method
   console.log(registeredUser);
    req.login(registeredUser, (err) => {    // Log in the user after registration
      if (err) {
        return next(err);    // Handle error during login
      }
      req.flash('success', 'Welcome to Wanderlust!');      // Flash message for successful signup
    res.redirect('/listings');     // Redirect to listings page after successful signup
    });
    
    }catch (e) {
      console.log(e);
      req.flash('error', e.message);     // Flash message for error
      res.redirect('/signup');      // Redirect back to signup page on error
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs', { title: 'Login' });
};  // Render your login page here



module.exports.login=async (req, res) => {
  req.flash('success', 'Welcome back to Wanderlust!');      // Flash message for successful login
  let redirectUrl= res.locals.redirectUrl || '/listings';  // Redirect to listings page after successful login
  res.redirect(redirectUrl);
};


module.exports.logout =  (req, res, next) => {  // Handle logout
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are logged out!');
        res.redirect('/login');
    });
};