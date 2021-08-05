const express = require("express");

const catchAsync = require("../utils/catchAsync");
const {
  validateReviewData,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware");
const reviews = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  validateReviewData,
  catchAsync(reviews.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
