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
    for (let index = 0; index < 20; index++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const priceRandom = 100 + Math.floor(Math.random() * 30) * 15
        const camp = new Campground({
            title: `${sample(type)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dypcebyz9/image/upload/v1694838527/Campsite%20Explorer/zufsjg5bcvbcnness0ft.jpg",
                    filename: "Campsite Explorer/zufsjg5bcvbcnness0ft"
                },
                {
                    url: "https://res.cloudinary.com/dypcebyz9/image/upload/v1694838595/Campsite%20Explorer/wunvu1zakecgtxnpmzyo.jpg",
                    filename: "Campsite Explorer/wunvu1zakecgtxnpmzyo"
                }],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.Quidem, impedit magnam necessitatibus numquam reprehenderit officia commodi esse vitae quasi amet provident ipsa quis ex quia ratione quo suscipit deserunt, adipisci minima, voluptatibus itaque? Labore optio iusto architecto unde eius non nobis.Ipsam, laudantium ducimus nam tenetur earum autem nobis aliquid!',
            price: priceRandom,
            author: '6502c58f1915ffd9dd24d0e3'
        })
        await camp.save();
    }
}
insertDB().then(() => mongoose.connection.close());