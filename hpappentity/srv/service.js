const cds = require('@sap/cds');
const { INSERT, UPSERT } = require('@sap/cds/lib/ql/cds-ql');


module.exports = cds.service.impl(async function(){
      
    const {hospital , department} = this.entities;
     

    // ! CREATE
    this.before('CREATE',department,(req)=>{
        const {hospitalNo} = req.data;
        if(!hospitalNo)
        {
            req.error("Please give the valid hospital Number");
        }

    })
    this.on('CREATE',department,async(req)=>{
        return await INSERT.into(department).entities(req.data);
    })

    this.after('CREATE',department,async(req)=>{
        data.message ="Department successfully created";
    })
    
    // ! UPDATE
    this.before('UPDATE',department,(req)=>{
        const {id} = req.data;
        if(!id)
        {
            req.error("Please give the valid ID ");
        }

    })
    this.on('UPDATE',department,async(req)=>{
        return await UPSERT(department)._set(req.data).where({id:id})
    })

    this.after('UPDATE',department,async(req)=>{
        data.message ="Department successfully Updated";
    })
 
    
    // ! DELETE
    this.before('DELETE',department,(req)=>{
        const {id} = req.data;
        if(!id)
        {
            req.error("Please give the valid id");
        }

    })
    this.on('DELETE',department,async(req)=>{
        const{id} = req.data;
        return await DELETE.from(department).where({id:id});
    })

    this.after('DELETE',department,async(req)=>{
        data.message ="Department successfully deleted";
    })







})