const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const port = 3000;

// setting config readable usage
app.use(express.urlencoded({ extended: true })); // to parse the req body for post method
app.use(express.json()); // to compile the request data for post method
app.use(methodOverride('_method')); // enable patch, put, delete method

// setting config for project usage
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

// connect models
const Campground = require('./models/campground')

// Routes

app.get('/', async (req, res) => {
    res.render('home')
})

// Show All
app.get('/campgrounds', async (req, res) => {
    const list = await Campground.find({});
    res.render('campgrounds/index', { list })
})

// Create 
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const upload = await Campground.insertMany(req.body)
    res.redirect('/campgrounds')
})

// Show by ID
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', { camp });

})

// update by id
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const dataCamp = await Campground.findById(id);
    res.render('campgrounds/edit', { dataCamp });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const upload = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/campgrounds/${id}`);
})

// Delete by id
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    console.log('Successfully Deleted! Data :', deleted);
    res.redirect('/campgrounds');

})



app.get('*', (req, res) => {
    res.send('Connected')
})


app.listen(port, () => {
    console.log(`LISTENING TO PORT ${port}`);
})