const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelpCampDB", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  // for (let i = 0; i < 200; i++) {
  //   const random1000 = Math.floor(Math.random() * 1000);
  //   const price = Math.floor(Math.random() * 20) + 10;
  //   const newCamp = new Campground({
  //     author: "610b67f6c9f72e2b507b0779",
  //     location: `${cities[random1000].city}, ${cities[random1000].state}`,
  //     title: `${sample(descriptors)} ${sample(places)}`,
  //     images: [
  //       {
  //         url: "https://res.cloudinary.com/ddbesc0xk/image/upload/v1628660651/YelpCamp/auwkzg1b9nffh7kzf7zh.jpg",
  //         filename: "YelpCamp/auwkzg1b9nffh7kzf7zh"
  //       },
  //       {
  //         url: "https://res.cloudinary.com/ddbesc0xk/image/upload/v1628660395/YelpCamp/mxtkibq2nvlerwal1jvt.jpg",
  //         filename: "YelpCamp/mxtkibq2nvlerwal1jvt"
  //       }
  //     ],
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. A, eligendi iure. Quas corrupti incidunt, esse voluptates animi blanditiis dolorem dolor.",
  //     price,
  //     geometry: {
  //       type: "Point",
  //       coordinates: [
  //         cities[random1000].longitude,
  //         cities[random1000].latitude
  //       ]
  //     }
  //   });

  //   await newCamp.save();
  // }
};

seedDB().then(() => {
  mongoose.connection.close();
});
