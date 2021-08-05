const express = require("express");

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {
  validateReviewData,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  validateReviewData,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;

    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
