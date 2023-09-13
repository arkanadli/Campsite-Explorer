const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review')

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]

})

// :: CASCADE THE RELATIONAL DATA WHEN WE WANT TO DELETE
// :: you can delele it with or without middleware
// campgroundSchema.post('findOneAndDelete', async function (passedData) {
//     if (passedData.reviews.length) {
//         await Review.deleteMany({ _id: { $in: passedData.reviews } })
//     }
// })


const Campground = mongoose.model('Campground', campgroundSchema)
module.exports = Campground;
