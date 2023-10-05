const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');
const { type } = require('../seeds/nameGenerator');

const opts = { toJSON: { virtuals: true } }; // to include the properties.popUpMark

const imageSchema = new Schema({
    url: String,
    filename: String
})

// normal url we store in DB : https://res.cloudinary.com/demo/image/upload/docs/models.jpg
// url to request some modification https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,w_250/docs/models.jpg

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_150')
})

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
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
    ,
    location: {
        type: String,
        required: true
    },
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts)

campgroundSchema.virtual('properties.popUpMarkup').get(function (){
    return `<h6>${this.title}</h6><p>${this.location}</p><a class="btn btn-primary" href="/campgrounds/${this._id }">View</a>`
});

// :: CASCADE THE RELATIONAL DATA WHEN WE WANT TO DELETE
// :: you can delele it with or without middleware
// campgroundSchema.post('findOneAndDelete', async function (passedData) {
//     if (passedData.reviews.length) {
//         await Review.deleteMany({ _id: { $in: passedData.reviews } })
//     }
// })


const Campground = mongoose.model('Campground', campgroundSchema)
module.exports = Campground;
