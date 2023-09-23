const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_API;
const geocodingService = mbxGeocoding({ accessToken: mapBoxToken });
const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const list = await Campground.find({});
    res.render('campgrounds/index', { list })
}

module.exports.renderFormCreate = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req, res, next) => {
    // console.log(geoData.body.features[0].geometry.coordinates); // return in geoJson object
    // res.send('gud')
    const created = new Campground(req.body.campground)
    created.author = res.locals.currentUser._id;
    created.images = req.files.map((f) => { // mapping to return array of object with particular value
        // console.log(f);
        return { url: f.path, filename: f.filename } // we collect only path and filename
    })
    const geoData = await geocodingService.forwardGeocode({
        // query: 'paris, france',
        query: req.body.campground.location,
        limit: 1
    }).send()
    created.geometry = geoData.body.features[0].geometry;
    await created.save();
    console.log(created);
    req.flash('success', `Successfully Create New Campground!!`);
    res.redirect(`/campgrounds/${created._id}`)
}


module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');
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
    // console.log('HEREEE', req.body);
    // const { title, location, price, description } = req.body.campground
    const images = req.files.map((file) => {
        return { url: file.path, filename: file.filename }
    })
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true });
    updatedCampground.images.push(...images);
    await updatedCampground.save();
    // :: delete if there is any image that user want to delete
    if (req.body.deleteImages) {
        // :: will delete the images in cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        // :: will pull the images.filename that matches to deletedImages Array
        await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        // console.log(updatedCampground.images);
    }

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