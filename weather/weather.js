const request = require('request');
const moment = require('moment');

let getWeather = (addr, lat, lng, callback) => {
    request( {
        url: `https://api.darksky.net/forecast/${process.env.API_DARKSKY}/${lat},${lng}`,
        json: true
    }, (error, response, body) => {
       //console.log(JSON.stringify(body, undefined, 2)); 
       if (error) {
           callback('Unable to connect to Darksky server');
       } else if (response.statusCode === 400) {
            callback('Unable to fetch weather');
       } else if (response.statusCode === 200) {
            let hours = ['Now'];
            for (i=2; i < 24; i+=2) {
                hour = moment(moment.unix(body.hourly.data[i].time), 'ddd DD-MMM-YYYY, h A').format('h a')
                //console.log(hour);
                hours.push(hour);
                //console.log(i);
                //console.log(hours);
            }
            //console.log(hours.length);
            let timelineColors = [];
            for (i=0; i < 24; i++) {
                //hour = moment(moment.unix(body.hourly.data[i].time), 'ddd DD-MMM-YYYY, h A').format('h a')
                //console.log(hour);
                //hours.push(hour);
                if (body.hourly.data[i].icon === 'clear-day' || body.hourly.data[i].icon === 'clear-night') {
                    timelineColors.push('grey1');
                } else if (body.hourly.data[i].icon === 'partly-cloudy-day' || body.hourly.data[i].icon === 'partly-cloudy-night' || body.hourly.data[i].icon === 'cloudy' || body.hourly.data[i].icon === 'wind' || body.hourly.data[i].icon === 'fog') {
                    if (body.hourly.data[i].cloudCover < 0.25) {
                        timelineColors.push('grey2');
                    } else if (body.hourly.data[i].cloudCover >=0.25 && body.hourly.data[i].cloudCover < 0.59375) {
                        timelineColors.push('grey2');
                    } else if (body.hourly.data[i].cloudCover >= 0.59375 && body.hourly.data[i].cloudCover < 0.93750) {
                        timelineColors.push('grey3');
                    } else timelineColors.push('grey4');
                } else if (body.hourly.data[i].icon === 'rain') {
                    timelineColors.push('blue1');
                } else if (body.hourly.data[i].icon === 'sleet') {
                    timelineColors.push('blue2');
                } else if (body.hourly.data[i].icon === 'snow') {
                    timelineColors.push('blue3');
                }
                //console.log(body.hourly.data[i].icon);
                //console.log(body.hourly.data[i].cloudCover);
                //console.log(timelineColors);
            }
            //console.log(hours);
            //console.log(timelineColors);
            //console.log(typeof(timelineColors[0]));
           callback(undefined, {
            currentlyTemp: body.currently.temperature,
            currentlyApparentTemp: body.currently.apparentTemperature,
            currentlySummary: body.currently.summary,
            currentlyWindSpeed: body.currently.windSpeed,
            currentlyWindBearing: body.currently.windBearing,
            currentlyHumidity: body.currently.humidity,
            currentlyDewPoint: body.currently.dewPoint,
            currentlyUvIndex: body.currently.uvIndex,
            currentlyVisibility: body.currently.visibility,
            currentlyPressure: body.currently.pressure,
            dailyLow: body.daily.data[0].temperatureLow,
            dailyHigh: body.daily.data[0].temperatureHigh,
            hourlySummary: body.hourly.summary,
            currentlyIcon: body.currently.icon,
            hours: hours,
            timelineColors: timelineColors
           });
       }
    });
}

module.exports.getWeather = getWeather;