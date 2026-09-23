namespace vehicle.db;

//using { managed } from '@sap/cds/common';

entity Vehicles {

    key Vehicles_ID : String;
    ModelName       : String;
    Old_Price       : Integer;
    New_Price       : Integer;

    Items : Association to many Vehicle_Items on Items.Vehicles_brand_id = $self; 
    Order : Composition of many Orders on Order.Vehicle_id = $self;

}

entity Stock{
    key Stock_ID:String;
    No_Of_Stock:Integer;
    Vehicle_id:Association to Vehicles;
}

entity Dealers{
    key Dealer_ID:String;
    Dealer_Name:String;
    house_no:String;
    street:String;
    City:String;
    State:String;
    country:String;
    pincode:String;
    latitude:String;
    longitude:String;
    Order:Composition of many Orders on Order.Dealer_ID = $self; //Unmanaged 
}

entity Orders{
    key Order_ID:String;
    Quantity:Integer;
    Vehicle_id:Association to Vehicles;
    Dealer_ID:Association to Dealers; //UnManaged
    Items:Association to many Vehicle_Items on Items.Order_id_Order_ID= Order_ID;   //!Without Self
}

entity Vehicle_Items{
    key Vehicle_ID:String;
    Total_Price:Integer;
    Vehicles_brand_id:Association to Vehicles;
    State_Tax_id:Association to State_Tax;
    Order_id_Order_ID:String;
    Order:Association to Orders on Order.Order_ID =Order_id_Order_ID; //!
   
}
entity State_Tax{
    key State_ID:String;
    State:String;
    Tax_Amount:Integer;
    State_Code:String;
    Vehicle:Association to many Vehicle_Items on Vehicle.State_Tax_id =$self;//With Self
}





