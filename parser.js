const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const http = require('http');

console.log(`adminDistrict,adminDistrict2,formattedAddress,locality,postalCode,lat,lng`)
fs.createReadStream('./cuestionario.csv')
    .pipe(csv({
        delimiter: ','
    }))
    .on('data', (obj) => { 
        const postalCode = obj.Cpostal;
        http.get({
            hostname: 'dev.virtualearth.net',
            port: 80,
            path: `/REST/v1/Locations/ES/${postalCode}?maxResults=1&key=ArsjzRE81uDmO_cqBhYoUDk_UdCXVI1rFeIBMPRHxSQajZyX07_rJAHpeYJ8wCJb`,
            agent: false  // create a new agent just for this one request
        }, (res) => {
            //  console.log(res.data)
            //  console.log(`STATUS: ${res.statusCode}`);
            //  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                // console.log(`BODY: ${chunk}`);
                const data = JSON.parse(chunk),
                    resources = data.resourceSets[0].resources[0],
                    address = resources.address
                // console.log(`${address.adminDistrict},${address.adminDistrict2},${address.formattedAddress},${address.locality},${address.postalCode},${resources.geocodePoints[0].coordinates}`)
                console.log(`${address.adminDistrict},${address.adminDistrict2},${address.formattedAddress},${address.locality},${address.postalCode},${resources.geocodePoints[0].coordinates}`)
            });
            res.on('end', () => {
                // console.log('No more data in response.');
            });
        results.push(obj) 
    })
    .on('end', () => {});
    });
