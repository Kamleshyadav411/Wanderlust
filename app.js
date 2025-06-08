if (process.env.NODE_ENV !== "production") {  // Load environment variables in non-production environments
  require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // MongoDB session store
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js"); // Assuming you have a User model defined in models/user.js



const listing = require("./routes/listing.js");  //route for handling listings
const reviews = require("./routes/review.js");  //route for handling reviews
const user = require("./routes/user.js"); // Assuming you have a user route defined in routes/user.js




const dburl=process.env.ATLAS;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });



async function main() {
  await mongoose.connect(dburl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));



const store = MongoStore.create({  // Create a new MongoDB store instance
  mongoUrl: dburl, // MongoDB connection URL
  touchAfter: 24 * 3600, // Time in seconds after which the session will be updated
  crypto:{
    secret: process.env.SECRET,  // Secret key for encryption
  }
});

store.on("error",()=>{  // Handle errors from the session store
  console.log("session store error");
});

// Session configuration
const sessionOptions = {
  store: store,  // Use the MongoDB store for session management
  secret: process.env.SECRET, // Secret key for signing the session ID cookie",  
  resave: false,
  saveUninitialized: true,  // Create session even if not modified
  cookie: {        // Cookie options
    secure: false,  // Set to true if using HTTPS
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookie expiration time
    maxAge: 1000 * 60 * 60 * 24 * 7,  // 1 week
  },
};




// Home page (redirect to /listings)
// app.get("/", (req, res) => {
//   res.redirect("/listings");
// });
//  ROUTES




app.use(session(sessionOptions)); // Initialize session middleware
app.use(flash()); // Initialize flash middleware


app.use(passport.initialize());   // Initialize Passport.js this is middleware
app.use(passport.session());   // Use Passport.js session management used for user authentication
passport.use(new localStrategy(User.authenticate()));   // Use local strategy for authentication

passport.serializeUser(User.serializeUser());  // Serialize user for session means saving user ID to the session
passport.deserializeUser(User.deserializeUser());  // Deserialize user from session means retrieving user data from the database using the user ID stored in the session


app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Make flash messages available in templates
  res.locals.error = req.flash("error"); // Make error messages available in templates
  res.locals.currentUser = req.user; // Make the current user available in templates
  next();
});



// Use the listings router for all /listings routes
app.use("/listings", listing);


// Use the reviews router for all /listings/:id/reviews routes
app.use("/listings/:id/reviews", reviews);

app.use("/", user); // Use the user router for all /user routes


// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
  console.log("server is working..");
});