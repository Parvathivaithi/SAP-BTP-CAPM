namespace call.db;


entity Product{
    key ID :String;
    Pro_Name:String;
    Price:Integer;
    No_Of_Stock:Integer;
    Order:Association to many Order on  Order.Product_id = $self;

}
entity Customer{
   key ID:String;
   Name:String;
   Address:String;
   Contact_No:Integer;
   Alternative_Contact_No:Integer;
   Order:Association to many Order on Order.Customer_Id = $self;
}

entity Order{
    key ID:String;
    quantity:Integer;
    Total_Price:Integer;
    Product_id:Association to Product;
    Customer_Id:Association to Customer;

}