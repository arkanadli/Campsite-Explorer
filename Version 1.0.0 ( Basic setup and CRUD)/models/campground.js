const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    }

})

module.exports = mongoose.model('Campground', campgroundSchema)
