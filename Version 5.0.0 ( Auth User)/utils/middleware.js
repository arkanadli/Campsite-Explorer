// create a check auth by using passport import syntax
const isLoggedIn = async function (req, res, next) {
    console.log('Current User... : ', req.user); // basically the pasport will store the serialize user in req.user
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be Signed in')
        req.flash('returnTo', req.originalUrl)  // save current path before redirecting to login
        // console.log(req.flash('returnTo'));
        return res.redirect('/users/login')
    }
    next()
}
module.exports.isLoggedIn = isLoggedIn;

