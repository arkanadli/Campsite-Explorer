const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer') // adding parse multipart encoding type
const { storage } = require('../cloudinary/index')
const upload = multer({ storage }) // adding upload.single for 1 image(file), and .array for more files
const Campground = require('../models/campground');
const campgroundControllers = require('../controllers/campgroundControllers')
const Review = require('../models/review');
const WrapAsync = require('../utils/WrapAsync');
const { isLoggedIn, isAuthorCamp, campgroundValidate } = require('../utils/middleware'); // adding middleware to check someone has login or not
const { route } = require('./users');

// Show All
router.get('/', WrapAsync(campgroundControllers.index))

// Create 
router.get('/new', isLoggedIn, campgroundControllers.renderFormCreate)


router.post('/', isLoggedIn, upload.array('campground[image]'), campgroundValidate, WrapAsync(campgroundControllers.create))
// router.post('/', upload.array('campground[image]'), (req, res) => {
//     console.log(req.body, req.files) // req.body will be all besides the files, and req.files are only show uploaded file in form
//   res.send('it works')
// })

// Show by ID
router.get('/:id', WrapAsync(campgroundControllers.showCampground))

// update by id
router.get('/:id/edit', isLoggedIn, isAuthorCamp, WrapAsync(campgroundControllers.renderFormEdit))

router.put('/:id', isLoggedIn, isAuthorCamp, upload.array('campground[image]'), campgroundValidate, WrapAsync(campgroundControllers.editCampground))

// Delete by id
router.delete('/:id', isLoggedIn, isAuthorCamp, WrapAsync(campgroundControllers.deleteCampground))

// Redirect returnTo review submition
router.get('/:id/reviews', campgroundControllers.returnTo)

module.exports = router;