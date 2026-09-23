using { fiori.srv.fiori_api as service}  from '../../srv/service';

annotate service.customers with{
 
    File
    @Core.ContentDisposition.Filename:fileName;
    
 
      filetype @Core.IsMediaType;
 
} ;
annotate service.customers with @(
    Communication.Contact : {
        fn   : name,
        photo: imageUrl,
        email:[{
            type:#work,
            address:email
        }],
        tel:[{
            type:#work,
            uri:contact
        }]
    },

    Common.IsNaturalPerson: true
);

annotate service.customers with @(

    odata.draft.enabled,
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'ID',
                Value: ID,
            },
            {
                $Type: 'UI.DataField',
                Label: 'name',
                Value: name,
            },
            {
                $Type               : 'UI.DataField',
                Label               : 'address',
                Value               : address,
                ![@UI.PartOfPreview]: false
            },
            {
                $Type               : 'UI.DataField',
                Label               : 'status',
                Value               : status,
                ![@UI.PartOfPreview]: false
            },
            {
                $Type: 'UI.DataField',
                Label: 'Book name',
                Value: BookDetails_id
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Target: '@Communication.Contact',
                Label : 'Customer Details'
            }
        ],
    },
    UI.FieldGroup #Attachment    : {

        $Type: 'UI.FieldGroupType',

        Data : [

            {
                $Type: 'UI.DataField',
                Value: fileName,
                Label: 'File Name'
            },

            {
                $Type: 'UI.DataField',
                Value: File,
                Label: 'Upload File'
            }

        ]
    },
     UI.Facets                    : [
        {
            $Type               : 'UI.ReferenceFacet',
            ID                  : 'GeneratedFacet1',
            Label               : 'Customer Details',
            Target              : '@UI.FieldGroup#GeneratedGroup',
            ![@UI.PartOfPreview]: true
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Attachments',
            Target: '@UI.FieldGroup#Attachment'
        },

        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'BookData',
            Label : 'Book Data',
            Target: 'BookDetails/@UI.Identification'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'OrderDetails',
            Label : 'Order Details',
            Target: 'order_ref/@UI.LineItem#Book'
        }
    ],

    UI.LineItem                  : [
        {
            $Type             : 'UI.DataField',
            Label             : 'ID',
            Value             : ID,

            @HTML5.CssDefaults: {width: '100px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>Profile}',
            Value             : imageUrl,
            @HTML5.CssDefaults: {width: '150px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>name}',
            Value             : name,
            @HTML5.CssDefaults: {width: '150px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>address}',
            Value             : address,
            @HTML5.CssDefaults: {width: '150px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>status}',
            Value             : status,
            Criticality       : criticality,
            @HTML5.CssDefaults: {width: '150px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : '{i18n>book}',
            Value             : BookDetails.B_name,
            Target            : 'Book',
            @HTML5.CssDefaults: {width: '200px'}
        },

        {
            $Type             : 'UI.DataFieldForAction',
            Action            : 'fiori.srv.fiori_api.Delivered',
            Label             : '{i18n>Delivered}',
            Inline            : true,
            @HTML5.CssDefaults: {width: '130px'}
        },
        {
            $Type             : 'UI.DataFieldForAction',

            Action            : 'fiori.srv.fiori_api.shipping',
            Label             : '{i18n>shipping}',
            Inline            : true,
            @HTML5.CssDefaults: {width: '130px'}
        },
        {
            $Type             : 'UI.DataFieldForAction',
            Action            : 'fiori.srv.fiori_api.EntityContainer/bookQuantity',
            Label             : '{i18n>Book Quantity}',
            @HTML5.CssDefaults: {width: '150px'}
        },

    ],


    // UI.createHidden              : true,
    //  Capabilities.InsertRestrictions : {
    //     Insertable: false
    // },

    // UI.LineItem #Book            : [
    //     {
    //         $Type: 'UI.DataField',
    //         Label: 'Book_Id',
    //         Value: BookDetails.id
    //     },
    //     {
    //         $Type: 'UI.DataField',
    //         Label: 'Book_Name',
    //         Value: BookDetails.B_name
    //     },
    //     {
    //         $Type: 'UI.DataField',
    //         Label: 'Price',
    //         Value: BookDetails.price
    //     }
    // ],

    //Common.SideEffects #changeStatus: {TargetProperties: ['status']},


    UI.SelectionFields           : [
        name,
        BookDetails_id,
    ],

    // UI.DataPoint #StatusDP       : {
    //     Value: status,
    //     Title: 'Customer Status'
    // },

    UI.HeaderInfo                : {
        TypeName   : '',
        Title      : '',
        Description: '',
        ImageUrl   : imageUrl
    },

    UI.HeaderFacets              : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Customer',
            ID    : 'Generated1',
            Target: '@UI.FieldGroup#GeneratedGroup'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Customer',
            ID    : 'Generated2',
            Target: '@UI.FieldGroup#GeneratedGroup'
        }
    ],

    UI.PresentationVariant       : {
        MaxItems      : 3,


        Visualizations: ['@UI.LineItem']
    },
);

// annotate service.customers with {
//     name @Common.ValueList: {
//         $Type         : 'Common.ValueListType',
//         CollectionPath: 'customers',
//         Parameters    : [{
//             $Type            : 'Common.ValueListParameterInOut',
//             LocalDataProperty: name,
//             ValueListProperty: 'name',
//         }, ],
//     }

// }


annotate service.customers with {
    imageUrl @UI.IsImageURL;
};


annotate service.customers with {
    name @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'customers',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: name,
                ValueListProperty: 'name',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'ID',
            },
        ],
    }
};

