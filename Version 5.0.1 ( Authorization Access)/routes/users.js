const express = require('express')
const User = require('../models/user');
const WrapAsync = require('../utils/WrapAsync');
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const router = express.Router();

// middleware to check the current data on the login page will
const checkUser = passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' })

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', WrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userIdentity = new User({ username, email });
        const newUser = await User.register(userIdentity, password);
        console.log(newUser);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Campground')
            res.redirect('/campgrounds')
        })
        // req.flash.user_id = newUser._id;

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/users/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login', { returnTo: req.flash('returnTo') }); // sending flash returnTo to variable in view login
})

router.post('/login', checkUser, (req, res) => {
    const { returnTo } = req.body // collect returnTo from the input hidden in view login
    req.flash('success', 'Welcome back')
    // res.redirect('/campgrounds')
    console.log(returnTo);
    // res.send(returnTo);
    res.redirect(returnTo || '/'); // redirect to returnTo or / if null
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Success Logout!')
        res.redirect('/campgrounds')
    });


})

module.exports = router;