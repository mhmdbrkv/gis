const express = require("express");
const NodeGeocoder = require("node-geocoder");
const axios = require("axios");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const Country = require("./models/country");
dotenv.config({ path: "./config.env" });

const options = {
  provider: "google",
  apiKey: process.env.apiKey,
};

const geocoder = NodeGeocoder(options);

const googleMapsClient = require("@google/maps").createClient({
  key: process.env.apiKey,
});

const app = express();

// body parser:
app.use(express.json());

app.get("/GEOCODING", (req, res) => {
  googleMapsClient.geocode(
    { address: "1600 Amphitheatre Parkway, Mountain View, CA" },
    function (err, response) {
      if (!err) {
        console.log(response.json.results);
        res.send(response.json.results);
      }
    }
  );
});

app.get("/schools", async (req, res) => {
  try {
    const country = "egypt";
    const borough = "ismailia";
    const category = "schools";
    // const nearTo = "sheikh zayed";
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${category}+${country}+${borough}&type=school&key=${process.env.apiKey}`
    );
    res.status(200).json({
      status: "success",
      data: {
        schools: data,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/restaurants", async (req, res) => {
  try {
    const country = "egypt";
    const borough = "ismailia";
    const category = "restaurants";
    // const nearTo = "soltan hussien";
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${category}+${country}+${borough}&type=restaurant&key=${process.env.apiKey}`
    );
    res.status(200).json({
      status: "success",
      data: {
        restaurants: data,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// 1) get all countries:
app.get("/country", async (req, res) => {
  try {
    const countries = await Country.find();
    return res.status(200).json({
      status: "success",
      data: {
        countries,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.post("/country", async (req, res) => {
  try {
    const country = await Country.create(req.body);
    console.log(country);
    console.log("body:", req.body);
    return res.status(201).json({
      status: "success",
      data: {
        country,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});
//get nearstplaces
app.get("/getNearestLocation", async (req, res) => {
  let maxDistance = req.query.maxDistance || 50000000000;

  const nearestPlaces = await Country.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [req.query.long, req.query.lat],
        },
        $maxDistance: maxDistance,
      },
    },
  });

  res.send(nearestPlaces);
});

// create index
//db.countries.createIndex( { "location" : "2dsphere" } )

// db.countries.find({
//   location: {
//     $near: {
//       $geometry: {
//         type: "Point",
//         coordinates: [33.41179760692598, 7.5353786188147],
//       },
//       $maxDistance: 50000000000,
//     },
//   },
// });

//30.618922602779403, 32.29460076516951

module.exports = app;