// annotate service.customers with {
//     BookDetails @Common.QuickInfo: {
//         Value: BookDetails.B_name,
//         Description: BookDetails.price
//     };
// };

annotate service.customers with actions {
    Delivered @(
        Common.IsActionCritical: true,
        Common.SideEffects     : {TargetProperties: [
            'criticality',
            'status'
        ]},

    );

    shipping
              @(
        Common.IsActionCritical: true,
        Common.SideEffects     : {TargetProperties: [
            'criticality',
            'status'
        ]},

    );
};

annotate service.customers with {
    BookDetails @(
        Common.Text       : BookDetails.B_name,
        UI.TextArrangement: #TextOnly,
        Common.ValueList  : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Book',
            Parameters    : [

                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: BookDetails_id,
                    ValueListProperty: 'id',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'B_name',
                },
            ],
        }
    );
};

annotate service.Book with @(
    UI.Identification   : [
        {
            $Type: 'UI.DataField',
            Label: 'Book ID',
            Value: id
        },
        {
            $Type: 'UI.DataField',
            Label: 'Book Name',
            Value: B_name
        },
        {
            $Type: 'UI.DataField',
            Label: 'Book  Price',
            Value: price
        },
        {
            $Type             : 'UI.DataFieldForAnnotation',
            Label             : '{i18n>Rating}',
            Target            : '@UI.DataPoint#Rating',
            @HTML5.CssDefaults: {width: '200px'}
        },


    ],
    UI.DataPoint #Rating: {
        Value        : rating,
        Visualization: #Rating
    },
);

annotate service.orders with @(

    UI.LineItem #Book        : [
        {
            $Type : 'UI.DataFieldWithNavigationPath',
            Label : 'ID',
            Value : ID,
            Target: 'Book_id'
        },

        {
            $Type: 'UI.DataField',
            Label: 'No_of_Quantity',
            Value: no_of_quantity
        },

        // {
        //     $Type: 'UI.DataField',
        //     Label: 'Book ID',
        //     Value: Book_id_id
        // },
        {
            $Type: 'UI.DataField',
            Label: 'Book ID',
            Value: Book_id.B_name
        },
        {
            $Type: 'UI.DataField',
            Label: 'DateTime',
            Value: Date
        },
        {
            $Type             : 'UI.DataFieldForAction',
            Action            : 'fiori.srv.fiori_api.EntityContainer/Create',
            Label             : '{i18n>Create}',
            @HTML5.CssDefaults: {width: '150px'}
        }
    ],

    UI.Facets                : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'OrderFacet1',
        Label : 'Order Details',
        Target: '@UI.FieldGroup#orderGroup'
    }

    ],
    UI.FieldGroup #orderGroup: {
        $Type: 'UI.FieldGroupType',


        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Order ID',
                Value: ID
            },
            {
                $Type: 'UI.DataField',
                Label: 'Quantity',
                Value: no_of_quantity
            },
            {
                $Type: 'UI.DataField',
                Label: 'Customer Name',
                Value: customer_id.name
            },
            {
                $Type: 'UI.DataField',
                Label: 'Book Name',
                Value: Book_id.B_name
            }
        ]
    },

    UI.HeaderInfo            : {
        TypeName   : 'Order',
        Title      : {Value: customer_id.name},
        Description: {Value: customer_id.address},
        ImageUrl   : customer_id.imageUrl
    },
    UI.HeaderFacets          : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'Order',
        ID    : 'Generated1',
        Target: '@UI.FieldGroup#orderGroup'
    },

    ],
    UI.SelectionFields       : [
        ID,
        no_of_quantity
    ]

);


// annotate service.Book with @(

//     UI.FieldGroup #orderGroup: {
//         $Type: 'UI.FieldGroupType',


//         Data : [{
//             $Type: 'UI.DataField',
//             Label: 'Order ID',
//             Value: Book_id_id
//         }]
//     }

// );


//annotate service.customers with @(

//     UI.LineItem: [
//     {
//         $Type: 'UI.DataField',
//         Label: 'Book_Id',
//         Value: id
//     },
//     {
//         $Type: 'UI.DataField',
//         Label: 'Book_Name',
//         Value: B_name
//     },
//     {
//         $Type: 'UI.DataField',
//         Label: 'Price',
//         Value: price
//     }
// ])

// annotate service.bookQuantity with @(
//   UI.ParameterDialog: {
//     Fields: [
//       {
//         $Type: 'UI.DataField',
//         Value: quantity,
//         Label: 'Enter Quantity'
//       }
//     ]
//   }
// );
