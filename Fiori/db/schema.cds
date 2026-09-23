namespace fiori.db;

// entity product{
//     key ID:String;
//     name:String;
//     price:Integer;
//     available_quantity:Integer;
//     order_ref:Association to many order on order_ref.product_id= $self;
// }
// @title         : 'Stream Content'
// @Core.MediaType: 'application/octet-stream'
// type Stream : LargeBinary;


entity customer {
    key ID          : String;
        name        : localized String;
        status      : localized String;
        address     : localized String;
        email :String;
        contact:Integer;
        criticality : Integer;

        File:LargeBinary
        @Core.MediaType:filetype;
        filetype:String(255);
        fileName:String(255);
        imageUrl    : String;
        order_ref   : Association to many order
                          on order_ref.customer_id = $self;
        BookDetails : Association to Book;

}

entity Book {
    key id              : String;
        B_name          : localized String;
        price           : localized Integer;
        rating          : Decimal;
        Total_Quantity  : Integer;
        customerDetails : Association to many customer
                              on customerDetails.BookDetails = $self;
        order_ref       : Association to order
                              on order_ref.Book_id = $self;

}

entity order {
    key ID             : String;
        no_of_quantity : Integer;
        Date           : Date @UI.DateTimeStyle: 'long';
        Book_id        : Association to Book;
        customer_id    : Association to customer;
}
