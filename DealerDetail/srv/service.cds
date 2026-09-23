namespace vehicle.srv;

using {vehicle.db as db} from '../db/schema';

service VehicleApi {
    entity vehicles      as projection on db.Vehicles;
    entity orders        as projection on db.Orders;
    entity dealers       as projection on db.Dealers;
    entity state_taxes   as projection on db.State_Tax;
    entity stocks        as projection on db.Stock;
    entity vehicle_Items as projection on db.Vehicle_Items;

    entity cities {
        key ID :String;
        // latitude:String;
        // longitude:String;
        district : String;
    }

    view VehicleID as
        select from vehicles {
            Vehicles_ID
        };

    // view StateTaxID as
    //     select from state_taxes {
    //         State_ID,
    //         count(Vehicle.Vehicle_ID) as totalvehicle
    //     }
    //     group by
    //         (
    //             Vehicle.Vehicle_ID
    //         )

    // view StateTax as
    //     select from state_taxes {
    //         State_ID,
    //         count(Vehicle.Vehicle_ID) as totalvehicle
    //     }
    //     group by
    //         State_ID;


   function getLatLongitude(ID:String) returns 
   {
    latitude:Decimal(9,6);
    longitude:Decimal(9,6);
   }


    action calculateOrderTotal(orderId: String) returns Integer;
}
