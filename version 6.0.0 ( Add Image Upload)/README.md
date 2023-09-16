
# Adding Multer to enable parsing multipart encoding type data
# Adding Couldinary to store Data like images
# Adding Image file upload feature for user
# Adding Env file Variable to store secret value variable ( for Development Process only) 
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
    
}