const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.createReview = async (req, res) => {
    const { campground_id } = req.params; // collect id from http params
    const { rating, body } = req.body.review; // collecting from form
    const author = req.user._id; // set author to current user._id
    const camp = await Campground.findById(campground_id).populate('reviews');
    const review = new Review({ body: body, rating: rating, author })
    camp.reviews.push(review);
    await review.save();
    const resp = await camp.save();
    console.log(resp);
    req.flash('success', 'successfully create new review')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { campground_id, review_id } = req.params;
    // we need to delete 1 in the campgrounds, 1 in the reviews collections
    await Review.findByIdAndDelete(review_id);
    await Campground.findByIdAndUpdate(campground_id, { $pull: { reviews: { review_id } } })
    // it will pull review id in the array of reviews
    req.flash('success', 'successfully delete review')
    res.redirect(`/campgrounds/${campground_id}`)
}