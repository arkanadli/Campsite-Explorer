if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET);
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate') // import ejs-mate
const passport = require('passport')
const LocalStrategy = require('passport-local')
const path = require('path');
const app = express();
const port = 3000;
const ExpressError = require('./utils/ExpressError'); // adding additional express error template
const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')
const usersRouter = require('./routes/users') // ver 5.0.0
const User = require('./models/user') // ver 5.0.0

// setting config readable usage
app.use(express.urlencoded({ extended: true })); // to parse the req body for post method
app.use(express.json()); // to compile the request data for post method
app.use(methodOverride('_method')); // enable patch, put, delete method

// setting config for project usage
app.engine('ejs', ejsMate) // setting template engine
app.set('view engine', 'ejs'); // setting engine to be viewing ejs file 
app.set('views', path.join(__dirname, 'views')) // direct views to our views folder with absolute path
app.use(express.static(path.join(__dirname, 'public'))) // so we can use public folder in our ejs

// setting session and flash config
const configSession = {
    secret: 'shoulbeinenvVariable', // secret code that it should be valued by the env variable 
    resave: false, // frmlty
    saveUninitialized: true, // frmlty
    cookie: { // setting up cookie, cookie will store the season id, so the data in session will expire for a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(configSession))
app.use(flash());
app.use(passport.initialize()); // initialize passport setup ver 5.0.0
app.use(passport.session())// initialize passport so that it can store in app session ver 5.0.0

// setting local flash
app.use((req, res, next) => {
    res.locals.success = req.flash('success') // so that all file can now access variable success as a flash variable
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user; // store current user to the locals
    next();
})

// use static authenticate method by p.local.mongoose of model in LocalStrategy ver 5.0.0
passport.use(new LocalStrategy(User.authenticate()))

// use static serialize and deserialize of model for passport session support ver 5.0.0
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connect database
mongoose.connect('mongodb://127.0.0.1:27017/camp-site')
    .then((data) => {
        console.log("Connected into Databases");
    })
    .catch((err) => {
        console.log('Failed To Connect');
        console.log(err);
    });

//Routes

app.get('/', (req, res) => {
    res.render('home');
})

//connect to external route
app.use('/users', usersRouter)
app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:campground_id/reviews', reviewsRouter)

// to catch user find other something that not in the browser routes we have been set!
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Catch if there is any error
app.use((err, req, res, next) => {
    if (!err.message) err.message = 'Oh No Something Went Wrong';
    if (!err.status) err.status = 500;
    res.status(err.status).render('error', { err })
})




app.listen(port, () => {
    console.log(`LISTENING TO PORT ${port}`);
})