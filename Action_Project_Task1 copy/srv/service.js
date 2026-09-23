const cds = require('@sap/cds');
const { INSERT, UPDATE, SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function ()
{
    const {Products,Customers,Orders}= this.entities;

    this.on('CreateProductsCustomers',async(req)=>{
        const{customer,product}=req.data;
        await this.send({event:'addProduct',data:{product}});
        await this.send({event:'addCustomer',data:{customer}});
    })

    this.on('addProduct',async(req)=>{
        const{product}=req.data;
        const addpro = await INSERT.into(Products).entries(product);
        return `${product.length} have been inserted`;
    });
    this.on('addCustomer',async(req)=>{
        const{customer} = req.data;
        const addcus = await INSERT.into(Customers).entries(customer);
        return `${customer.length} have been inserted`
    })
    this.on('placeOrder', async (req) => {

    const { order } = req.data;
    console.log(order);
    console.log(order.ID);
    console.log(order.Product_id_ID);
    
    const productData = await SELECT.from(Products).where({ID:order.Product_id_ID})
    console.log(productData);
    order.Total_Price = order.quantity * productData[0].Price;
     
    
    await INSERT.into(Orders).entries(order);

    const Od = await SELECT.from(Orders).where({ ID: order.ID });
    console.log(Od);
 
    await this.send({
        event: 'reduceStock',
        data: { ID: order.Product_id_ID, quantity: order.quantity }
    });

    return "Order Placed Successfully";
});


this.on('reduceStock', async (req) => {

    const { ID, quantity } = req.data;
    console.log(ID, quantity);

    const product = await SELECT.one.from(Products).where({ ID: ID });

    if (!product) {
        return req.error("Product not found");
    }

    if (product.No_Of_Stock < quantity) {
        return req.error("Not enough stock");
    }

    await UPDATE(Products)
        .set({ No_Of_Stock: product.No_Of_Stock - quantity })
        .where({ ID: ID });

    return "Stock reduced successfully";
});

   
})






// {
    
//    "product":[{
//       "ID": "2",
//       "Pro_Name": "Kurti",
//       "Price": 50,
//       "No_Of_Stock": 50,
//       "Order_Id_ID": "1"
//     }],
//     "customer": [{
//       "ID": "2",
//       "Name": "Keeri",
//       "Address": "Madurai",
//       "Contact_No": 9764678,
//       "Alternative_Contact_No": 9678658
//     }]

// }


// {
//      "order":{ "ID": "3",
//       "quantity": 4,
//       "Product_id_ID": "2",
//       "Customer_Id_ID": "2"
//     }
// }