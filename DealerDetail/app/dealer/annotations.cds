using vehicle.srv.VehicleApi as service from '../../srv/service';
annotate service.vehicles with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Vehicles_No',
                Value : Vehicles_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ModelName',
                Value : ModelName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Old_Price',
                Value : Old_Price,
            },
            {
                $Type : 'UI.DataField',
                Label : 'New_Price',
                Value : New_Price,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Vehicles_No',
            Value : Vehicles_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'ModelName',
            Value : ModelName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Old_Price',
            Value : Old_Price,
        },
        {
            $Type : 'UI.DataField',
            Label : 'New_Price',
            Value : New_Price,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'vehicle.srv.VehicleApi.EntityContainer/calculateOrderTotal',
            Label : 'calculateOrderTotal',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'vehicle.srv.VehicleApi.EntityContainer/getLatLongitude',
            Label : 'getLatLongitude',
        },
    ],
);

