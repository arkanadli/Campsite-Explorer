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
//secure
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
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

//setting config readable usage
app.use(express.urlencoded({
    extended: true
})); // to parse the req body for post method
app.use(express.json()); // to compile the request data for post method
app.use(methodOverride('_method')); // enable patch, put, delete method

// setting config for project usage
app.engine('ejs', ejsMate) // setting template engine
app.set('view engine', 'ejs'); // setting engine to be viewing ejs file 
app.set('views', path.join(__dirname, 'views')) // direct views to our views folder with absolute path
app.use(express.static(path.join(__dirname, 'public'))) // so we can use public folder in our ejs

// Use Sanitize mongo, to prevent mongo injection from req.body, query and etc..
app.use(
    mongoSanitize({
        replaceWith: '_', // if there are a forbidden symbol, it will replaced with _ (example = $ will be replace with _)
    }),
);


// Use helmet to covering up almost most of the secure

app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://fonts.gstatic.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dypcebyz9/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



// setting session and flash config
const configSession = {
    name: '_map', // it will trick the penetrator, that our cookiesid name was change into _map
    secret: 'shoulbeinenvVariable', // secret code that it should be valued by the env variable 
    resave: false, // frmlty
    saveUninitialized: true, // frmlty
    cookie: { // setting up cookie, cookie will store the season id, so the data in session will expire for a week
        httpOnly: true, // make the cookies only in http req, cannot be show up in script
        // secure:true, // make sure that the http later when we deploy is secure connection only
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(configSession))
app.use(flash());
app.use(passport.initialize()); // initialize passport setup ver 5.0.0
app.use(passport.session()) // initialize passport so that it can store in app session ver 5.0.0

// setting local flash
app.use((req, res, next) => {
    console.log(req.query); // show current query
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
    res.status(err.status).render('error', {
        err
    })
})




app.listen(port, () => {
    console.log(`LISTENING TO PORT ${port}`);
})