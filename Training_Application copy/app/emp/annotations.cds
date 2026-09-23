using training.srv.FeedbackService as service from '../../srv/service';

annotate service.employee with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'EmpNo',
                Value: EmpNo,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Name',
                Value: Name,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Email',
                Value: Email,
            },
            {
                $Type: 'UI.DataField',
                Label: 'JobRole',
                Value: JobRole,
            },
            {
                $Type: 'UI.DataField',
                Label: 'ImageURL',
                Value: ImageURL,
            },
        ],
    },
    UI.Facets                    : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : 'General Information',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'EnrollmentFacet',
            Label : 'Enrollment Information',
            Target: 'Enrollment/@UI.LineItem',
        }
    ],

    UI.HeaderInfo                : {
        TypeName   : 'Employee',
        Title      : {Value: Name},
        Description: {Value: Email},
        ImageUrl   : ImageURL
    },
    UI.LineItem                  : [
        {
            $Type             : 'UI.DataField',
            Label             : 'EmpNo',
            Value             : EmpNo,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'Profile',
            Value             : ImageURL,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'Name',
            Value             : Name,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'Email',
            Value             : Email,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'JobRole',
            Value             : JobRole,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataFieldForAction',
            Label             : 'Enroll',
            Action            : 'training.srv.FeedbackService.EntityContainer/enroll',
            @HTML5.CssDefaults: {width: '200px'}
        },

    ],
);

annotate service.employee with {
    ImageURL @UI.IsImageURL;
};


annotate service.Enrollments with @(
    UI.LineItem                   : [
         {
            $Type             : 'UI.DataField',
            Label             : 'ID',
            Value             : ID,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'Course',
            Value             : Course.Title,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'EnrollmentDate',
            Value             : EnrollmentDate,
            @HTML5.CssDefaults: {width: '200px'}
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'CompletionDate',
            Value             : CompletionDate,
            @HTML5.CssDefaults: {width: '200px'}
        },

        {
            $Type             : 'UI.DataField',
            Label             : 'Status',
            Value             : Status_status,
            @HTML5.CssDefaults: {width: '200px'}
        },
    ],


    UI.HeaderInfo                 : {
        TypeName   : 'Enrollment',
        Title      : {Value: Course.Title},
        Description: {Value: Status_status},
    },

    UI.FieldGroup #GeneratedGroup5: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Certificate No',
                Value: CertificateNo,
            },
            {
                $Type: 'UI.DataFieldWithUrl',
                Label: 'Certificate URL',
                Value: CertificateURL,
                Url  : CertificateURL
            },
            {
                $Type: 'UI.DataFieldWithUrl',
                Label: 'View QR',
                Value: 'Open QR Image',
                Url  : QRCodeURL
            },
            {
                $Type      : 'UI.DataField',
                Label      : 'Expiry Date',
                Value      : ExpiryDate,
                Criticality: CertificateCriticality
            },
            {
                $Type: 'UI.DataField',
                Label: 'Score',
                Value: Score,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Result',
                Value: TraineeAssessment.Result,
            },
            {
                $Type      : 'UI.DataField',
                Label      : 'Status',
                Value      : Status_status,
                Criticality: Criticality
            },

        ],
    },

    UI.Facets                     : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet3',
            Label : 'Course Information',
            Target: 'Course/@UI.FieldGroup#GeneratedGroup3',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'FeedbackFacet',
            Label : 'Course Feedback',
            Target: 'Feedback/@UI.FieldGroup#GeneratedGroup2',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'CertificateFacet',
            Label : 'Certificate Information',
            Target: '@UI.FieldGroup#GeneratedGroup5',
        }
    ],
);


annotate service.course with @(UI.FieldGroup #GeneratedGroup3: {
    $Type: 'UI.FieldGroupType',
    Data : [
        {
            $Type: 'UI.DataField',
            Label: 'CourseCode',
            Value: CourseCode,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Title',
            Value: Title,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Training Manager',
            Value: Trainer.Name,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Category',
            Value: Category_Category,
        },

    ],
},


);


annotate service.feedback with @(
    UI.FieldGroup #GeneratedGroup2: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataFieldForAnnotation',
                Label : 'Ratings',
                Value : Rating,
                Target: '@UI.DataPoint#Rating'
            },
            {
                $Type: 'UI.DataField',
                Label: 'Comment',
                Value: Comments,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Submitted At',
                Value: SubmittedAt,
            },
            {
                $Type : 'UI.DataFieldForAction',
                Label : 'Submit Feedback',
                Action: 'training.srv.FeedbackService.EntityContainer/submitFeedback'
            },

        ],

    },


    UI.DataPoint #Rating          : {
        Value        : Rating,
        Visualization: #Rating
    },


   
/*  UI.Identification             : [
     {
         $Type: 'UI.DataField',
         Label: 'Ratings',
         Value: Rating,
     },
     {
         $Type: 'UI.DataField',
         Label: 'Comment',
         Value: Comments,
     },
     {
         $Type: 'UI.DataField',
         Label: 'Submitted At',
         Value: SubmittedAt,
     },
     {
         $Type : 'UI.DataFieldForAction',
         Label : 'Submit Feedback',
         Action: 'training.srv.FeedbackService.EntityContainer/submitFeedback'
     },

 ] */


);




