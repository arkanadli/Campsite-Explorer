const express = require('express');
const router = express.Router({ mergeParams: true }); // to make our params for route in main and this file can connect to each other
const WrapAsync = require('../utils/WrapAsync')
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewValidate, isLoggedIn, isAuthorReview } = require('../utils/middleware')

router.post('/', isLoggedIn, reviewValidate, WrapAsync(async (req, res) => {
    const { campground_id } = req.params;
    const { rating, body } = req.body.review;
    const author = req.user._id;
    const camp = await Campground.findById(campground_id).populate('reviews');
    const review = new Review({ body: body, rating: rating, author })
    camp.reviews.push(review);
    await review.save();
    const resp = await camp.save();
    console.log(resp);
    req.flash('success', 'successfully create new review')
    res.redirect(`/campgrounds/${camp._id}`);
}))

// Delete Review
router.delete('/:review_id', isLoggedIn, isAuthorReview, WrapAsync(async (req, res) => {
    const { campground_id, review_id } = req.params;
    // we need to delete 1 in the campgrounds, 1 in the reviews collections
    await Review.findByIdAndDelete(review_id);
    await Campground.findByIdAndUpdate(campground_id, { $pull: { reviews: { review_id } } })
    // it will pull review id in the array of reviews
    req.flash('success', 'successfully delete review')
    res.redirect(`/campgrounds/${campground_id}`)
}))

module.exports = router;