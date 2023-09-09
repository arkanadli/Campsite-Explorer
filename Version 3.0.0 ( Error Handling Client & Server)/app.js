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

// connect Utils
const ExpressError = require('./utils/ExpressError');
const WrapAsync = require('./utils/WrapAsync');
const { campgroundSchemaValidator } = require('./utils/schemas');



// Routes

app.get('/', WrapAsync(async (req, res) => {
    res.render('home')
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

function campgroundValidate(req, res, next) {
    const { error } = campgroundSchemaValidator.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' , ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.post('/campgrounds', campgroundValidate, WrapAsync(async (req, res, next) => {
    const upload = await Campground.insertMany(req.body.campground)
    res.redirect('/campgrounds')
}))

// Show by ID
app.get('/campgrounds/:id', WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
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
    const deleted = await Campground.findByIdAndDelete(id);
    console.log('Successfully Deleted! Data :', deleted);
    res.redirect('/campgrounds');
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