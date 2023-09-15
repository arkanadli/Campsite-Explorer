const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const list = await Campground.find({});
    res.render('campgrounds/index', { list })
}

module.exports.renderFormCreate = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req, res, next) => {
    const created = new Campground(req.body.campground)
    created.author = res.locals.currentUser._id;
    await created.save();
    req.flash('success', `Successfully Create New Campground!!`);
    res.redirect(`/campgrounds/${created._id}`)
}


module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    });
    // console.log(camp);
    // console.log(res.locals.currentUser);
    if (!camp) { // to HANDLE that camp is empty object because nothing found
        req.flash('error', 'Error cannot find current campground, campground not found!')
        res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { camp });
}
module.exports.renderFormEdit = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Error cannot find current campground, campground not found!')
        res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { camp });
}
module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const upload = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
    req.flash('success', `Successfully Saved New Edit!`);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const found = await Campground.findByIdAndDelete(id);
    if (found.reviews.length) { // it will delete the relational data in campground model too (cascade)
        await Review.deleteMany({ _id: { $in: found.reviews } })
    }
    // console.log('Successfully Deleted! Data :', deleted);
    req.flash('success', `Successfully Deleted!`);
    res.redirect('/campgrounds');
}