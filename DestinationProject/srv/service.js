const cds = require('@sap/cds');
module.exports = cds.service.impl(async function (){
    const {students} = this.entities;
    this.on('CREATE',students,async(req)=>{
        const latlon = await cds.connect.to("LatLon");
        const result = await latlon.send({
            method:'GET',
            path:`/odata/v4/api/getPincodeDetails(pincode='${req.data.pincode}')`
        })
        req.data.latitude =result.latitude;
        req.data.longitude = result.longitude;
        
        const insertStudent = await INSERT.into(students).entries(req.data);
        return insertStudent;
    })


    this.on('getDistrict',async(req)=>{
        const Dest = await cds.connect.to("Desti");
        const result = await Dest.send({
            method:'GET',
            path:`/odata/v4/api/getDistrict(state='${req.data.state}')`
        })

        return result;
    })
})