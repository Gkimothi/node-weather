const request = require('request');

let geocodeAddress = (address, callback) => {
    let encodedAddr = encodeURIComponent(address);

    request( {
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddr}&key=${process.env.API_GOOGLE}`,
        json: true
    }, (error, response, body) => {
       //console.log(JSON.stringify(body, undefined, 2)); 
       if (error) {
           callback('Unable to connect');
       } else if (body.status === 'ZERO_RESULTS') {
           callback('Unable to find address');
       } else if (body.status === 'OK') {
           callback(undefined, {
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng
           });
       }
    });
};

module.exports = {
    //addNote: addNote
    geocodeAddress  //ES6 - same as above
}