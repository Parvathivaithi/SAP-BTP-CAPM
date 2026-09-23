const cds = require('@sap/cds');
const axios = require('axios')
module.exports = cds.service.impl(async function () {
    const user = 'Paru';
    this.on('getDistrict', async (req) => {

        const state = req.data.state;
        console.log(state);
        if (!state) {
            req.error("Please give the state");
            return;
        }
        //  try{
        const response = await axios.get('https://secure.geonames.org/searchJSON',
            {
                params: {
                    country: 'IN',
                    featureCode: 'ADM2',
                    maxRows: 1000,
                    username: user

                }
            }
        );
        console.log(response);
        // if(!response.data || !response.data.geoname)
        // {
        //     req.error("Invalid response")
        // }

        const district = response.data.geonames.filter(d => d.fcode === 'ADM2' && d.adminName1.toLowerCase() === state.toLowerCase()).map(d => d.name);

        return district;
       
    })

    this.on('getPincodeDetails', async(req) => {
        const pincode = req.data.pincode;
        console.log(pincode);
        if (!pincode) {
            req.error("Please give the pincode");
            return;
        }

        const response = await axios.get('https://secure.geonames.org/postalCodeSearchJSON', {
            params: {
                postalcode: pincode,
                country: 'IN',
                maxRows: 1,
                username: user
            }
        }
        )
        const data = response.data.postalCodes[0];
        //return data;
        return {
            latitude:data.lat,
            longitude:data.lng,
            // state:data.adminName1,
            // district:data.adminName2,
            // city:data.placeName,
            // town:data.placeName
        }


        
    })
   this.on('getState', async (req) => {
    const country = req.data.country;
    if (!country) req.error("Please provide a country");

        let response = await axios.get('https://secure.geonames.org/searchJSON', {
            params: {
                country: country,
                featureCode: 'ADM1',
                maxRows: 1000,
                username: user
            }
        });


        const states = response.data.geonames.map(s => s.name);

        return states;

  
});


    this.on('getLatlongitude', async (req) => {

        const { house_no, street,city, state, country, pincode } = req.data;

        if (!street || !state || !country) {
            req.error(400, "street, state and country are required");
        }
        const fullAddress = `${house_no || ''} ${street}, ${city}, ${state}, ${country}, ${pincode || ''}`;
           console.log(fullAddress);
           
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: fullAddress,
                    format: 'json',
                    addressdetails: 1,
                    limit: 1
                },
                headers: {
                    'User-Agent': 'CAP-App'
                }
            });

            if (!response.data || response.data.length === 0) {
                req.error(404, "No location found for given address");
            }

            const loc = response.data[0];

            return {
                latitude: parseFloat(loc.lat),
                longitude: parseFloat(loc.lon),
            }
                // city: loc.address.city || loc.address.town || loc.address.village,
                // district: loc.address.county,
                // state: loc.address.state,
                // country: loc.address.country,
                // house_no: loc.address.house_number || house_no,
                // street: loc.address.road || street
    

    })
})