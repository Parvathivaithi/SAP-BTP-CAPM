// // const cds = require('@sap/cds');

// // module.exports = cds.service.impl(async function () {
// //    const { product } = this.entities;


// //    /*  this.on('READ',product,async(req)=>{
// //        const data = await SELECT.from(product).where({price:{'in':[100,3000]}})
// //        return data;
// //     }) */


// //    this.on('READ', product, async (req) => {
// //       const data = await SELECT.from(product).where({ price: { '<': 2000 } })
// //          .and({ status: 'Discontinued' });
// //       return data;
// //    })



// //    // function getData(){
// //    //    console.log("Hii , this is synchronous function ");
// //    //     setTimeout(()=>{
// //    //       console.log("This is the timeout function ");

// //    //    },3000);

// //    // }

// //    // async function getData2(){
// //    //    console.log("Hii this is asynchronous function ");
// //    //    setTimeout(()=>{
// //    //       console.log("This is the timeout function ");

// //    //    },3000);

// //    // }
// //    // const data2 =getData2();
// //    // const data = getData();


// // })


// const cds = require('@sap/cds');


// module.exports = cds.service.impl(async function () {
//     /* console.log(srv); */

//    // console.log(service1);
//     /* const service2=await cds.connect.to('secondAPI') */

//     //const { student } = service1.entities;
//     /* console.log(srv); */
//     /* service1.on('createService',async(req)=>{
//           console.log("This is the action ");
//           */
//     /* const result = await srv.read(student); */

//     /*  return {
//          message: "Successfully returned",
//         // data: result
//      }; */

//     /*  }) */
//     /* service1.before('READ',student,async(req)=>{
//         console.log("This is before handler");
//     })
//     service1.on('READ',student,async(req)=>{
//         console.log("This is on handler");

//     })
//     service1.after('READ','student',async(req)=>{
//         console.log("This is after handler");

//     }) */
//      console.log("THIS SERVICES :",this);
//      console.log(("cds services of :",cds.services));

//     this.on('READ', 'student', async (req) => {
//         const service1 = await cds.connect.to('secondAPI')
//         console.log(service1);
//         console.log(("cds services of :",cds.services));
//         const course = await service1.run(SELECT.from('course'))

//         console.log("This is on handler");

//     })
// })


const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { student } = this.entities;
   
    this.after('READ', 'student', (data) => {

        if (!Array.isArray(data)) {
            data = [data];
        }

        data.forEach((ele) => {
            ele.name = ele.firstname + ' ' + ele.secondname;
        });

    });
})