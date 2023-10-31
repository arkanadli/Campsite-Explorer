
# Adding Security For Mongo Injection Issues
# Adding Security For XSS With Own Script With JOI
# Adding Cookies Security
# Adding Security Packages Helmet For Covering Standart Security Issues.

# Dependencies Uses :
{ 
    "connect-flash": "^0.1.1", // Enable Session and Flash
    "ejs": "^3.1.9", // Enable embedded java script in ejs file
    "ejs-mate": "^4.0.0", // Enable embedded JS File template layouting
    "express": "^4.18.2", // Enable to Create Server based on local
    "express-session": "^1.17.3", // Enable app to create session, User can store their temporary data on site
    "joi": "^17.10.1", // Enable Error Schema Validator
    "method-override": "^3.0.0", // Enable other method post for HTML5 (add Delete ,Post, Put, etc)
    "mongoose": "^7.5.0" // Create Database so that the app can actually store the data
    "passport": "^0.6.0", // Enabling auth by local, google, etc.
    "passport-local": "^1.0.0", // Use Local Strategy to check auth
    "passport-local-mongoose": "^8.0.0" // Use Local Strategy Integrated with mongoose
    "multer": "^1.4.5-lts.1", // Enable Reading multipart Encoding type so that we can store file
    "cloudinary": "^1.40.0", // Enable app to store big data like images
    "multer-storage-cloudinary": "^4.0.0", // Integrated cloudinary to multer
    "@mapbox/mapbox-sdk": "^0.15.3", // Enable app to integrated with maps feature
    "express-mongo-sanitize": "^2.2.0", // Package to Sanitize mongo db input data 
    "helmet": "^7.0.0", // Almost Encounter Standart Issues
    "sanitize-html": "^2.11.0" // Giving secure for Sanitize the request atempt, using it in scheme validator    
}