const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const WrapAsync = require('../utils/WrapAsync');
const { campgroundSchemaValidator } = require('../utils/schemasValidator')
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../utils/middleware'); // adding middleware to check someone has login or not

function campgroundValidate(req, res, next) {
    const { error } = campgroundSchemaValidator.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



// Show All
router.get('/', WrapAsync(async (req, res) => {
    const list = await Campground.find({});
    res.render('campgrounds/index', { list })
}))

// Create 
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


router.post('/', isLoggedIn, campgroundValidate, WrapAsync(async (req, res, next) => {
    const created = new Campground(req.body.campground)
    await created.save();
    req.flash('success', `Successfully Create New Campground!!`);
    res.redirect(`/campgrounds/${created._id}`)
}))

// Show by ID
router.get('/:id', WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if (!camp) { // to HANDLE that camp is empty object because nothing found
        req.flash('error', 'Error cannot find current campground, campground not found!')
        res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { camp });
}))

// update by id
router.get('/:id/edit', isLoggedIn, WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Error cannot find current campground, campground not found!')
        res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { camp });
}))

router.put('/:id', isLoggedIn, campgroundValidate, WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const upload = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
    req.flash('success', `Successfully Saved New Edit!`);
    res.redirect(`/campgrounds/${id}`);
}))

// Delete by id
router.delete('/:id', isLoggedIn, WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const found = await Campground.findByIdAndDelete(id);
    if (found.reviews.length) { // it will delete the relational data in campground model too (cascade)
        await Review.deleteMany({ _id: { $in: found.reviews } })
    }
    // console.log('Successfully Deleted! Data :', deleted);
    req.flash('success', `Successfully Deleted!`);
    res.redirect('/campgrounds');
}))

module.exports = router;