const express = require('express')
const User = require('../models/user');
const userControllers = require('../controllers/userControllers')
const WrapAsync = require('../utils/WrapAsync');
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const router = express.Router();

// middleware to check the current data on the login page will
const checkUser = passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' })

router.get('/register', userControllers.renderFormRegister)

router.post('/register', WrapAsync(userControllers.createUser))

router.get('/login', userControllers.renderFormLogin)

// check login from user by checkUser , a syntax from passport
router.post('/login', checkUser, userControllers.redirectLastPage)

router.get('/logout', userControllers.userLogout)

module.exports = router;