
# Adding Error Handling, to all async function
# Change The req.body.value(name) in new and edit views so its inside campground object
# Adding Schemas Validator by using Joi
# Adding Validator Middleware to each request routes needed
# Dependencies Uses :
{ 
    "ejs": "^3.1.9", // Enable embedded java script in ejs file
    "ejs-mate": "^4.0.0", // Enable embedded JS File template layouting
    "express": "^4.18.2", // Enable to Create Server based on local
    "joi": "^17.10.1", // Enable Error Schema Validator
    "method-override": "^3.0.0", // Enable other method post for HTML5 (add Delete ,Post, Put, etc)
    "mongoose": "^7.5.0" // Create Database so that the app can actually store the data
}