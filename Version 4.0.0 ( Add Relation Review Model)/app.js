const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const path = require('path');
const app = express();
const port = 3000;

// setting config readable usage
app.use(express.urlencoded({ extended: true })); // to parse the req body for post method
app.use(express.json()); // to compile the request data for post method
app.use(methodOverride('_method')); // enable patch, put, delete method

// setting config for project usage
app.engine('ejs', ejsMate) // setting template engine
app.set('view engine', 'ejs'); // setting engine to be viewing ejs file 
app.set('views', path.join(__dirname, 'views')) // direct views to our views folder with absolute path
app.use(express.static(path.join(__dirname, 'public'))) // so we can use public folder in our ejs

// connect database
mongoose.connect('mongodb://127.0.0.1:27017/camp-site')
    .then((data) => {
        console.log("Connected into Databases");
    })
    .catch((err) => {
        console.log('Failed To Connect');
        console.log(err);
    });

// connect Models
const Campground = require('./models/campground')
const Review = require('./models/review');

// connect Utils
const ExpressError = require('./utils/ExpressError');
const WrapAsync = require('./utils/WrapAsync');
const { campgroundSchemaValidator, reviewSchemaValidator } = require('./utils/schemasValidator');


// Middleware

function campgroundValidate(req, res, next) {
    const { error } = campgroundSchemaValidator.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

function reviewValidate(req, res, next) {
    const { error } = reviewSchemaValidator.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// Routes Campground

app.get('/', WrapAsync(async (req, res) => {
    res.redirect('/campgrounds');
}))

// Show All
app.get('/campgrounds', WrapAsync(async (req, res) => {
    const list = await Campground.find({});
    res.render('campgrounds/index', { list })
}))

// Create 
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})


app.post('/campgrounds', campgroundValidate, WrapAsync(async (req, res, next) => {
    const upload = await Campground.insertMany(req.body.campground)
    res.redirect('/campgrounds')
}))

// Show by ID
app.get('/campgrounds/:id', WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if (!camp) { // to HANDLE that camp is empty object because nothing found
        return next(new ExpressError('Id not found Error CODE 400 : Bad Request!', 400))
    }
    res.render('campgrounds/show', { camp });
}))

// update by id
app.get('/campgrounds/:id/edit', WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        return next(new ExpressError('Id not found Error CODE 400 : Bad Request!', 400))
    }
    res.render('campgrounds/edit', { camp });
}))

app.put('/campgrounds/:id', campgroundValidate, WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const upload = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
    res.redirect(`/campgrounds/${id}`);
}))

// Delete by id
app.delete('/campgrounds/:id', WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const found = await Campground.findByIdAndDelete(id);
    if (found.reviews.length) { // it will delete the relational data in campground model too (cascade)
        await Review.deleteMany({ _id: { $in: found.reviews } })
    }
    // console.log('Successfully Deleted! Data :', deleted);
    res.redirect('/campgrounds');
}))

// Review Routes
// Upload new Review
app.post('/campgrounds/:id/reviews', reviewValidate, WrapAsync(async (req, res) => {
    const { id } = req.params;
    const { rating, body } = req.body.review;
    const camp = await Campground.findById(id).populate('reviews');
    const review = new Review({ body: body, rating: rating })
    camp.reviews.push(review);
    await review.save();
    const resp = await camp.save();
    console.log(resp);
    res.redirect(`/campgrounds/${camp._id}`);
}))

// Delete Review
app.delete('/campgrounds/:campground_id/reviews/:review_id', WrapAsync(async (req, res) => {
    const { campground_id, review_id } = req.params;
    // we need to delete 1 in the campgrounds, 1 in the reviews collections
    await Review.findByIdAndDelete(review_id);
    await Campground.findByIdAndUpdate(campground_id, { $pull: { reviews: { review_id } } })
    // it will pull review id in the array of reviews
    res.redirect(`/campgrounds/${campground_id}`)
}))

// to catch user find other something that not in the browser routes we have been set!
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    if (!err.message) err.message = 'Oh No Something Went Wrong';
    if (!err.status) err.status = 500;
    res.status(err.status).render('error', { err })
})




app.listen(port, () => {
    console.log(`LISTENING TO PORT ${port}`);
})