namespace practise.srv;


using {practise.db as db} from '../db/schema';


service api {
    entity student as projection on db.student;
    action createService() returns String;


}


service secondAPI {
    @odata.draft.enabled
    entity course as projection on db.course;
    
}

// service secondAPI3 {
//      entity course as projection on db.course;
// }

// service practiseapi {
//     @cds.redirection.target
//     entity product  as projection on db.product;

//     @cds.redirection.target
//     entity customer as projection on db.customer;


//     view productCustomer as
//         select from db.product {
//             ID,
//             name,
//             customer.name as customerName
//         }
//         where
//             customer.name like 'K%';


//     view price as
//         select from db.product {
//             ID,
//             name,
//             price
//         }
//         where
//             price > 1000;


//     view sum as
//         select from db.product {
//             sum(price)    as totalPrice,
//             customer.name as customerName
//         }
//         group by
//             (
//                 customer.ID
//             )

//     view count as
//         select from db.product {
//             count( * )    as productCount,
//             customer.name as customerName
//         }
//         group by
//             (
//                 customer.ID
//             );


//     view statusProduct as
//         select from db.product {
//             name
//         }
//         where
//                 price  >= 2000
//             and price  <= 4000
//             and status =  'Out of Stock';


//     view nullStatus as
//         select from db.product {
//             name
//         }
//         where
//             status not like 'Available';

//     view countOfCustomer as
//         select from db.customer {
//             count(ID) as total_customer
//         }


//     view countOfStatus as
//         select from db.product {

//             count(ID) as total_status,
//             status
//         }
//         group by
//             (status);

//     view countLimit as
//         select from db.product {
//             *
//         }
//         limit 2
//         offset 1;


//     view orderByPrice as select from db.product {
//         name,
//         price
//     }
//     order by name desc limit 2 offset 1;


// }
