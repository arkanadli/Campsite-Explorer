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
    for (let index = 0; index < 50; index++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(type)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save();
    }
}
insertDB().then(() => mongoose.connection.close());