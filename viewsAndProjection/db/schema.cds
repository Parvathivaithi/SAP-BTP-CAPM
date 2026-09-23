
namespace sampleviews;
 
entity Customers {
    key ID : String;
    name : String;
    city : String;
 
    orders : Association to many Orders on orders.customer = $self;
}
 
entity Orders {
    key ID : String;
    product : String;
    amount : Integer;
    customer_ID : String;
    customer : Association to Customers on customer.ID = customer_ID;
 
}
 