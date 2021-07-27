const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const path = require("path");

const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema } = require("./schema");

const Campground = require("./models/campground");
const Review = require("./models/review");
const campgrounds = require("./routes/campgrounds");

mongoose.connect("mongodb://localhost:27017/yelpCampDB", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const validateReviewData = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use("/campgrounds", campgrounds);

app.get("/", (req, res) => {
  res.render("home");
});

app.post(
  "/campgrounds/:id/reviews",
  validateReviewData,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);

    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete("/campgrounds/:id/reviews/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/campgrounds/${id}`);
});

app.all("*", (req, res, next) => {
  res.send(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Aww yeah, something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("SERVER RUNNING ON PORT:3000");
});
