const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { cities } = require('./cities');
const { type, places } = require('./nameGenerator')

mongoose.connect('mongodb://127.0.0.1:27017/camp-site')
    .then((data) => {
        console.log("Connected into Databases");
    })
    .catch((err) => {
        console.log('Failed To Connect');
        console.log(err);
    });

const newDB = async function () {
    const clear = await Campground.deleteMany({});
    console.log('CLEAR DB');
};
newDB();

const sample = function (array) {
    return array[Math.floor(Math.random() * array.length)]
}

const insertDB = async function () {
    for (let index = 0; index < 200; index++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const priceRandom = 100 + Math.floor(Math.random() * 30) * 15;
        const cityRandom = cities[random1000].city;
        const stateRandom = cities[random1000].state;
        const longtitudeRandom = cities[random1000].longitude;
        const latitudeRandom = cities[random1000].latitude;
        const camp = new Campground({
            title: `${sample(type)} ${sample(places)}`,
            location: `${cityRandom}, ${stateRandom}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dypcebyz9/image/upload/v1694838527/Campsite%20Explorer/zufsjg5bcvbcnness0ft.jpg",
                    filename: "Campsite Explorer/zufsjg5bcvbcnness0ft"
                },
                {
                    url: "https://res.cloudinary.com/dypcebyz9/image/upload/v1694838595/Campsite%20Explorer/wunvu1zakecgtxnpmzyo.jpg",
                    filename: "Campsite Explorer/wunvu1zakecgtxnpmzyo"
                }],
            description: "Escape to our campground site, where the world's most breathtaking views become your backyard. Imagine waking up to a sunrise that paints the sky with hues you've only seen in dreams, or gazing at a starlit panorama that feels like a portal to another world. Your next adventure begins here, where nature's grandeur takes center stage. Welcome to a campsite with an awe-inspiring view that will redefine your sense of wonder.",
            price: priceRandom,
            author: '6502c58f1915ffd9dd24d0e3',
            geometry:{type: "Point", coordinates: [longtitudeRandom,latitudeRandom]}
        })
        await camp.save();
    }
}
insertDB().then(() => mongoose.connection.close());