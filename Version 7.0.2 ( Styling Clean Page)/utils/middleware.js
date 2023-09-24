const Campground = require("../models/campground");
const { campgroundSchemaValidator, reviewSchemaValidator } = require('./schemasValidator')
const ExpressError = require('./ExpressError');
const Review = require("../models/review");

// create a check auth by using passport import syntax
module.exports.isLoggedIn = async function (req, res, next) {
    console.log('Current User... : ', req.user); // basically the pasport will store the serialize user in req.user
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be Signed in')
        req.flash('returnTo', req.originalUrl)  // save current path before redirecting to login
        // console.log(req.flash('returnTo'));
        return res.redirect('/users/login')
    }
    next()
}

module.exports.isAuthorCamp = async function (req, res, next) {
    const { id } = req.params
    const find = await Campground.findById(id);
    console.log(find);
    console.log(res.locals.currentUser);
    if (find.author.equals(res.locals.currentUser._id)) { // check whether the current user id is equal ObjectId with camp related author
        return next();
    }
    req.flash('error', 'You did not have permission to complete this action')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.isAuthorReview = async function (req, res, next) {
    const { campground_id, review_id } = req.params
    const find = await Review.findById(review_id);
    console.log(find);
    console.log(req.user);
    if (find.author.equals(req.user._id)) { // check whether the current user id is equal ObjectId with review related author
        return next();
    }
    req.flash('error', 'You did not have permission to complete this action')
    res.redirect(`/campgrounds/${campground_id}`)
}

module.exports.campgroundValidate = function (req, res, next) {
    const { error } = campgroundSchemaValidator.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.reviewValidate = function (req, res, next) {
    const { error } = reviewSchemaValidator.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}




