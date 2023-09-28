const User = require('../models/user')

module.exports.renderFormRegister = (req, res) => {
    res.render('users/register');
}

module.exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userIdentity = new User({ username, email });
        const newUser = await User.register(userIdentity, password); // set new user by register it with Passport syntax
        console.log(newUser);
        req.login(newUser, (err) => { // so that after registering, site state it as already login too
            // need to callback a function 
            if (err) return next(err);
            req.flash('success', 'Success login!')
            res.redirect('/campgrounds')
        })
        // req.flash.user_id = newUser._id;

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/users/register')
    }
}

module.exports.renderFormLogin = (req, res) => {
    res.render('users/login', { returnTo: req.flash('returnTo') }); // sending flash returnTo to variable in view login
}
module.exports.redirectLastPage = (req, res) => {
    const { returnTo } = req.body // collect returnTo from the input hidden in view login
    req.flash('success', 'Welcome back')
    // res.redirect('/campgrounds')
    console.log(returnTo);
    // res.send(returnTo);
    res.redirect(returnTo || '/'); // redirect to returnTo or / if null
}
module.exports.userLogout = (req, res, next) => {
    req.logout(function (err) { // logout user from current session, a syntax from passport
        if (err) { return next(err); }
        req.flash('success', 'Success Logout!')
        res.redirect('/campgrounds')
    });
}