const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const s4 = await cds.connect.to('API_BUSINESS_SITUATION_SRV');
    const loc = await cds.connect.to('location');
    this.on('READ', 'datacontext', async (req) => {
        const result = await s4.run(req.query);
        return result;
    })
    this.on('getlocation', async (req) => {
        const { pincode } = req.data;
        console.log(pincode);
        const location = await loc.get(`/postalCodeSearchJSON?postalcode=${pincode}&country=IN&maxRows=1&username=paru`)
        console.log(location);
        const data = location.postalCodes[0];
        return {
            latitude: data.lat,
            longitude: data.lng,
            state: data.adminName1,
            district: data.adminName2 || null,
            city: data.placeName,
            town: data.placeName
        };

    })
})