namespace fiori.srv;

using {fiori.db as db} from '../db/schema';

service fiori_api{
   //  entity products  as projection on db.product;
   entity orders    as projection on db.order;

   entity customers as
      projection on db.customer {
         *,
         @Core.Computed
         status
      }
      actions {
         action Delivered();
         action shipping();
      }

   entity Book      as projection on db.Book;

   action   changes(ID: String);

   function bookQuantity(ID: String)       returns String;

   action   Create(ID: String,
                   no_of_quantity: Integer,
                   Date: Date,
                   Book_id_id: String,
                   customer_id_ID: String) returns String;
}
