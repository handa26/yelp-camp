if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const methodOverride = require("method-override");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo");
const path = require("path");

const ExpressError = require("./utils/ExpressError");
const HelmetConfig = require("./utils/HelmetConfig");

const User = require("./models/user");

// Database
connectDB();

const dbUrl = "mongodb://localhost:27017/yelpCampDB" || process.env.DB_URL;

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Static Assets
app.use(express.static(path.join(__dirname, "public")));

// EJS Templating
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Flash Message
app.use(flash());

// Database Security
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// Content Policy Rules
app.use(helmet({ contentSecurityPolicy: false }));

const { scriptSrcUrls, styleSrcUrls, connectSrcUrls, fontSrcUrls } = HelmetConfig;

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/ddbesc0xk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Mongo Session
const secret = process.env.SECRET || "awesome";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e);
});

// Local Session
const sessionConfig = {
  store,
  name: "yelpcamp_session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set Global Variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.currentUrl = req.url;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/campgrounds", require("./routes/campgrounds"));
app.use("/campgrounds/:id/reviews", require("./routes/reviews"));
app.use("/", require("./routes/users"));

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  res.send(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Aww yeah, something went wrong";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT:${port}`);
});
