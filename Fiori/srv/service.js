const cds = require('@sap/cds');
const { UPDATE, SELECT, INSERT, orders } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    const { customers, Book, orders } = this.entities;
    this.on('Delivered', async (req) => {
        const { ID } = req.params[0];
        console.log(ID);
        const customerdata = await SELECT.one.from(customers).where({ ID });
        console.log(customerdata);
        const update_data = await UPDATE(customers).set({ status: 'Delivered' }).where({ ID: ID })


        const statusdata = await SELECT.one.from(customers).where({ ID });
        const status = statusdata.status;
        console.log(status);

        console.log(statusdata);



        if (status === 'Shipped') {
            await UPDATE(customers).set({ criticality: 2 }).where({ ID: ID })
        }
        else if (status === 'Pending') {
            await UPDATE(customers).set({ criticality: 1 }).where({ ID: ID })
        }
        else if (status === 'Delivered') {
            await UPDATE(customers).set({ criticality: 3 }).where({ ID: ID })
        }
        else {
            await UPDATE(customers).set({ criticality: 0 }).where({ ID: ID })
        }


        const data = await SELECT.from(customers).where({ ID })
        console.log(update_data);
        console.log(data);




    })

    this.before('CREATE', customers, async (req) => {
        console.log("hi");


        const status = req.data.status;
        console.log(status);
        console.log(req.data.criticality);

        req.data.status = "Pending";
        req.data.criticality = 1;



    })

    this.on('bookQuantity', async (req) => {
        const { ID } = req.data;
        console.log(ID);
        if (!ID) {
            req.warn("ID is mandatory Ok 😒😒😒😒");
            return;
        }

        const data = await SELECT.one.from(Book).where({ id: ID });
        console.log(data);


        const qty = data?.Total_Quantity;

        req.info(`Available quantity is ${qty}`);

        return;

    })

    this.on('shipping', async (req) => {
        const { ID } = req.params[0];
        console.log(ID);
        const customerdata = await SELECT.one.from(customers).where({ ID });
        console.log(customerdata);
        const update_data = await UPDATE(customers).set({ status: 'Shipped' }).where({ ID: ID })

        const statusdata = await SELECT.one.from(customers).where({ ID });
        const status = statusdata.status;
        console.log(status);


        if (status === 'Shipped') {
            await UPDATE(customers).set({ criticality: 2 }).where({ ID: ID })
        }
        else if (status === 'Pending') {
            await UPDATE(customers).set({ criticality: 1 }).where({ ID: ID })
        }
        else if (status === 'Delivered') {
            await UPDATE(customers).set({ criticality: 3 }).where({ ID: ID })
        }
        else {
            await UPDATE(customers).set({ criticality: 0 }).where({ ID: ID })
        }


        const data = await SELECT.from(customers).where({ ID })
        console.log(update_data);
        console.log(data);



    })

    this.before('shipping', async (req) => {
        const id = req.params[0].ID;
        console.log(id);

        const customer = await SELECT.one.from(customers).where({ ID: id });
        console.log(customer);


        if (customer.status === 'Shipped') {
            req.reject(403, 'Shipping already done');
        }
    });

    this.before('Delivered', async (req) => {
        const id = req.params[0].ID;

        const customer = await SELECT.one.from(customers).where({ ID: id });

        if (customer.status === 'Delivered') {
            req.reject(403, 'Already delivered');
        }
    });

    this.before('Create', async (req) => {
        const { Book_id_id, customer_id_ID } = req.data;
        console.log(Book_id_id, customer_id_ID);

        const bookData = await SELECT.one.from(Book).where({ id: Book_id_id });
        console.log(bookData);

        const customerData = await SELECT.one.from(customers).where({ ID: customer_id_ID });

        if (!bookData && customerData) {
            req.error('Please give the proper book ID : ');
            return;
        }


         else if (!customerData && bookData) {
            req.error('Please give the proper customer ID : ');
            return
        }

        else if(!customerData && !bookData)
        {
            req.error('please give the proper customer ID and Proper Book ID');
            return
        }

        const updateBookCount = await UPDATE(Book).set({ Total_Quantity: (bookData.Total_Quantity - req.data.no_of_quantity) }).where({ id: Book_id_id });


    })

    this.on('Create', async (req) => {

        const { ID, no_of_quantity, Date, Book_id_id, customer_id_ID } = req.data
        console.log(ID, no_of_quantity, Date, Book_id_id, customer_id_ID);
        // const BookData = await SELECT.one.from(Book).where({id:Book_id_id});
        // console.log(BookData);


        // const BookName = BookData.B_name;
        const newOrders = {
            ID,
            no_of_quantity,
            Date,
            Book_id_id,
            customer_id_ID
        }
        const Data = await INSERT.into(orders).entries(req.data);
        console.log(Data);
        const InsertedData = await SELECT.one.from(orders).where({ ID: req.data.ID });
        console.log(InsertedData);


        req.notify("Data Inserted Successfully");
        return;



    })

})

//For Draft only
// NEW → when creating a draft                   !!!
// PATCH → when editing draft data
// SAVE → when activating draft
// EDIT → when switching to edit mode