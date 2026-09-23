using hpappentity.srv.entityapi as service from '../../srv/service';
annotate service.hospital with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'hospital_name',
                Value : hospital_name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'hospital_loc',
                Value : hospital_loc,
            },
            {
                $Type : 'UI.DataField',
                Label : 'hospital_type',
                Value : hospital_type,
            },
            {
                $Type : 'UI.DataField',
                Label : 'hospital_rating',
                Value : hospital_rating,
            },
            {
                $Type : 'UI.DataField',
                Label : 'hospital_phno',
                Value : hospital_phno,
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
            Label : 'ID',
            Value : ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'hospital_name',
            Value : hospital_name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'hospital_loc',
            Value : hospital_loc,
        },
        {
            $Type : 'UI.DataField',
            Label : 'hospital_type',
            Value : hospital_type,
        },
        {
            $Type : 'UI.DataField',
            Label : 'hospital_rating',
            Value : hospital_rating,
        },
    ],
);

