require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const port = process.env.PORT || 3000;

let app = express();

app.set('view engine', 'hbs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    getDetails('St Joseph, MO, USA', res);
    // res.render('home.hbs', {
    //     pageTitle: 'Weather App - Weather'
    // });

});

app.post('/', (req, res) => {
    console.log(req.body.inputAddress);
    getDetails(req.body.inputAddress, res);
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});


let getDetails = (addr, res) => {
    geocode.geocodeAddress(addr, (errorMsg, results) => {
    if (errorMsg) {
        console.log(errorMsg);
    } else {
        console.log(results.address);
        console.log(results.latitude);
        console.log(results.longitude);
        weather.getWeather(results.address, results.latitude, results.longitude, (errorMsg, weatherResults) => {
            if (errorMsg) {
                console.log(errorMsg);
            } else {
                //console.log(`It's currently ${weatherResults.currentlyTemp}. It feels like ${weatherResults.currentlyApparentTemp}.`);
                //console.log(`Low: ${weatherResults.dailyLow}`);

                if (weatherResults.currentlyUvIndex <= 2) {
                    uVIndexSpanId = 'green';
                } else if (weatherResults.currentlyUvIndex >= 3 & weatherResults.currentlyUvIndex <= 5) {
                    uVIndexSpanId = 'yellow';
                } else if (weatherResults.currentlyUvIndex >= 6 & weatherResults.currentlyUvIndex <= 7) {
                    uVIndexSpanId = 'orange';
                } else if (weatherResults.currentlyUvIndex >= 8 | weatherResults.currentlyUvIndex <= 10) {
                    uVIndexSpanId = 'red';
                } else if (weatherResults.currentlyUvIndex >= 11) {
                    uVIndexSpanId = 'purple';
                }
                res.render('home.hbs', {
                    pageTitle: 'Weather App - Weather',
                    currentlyTemp: weatherResults.currentlyTemp,
                    currentlyApparentTemp:weatherResults.currentlyApparentTemp,
                    currentlySummary: weatherResults.currentlySummary,
                    currentlyWindSpeed: weatherResults.currentlyWindSpeed,
                    currentlyWindBearing: weatherResults.currentlyWindBearing,
                    currentlyHumidity: Math.round(weatherResults.currentlyHumidity*100),
                    currentlyDewPoint: weatherResults.currentlyDewPoint,
                    currentlyUvIndex: weatherResults.currentlyUvIndex,
                    uVIndexSpanId: uVIndexSpanId,
                    currentlyVisibility: Math.round(weatherResults.currentlyVisibility),
                    currentlyPressure: Math.round(weatherResults.currentlyPressure),
                    dailyLow: weatherResults.dailyLow,
                    dailyHigh: weatherResults.dailyHigh,
                    hourlySummary: weatherResults.hourlySummary,
                    iconImg: weatherResults.currentlyIcon,
                    location: results.address,
                    lat: results.latitude,
                    lng: results.longitude,
                    hours: weatherResults.hours,
                    temps:weatherResults.temps,
                    timelineColors: weatherResults.timelineColors,
                    dailySummary: weatherResults.dailySummary,
                    weeklyDetails: weatherResults.weeklyDetails
                });
            }
        });
    }
    });
};