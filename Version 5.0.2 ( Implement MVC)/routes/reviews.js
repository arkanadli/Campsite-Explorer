const express = require('express');
const router = express.Router({ mergeParams: true }); // to make our params for route in main and this file can connect to each other
const WrapAsync = require('../utils/WrapAsync')
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewControllers = require('../controllers/reviewControllers')
const { reviewValidate, isLoggedIn, isAuthorReview } = require('../utils/middleware')

router.post('/', isLoggedIn, reviewValidate, WrapAsync(reviewControllers.createReview))

// Delete Review
router.delete('/:review_id', isLoggedIn, isAuthorReview, WrapAsync(reviewControllers.deleteReview))

module.exports = router;