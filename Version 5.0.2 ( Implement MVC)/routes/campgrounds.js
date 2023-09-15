const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const campgroundControllers = require('../controllers/campgroundControllers')
const Review = require('../models/review');
const WrapAsync = require('../utils/WrapAsync');
const { isLoggedIn, isAuthorCamp, campgroundValidate } = require('../utils/middleware'); // adding middleware to check someone has login or not

// Show All
router.get('/', WrapAsync(campgroundControllers.index))

// Create 
router.get('/new', isLoggedIn, campgroundControllers.renderFormCreate)


router.post('/', isLoggedIn, campgroundValidate, WrapAsync(campgroundControllers.create))

// Show by ID
router.get('/:id', WrapAsync(campgroundControllers.showCampground))

// update by id
router.get('/:id/edit', isLoggedIn, isAuthorCamp, WrapAsync(campgroundControllers.renderFormEdit))

router.put('/:id', isLoggedIn, isAuthorCamp, campgroundValidate, WrapAsync(campgroundControllers.editCampground))

// Delete by id
router.delete('/:id', isLoggedIn, isAuthorCamp, WrapAsync())

module.exports = router;