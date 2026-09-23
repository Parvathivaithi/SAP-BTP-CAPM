const cds = require('@sap/cds');
const axios = require('axios');
const { SELECT, INSERT, DELETE, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
module.exports = cds.service.impl(async function () {
    const { vehicles, orders, dealers, vehicle_Items, state_taxes, stocks } = this.entities;



    const task6 = await cds.connect.to('MapAPI');

    // this.on('READ', 'Dealer', async () => {
    //     const result = await task6.get('/odata/v4/processor/Incidents');
    //     return result;
    // });


    this.on('READ', 'cities', async (req) => {
        try {
            const result = await task6.send({
                method: 'GET',
                path: `/odata/v4/api/getDistrict(state='Tamil Nadu')`,
                data: { state: req.data.state }
            });
            console.log('RESULT:', result);

            return result;

        } catch (err) {
            console.log('Error Calling MapDetails:', err.mesaage);
            return [];

        }
    })



    this.on('READ', 'latitude', async (req) => {
        try {
            const result = await task6.send({
                method: 'GET',
                path: `/odata/v4/api/getLatlongitude(state='Tamil Nadu')`,
                data: { state: req.data.state }
            });
            console.log('RESULT:', result);

            return result;

        } catch (err) {
            console.log('Error Calling MapDetails:', err.mesaage);
            return [];

        }
    })



    // !  Dealers Before Hook
    this.before('CREATE', dealers, async (req) => {
        const { State, Dealer_ID } = req.data;

        if (!State) {
            req.error("Please give the State");
        }
        else if (!Dealer_ID) {
            req.error("Please give the id of the dealer");
        }
    })


    // !   Vehicles Before Hook
    this.before('CREATE', vehicles, async (req) => {
        const { Vehicles_ID, New_Price } = req.data;
        if (!Vehicles_ID) {
            req.error('Please give the Vehicle Id ');
        }
        else if (!New_Price || New_Price <= 0) {
            req.error("Please give the proper Price for the vehicle")
        }






        //  let username = req.user?.id;
        //  console.log(username);


        // if (!username) {
        //     username = "anonymous_user"; 
        // }


        // req.data.log = username;
    })

    // !  Stocks Before Hook
    this.before('CREATE', stocks, async (req) => {
        const { Vehicle_id } = req.data;
        console.log(Vehicle_id);

        if (!Vehicle_id) {
            req.error("Please give the vehicle id ")
        }
        const VehicleData = await SELECT.one.from(vehicles).where({ Vehicles_ID: Vehicle_id.Vehicles_ID });
        console.log(VehicleData);
        if (!VehicleData) {
            req.error("Please give the valid Vehicle id")
        }
    })


    // ! Orders Before Hook

    this.before('CREATE', orders, async (req) => {
        const { Quantity, Dealer_ID, Vehicle_id } = req.data;
        // console.log(Dealer_ID);
        //console.log(Dealer_ID.Dealer_ID);
        const VehicleData = await SELECT.one.from(vehicles).where({ Vehicles_ID: Vehicle_id.Vehicles_ID });
        //console.log(VehicleData);

        const stockData = await SELECT.one.from(stocks).where({ Vehicle_id: Vehicle_id.Vehicles_ID })
        console.log(stockData);


        if (Quantity >= stockData.No_Of_Stock) {
            req.error("Please give the proper Quantity because quantity is more than Stock");
        }
        else if (!Dealer_ID) {
            req.error("Please the ID for dealer ")
        }
        else if (!Vehicle_id) {
            req.error("Please the ID for vehicle ")
        }
        const DealerData = await SELECT.one.from(dealers).where({ Dealer_ID: Dealer_ID.Dealer_ID });
        //console.log(DealerData);

        if (!DealerData) {
            req.error("Please give the valid Dealer id")
        }

        if (!VehicleData) {
            req.error("Please give the valid Vehicle id")
        }
    })

    //! Vehicle Items Before Hook

    this.before(['CREATE', 'UPDATE'], vehicle_Items, async (req) => {


        const { Vehicles_brand_id, State_Tax_id, Order_id } = req.data;
        console.log(Vehicles_brand_id, State_Tax_id, Order_id);

        const VehicleData = await SELECT.one.from(vehicles).where({ Vehicles_ID: Vehicles_brand_id.Vehicles_ID });
        //console.log(VehicleData);

        const OrderData = await SELECT.one.from(orders).where({ Order_ID: Order_id.Order_ID });
        console.log(OrderData);

        const DealerData = await SELECT.one.from(dealers).where({ Dealer_ID: OrderData.Dealer_ID_Dealer_ID })
        console.log(DealerData);
        if (!VehicleData) {
            req.error("Please give the valid vehicle id")
        }


        const StateData = await SELECT.one.from(state_taxes).where({ State_ID: State_Tax_id.State_ID });
        console.log(StateData);
        console.log(DealerData.State, StateData.State);

        if (DealerData.State != StateData.State) {
            req.error("Please give the dealer State id")
        }



        if (!OrderData) {
            req.error("Please give the valid Order id")
        }


    })


    //  !   State Before Hook
    this.before('CREATE', state_taxes, async (req) => {
        const { State_Code, Tax_Amount } = req.data;

        if (!State_Code) {
            req.error("Please give state Code")
        }
        else if (!Tax_Amount) {
            req.error("Please give tax amount")
        }
    })


    // !   Vehicles Before Hook for Update
    this.before('UPDATE', vehicles, async (req) => {
        const { Vehicles_ID, New_Price } = req.data;
        if (!Vehicles_ID) {
            req.error('Please give the Vehicle Id ');
        }
        if (New_Price) {
            const vehicle = await SELECT.one.from('Vehicles').where({ Vehicles_ID });

            if (vehicle) {
                const NewPriceData = vehicle.New_Price;
                await UPDATE(vehicles).set({ Old_Price: NewPriceData }).where({ Vehicles_ID })
            }
        }
    })
    //! Read vehicles
    this.on('READ', vehicles, async (req) => {
        const ReadVehicles = SELECT.from(vehicles);
        console.log(ReadVehicles);
        return ReadVehicles
    })

    // ! Read Order
    this.on('READ', orders, async (req) => {
        const ReadOrders = SELECT.from(orders);
        console.log(ReadOrders);
        return ReadOrders
    })

    // ! Read dealer
    this.on('READ', dealers, async (req) => {
        const ReadDealers = SELECT.from(dealers);
        console.log(ReadDealers);
        return ReadDealers
    })

    // ! Read state_taxes
    this.on('READ', state_taxes, async (req) => {
        const ReadState = SELECT.from(state_taxes);
        console.log(ReadState);
        return ReadState
    })

    // ! Read stocks
    this.on('READ', stocks, async (req) => {
        const ReadStocks = SELECT.from(stocks);
        console.log(ReadStocks);
        return ReadStocks
    })

    // ! Read vehicle items
    this.on('READ', vehicle_Items, async (req) => {
        const ReadVehicle_Item = SELECT.from(vehicle_Items);
        console.log(ReadVehicle_Item);
        return ReadVehicle_Item
    })


    // !  Create Vehicle
    this.on('CREATE', vehicles, async (req) => {
        const InsertVehicles = await INSERT.into(vehicles).entries(req.data);
        console.log(InsertVehicles);
        return InsertVehicles
    })

    this.after('CREATE', vehicles, async (req, data) => {
        data.message = "Vehicle created Successfully";
        return "Vehicle Created Successfully"
    })

    // !Create dealer
    this.on('CREATE', dealers, async (req) => {

        const { house_no, street, State, country, pincode, City } = req.data;
        console.log(house_no, street, State, country, pincode, City);

        try {
            const result = await task6.send({
                method: 'GET',
                path: `/odata/v4/api/getLatlongitude(house_no='${house_no}',street='${street}',city='${City}',state='${State}',country='${country}',pincode='${pincode}')`,
                data: { state: req.data.state }
            });
            console.log('RESULT:', result);
            console.log(result.latitude);
            
            req.data.latitude = result.latitude;
            req.data.longitude = result.longitude;


            const InsertDealers = await INSERT.into(dealers).entries(req.data);
            console.log(InsertDealers);
            return InsertDealers

        } catch (err) {
            console.log('Error Calling MapDetails:', err.mesaage);
            return [];

        }

    })

    this.after('CREATE', dealers, async (req, data) => {
        data.message = "Dealer created Successfully";
        return "Dealer Created Successfully"
    })



    // ! Create State
    this.on('CREATE', state_taxes, async (req) => {
        const InsertState = await INSERT.into(state_taxes).entries(req.data);
        console.log(InsertState);
        return InsertState
    })


    this.after('CREATE', state_taxes, async (req, data) => {
        data.message = "State created Successfully";
        return "State Created Successfully"
    })



    // ! Create Stock
    this.on('CREATE', stocks, async (req) => {
        const InsertStock = await INSERT.into(stocks).entries(req.data);
        console.log(InsertStock);
        return InsertStock
    })

    this.after('CREATE', stocks, async (req, data) => {
        data.message = "Stock created Successfully";
        return "Stock Created Successfully"
    })

    // ! Create order


    this.on('CREATE', orders, async (req) => {

        const { Quantity, Dealer_ID, Vehicle_id } = req.data;
        console.log(Vehicle_id);

        // console.log(Dealer_ID);
        //console.log(Dealer_ID.Dealer_ID);
        const VehicleData = await SELECT.one.from(vehicles).where({ Vehicles_ID: Vehicle_id.Vehicles_ID });
        //console.log(VehicleData);

        const stockData = await SELECT.one.from(stocks).where({ Vehicle_id: Vehicle_id.Vehicles_ID })
        console.log(stockData);

        await UPDATE(stocks).set({ No_Of_Stock: stockData.No_Of_Stock - req.data.Quantity }).where({ Stock_ID: stockData.Stock_ID })


        const InsertOrders = await INSERT.into(orders).entries(req.data);
        console.log(InsertOrders);



        return InsertOrders
    })

    this.after('CREATE', orders, async (req, data) => {
        data.message = "Order created Successfully";
        return "Order Created Successfully"
    })

    // ! Create Vehicle_items

    this.on('CREATE', vehicle_Items, async (req) => {
        const { State_Tax_id, Vehicles_brand_id, Order_id } = req.data;
        //console.log(State_Tax_id);

        const StateData = await SELECT.one.from(state_taxes).where({ State_ID: State_Tax_id.State_ID });
        //console.log(StateData);

        const BrandData = await SELECT.one.from(vehicles).where({ Vehicles_ID: Vehicles_brand_id.Vehicles_ID })
        //console.log(BrandData);
        const OrderData = await SELECT.one.from(orders).where({ Order_ID: Order_id.Order_ID });
        console.log(OrderData);

        const quantity = OrderData.Quantity;
        console.log(quantity);

        for (i = 0; i < quantity; i++) {
            req.data.Vehicle_ID = StateData.State_Code + OrderData.Order_ID + (i + 1);
            const Vehi_id = req.data.Vehicle_ID;
            console.log(Vehi_id);

            const select_Vehi_item = await SELECT.one.from(vehicle_Items).where({ Vehicle_ID: Vehi_id });
            console.log(select_Vehi_item);
            if (!select_Vehi_item) {
                req.data.Total_Price = StateData.Tax_Amount + BrandData.New_Price;
                //console.log(req.data.Vehicle_ID);
                const insertVehicle = await INSERT.into(vehicle_Items).entries(req.data);
                const data = await SELECT.from(vehicle_Items).where({ Vehicle_ID: req.data.Vehicle_ID });
                console.log(data);
            }
            else {
                continue;
            }

        }

        this.after('CREATE', vehicle_Items, async (req, data) => {
            data.message = "Vehicle created Successfully";
            return "Vehicle Created Successfully"
        })


    })



    //  ! Delete vehicle

    this.before('DELETE', vehicles, async (req) => {
        const vehicleData = await SELECT.one.from(vehicles).where({ Vehicles_ID: req.data.Vehicles_ID })
        if (!vehicleData) {
            req.error("Please give the valid Vehicles Id")
        }
    })

    this.on('DELETE', vehicles, async (req) => {
        const DeleteVehicles = await DELETE.from(vehicles).where({ Vehicles_ID: req.data.Vehicles_ID })
        console.log("Vehicle deleted successfully");

    })


    // ! Delete Order

    this.before('DELETE', orders, async (req) => {
        const OrderData = await SELECT.one.from(orders).where({ Order_ID: req.data.Order_ID })
        if (!OrderData) {
            req.error("Please give the valid Order Id")
        }
    })

    this.on('DELETE', orders, async (req) => {
        const DeleteOrder = await DELETE.from(orders).where({ Order_ID: req.data.Order_ID })
        return "Deleted Successfully"
    })


    // ! Delete dealer

    this.before('DELETE', dealers, async (req) => {
        const DealerData = await SELECT.one.from(dealers).where({ Dealer_ID: req.data.Dealer_ID })
        if (!DealerData) {
            req.error("Please give the valid Dealer Id")
        }
    })
    this.on('DELETE', dealers, async (req) => {
        const DeleteDealer = await DELETE.from(dealers).where({ Dealer_ID: req.data.Dealer_ID })
        return "Deleted Successfully"
    })


    // ! Delete State


    this.before('DELETE', state_taxes, async (req) => {
        const stateData = await SELECT.one.from(state_taxes).where({ State_ID: req.data.State_ID })
        if (!stateData) {
            req.error("Please give the valid State Id")
        }
    })

    this.on('DELETE', state_taxes, async (req) => {
        const DeleteState = await DELETE.from(state_taxes).where({ State_ID: req.data.State_ID })
        return "Deleted Successfully"
    })


    // ! Delete Stock

    this.before('DELETE', stocks, async (req) => {
        const stockData = await SELECT.one.from(stocks).where({ Stock_ID: req.data.Stock_ID })
        if (!stockData) {
            req.error("Please give the valid Stock Id")
        }
    })


    this.on('DELETE', stocks, async (req) => {
        const DeleteStock = await DELETE.from(stocks).where({ Stock_ID: req.data.Stock_ID })
        return "Deleted Successfully"
    })


    // !  Delete Vehicle item

    this.before('DELETE', vehicle_Items, async (req) => {
        const ItemData = await SELECT.one.from(vehicle_Items).where({ Vehicle_ID: req.data.Vehicle_ID })
        if (!ItemData) {
            req.error("Please give the valid item Id")
        }
    })

    this.on('DELETE', vehicle_Items, async (req) => {
        const DeleteVehicle_item = await DELETE.from(vehicle_Items).where({ Vehicle_ID: req.data.Vehicle_ID })
        return "Deleted Successfully"
    })


    // !  Update Vehicles
    this.on('UPDATE', vehicles, async (req) => {
        await UPDATE(vehicles).set({ New_Price: req.data.New_Price }).where({ Vehicles_ID: req.data.Vehicles_ID });

    })

    // ! Update Stock
    this.on('UPDATE', stocks, async (req) => {
        const { Stock_ID, No_Of_Stock } = req.data;
        console.log(Stock_ID, No_Of_Stock);

        await UPDATE(stocks).set({ No_Of_Stock: req.data.No_Of_Stock }).where({ Stock_ID: req.data.Stock_ID })
    })

    //!  UPDATE ORDER
    this.on("UPDATE", orders, async (req) => {
        await UPDATE(orders).set({ Quantity: req.data.Quantity }).where({ Order_ID: req.data.Order_ID })
    })


    // !  UPDATE State
    this.on('UPDATE', state_taxes, async (req) => {
        await UPDATE(state_taxes).set({ Tax_Amount: req.data.Tax_Amount }).where({ State_ID: req.data.State_ID })
    })

    this.on('getLatLongitude', async (req) => {
        const dealerdata = await SELECT.one.from(dealers).where({ Dealer_ID: req.data.ID });
        console.log(dealerdata);

        const Address = `${dealerdata.house_no},${dealerdata.street},${dealerdata.City}, ${dealerdata.State}, ${dealerdata.country}, ${dealerdata.pincode || ''}`;
        console.log(Address);


        const response = await axios.get('https://nominatim.openstreetmap.org/search',
            {
                params: {
                    q: Address,
                    format: 'json',
                    addressdetails: 1,
                    limit: 1
                },
                headers: {
                    'User-Agent': 'CAP-App'
                }
            }
        )

        if (!response.data || response.data.length === 0) return { latitude: null, longitude: null };

        const loc = response.data[0];
        console.log('Location:', loc);
        console.log(loc);

        return {
            latitude: parseFloat(loc.lat),
            longitude: parseFloat(loc.lon)
        };






    })


    //     const task6 = await cds.connect.to('Task6Service'); // <-- your destination name

    // this.on('READ', 'Task6Data', async (req) => {
    //     // Get data from Task6
    //     const data = await task6.run(SELECT.from('Incidents'));
    //     return data;
    // });




    this.on('calculateOrderTotal', async (req) => {
        const { orderId } = req.data;

        // Fetch all items for the given order
        const items = await SELECT.from(vehicle_Items)
            .where({ Order_id_Order_ID: orderId });

        if (!items.length) return 0;

        // Calculate total price
        const total = items.reduce((sum, item) => {
            return sum + (item.Total_Price || 0);
        }, 0);

        return total;
    });





})













//?    Stocks
// {
//       "Stock_ID": "2",
//       "No_Of_Stock": 50,
//       "Vehicle_id": {"Vehicles_ID":"1"}
//     }


//?   Dealers
//  {
//       "Dealer_ID": "2",
//       "Dealer_Name": "Keeri",
//       "Location": "Chennai",
//       "State": "TamilNadu"
//     }

//? Orders
/* {
     "Order_ID": "3",
     "Quantity": 2,
     "Vehicle_id":{"Vehicles_ID": "3"},
     "Dealer_ID" :{"Dealer_ID": "1"}
   } */

//?    Vehicles

//    {
//   "Vehicles_ID": "2",
//   "ModelName": "Yamaha",
//   "Old_Price": 0,
//   "New_Price":10000
// }


//? Vehicle items 
/*  {
  "Vehicle_ID": "TN04",
  "Total_Price": 500100,
  "Vehicles_brand_id":{"Vehicles_ID": "1"},
  "State_Tax_id":{"State_ID": "1"},
  "Order_id":{"Order_ID": "1"}
} */