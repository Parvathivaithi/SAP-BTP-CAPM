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

    
})