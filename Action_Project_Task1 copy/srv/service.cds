namespace call.srv;

using{call.db as db} from'../db/schema';

service CallApi {

    entity Products as projection on db.Product;
    entity Orders as projection on db.Order;
    entity Customers as projection on db.Customer;
    
    action CreateProductsCustomers(product:array of Products,customer:array of Customers);
    action placeOrder(order:Orders);
    action reduceStock(ID:String,quantity:Integer);
}

