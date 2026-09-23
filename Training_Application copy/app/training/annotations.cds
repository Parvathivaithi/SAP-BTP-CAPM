using training.srv.TrainingService as service from '../../srv/service';
//using training.srv.FeedbackService as Feedback from '../../srv/service';


annotate service.employee with @(
    Communication.Contact : {
        fn   : Name,
        photo: ImageURL,
        email: [{
            type   : #work,
            address: Email
        }],

    },

    Common.IsNaturalPerson: true
);

annotate service.Enrollments with @(

    UI.DataPoint #CompletionRate      : {
        Title        : 'Training Completion Rate',
        Value        : CompletionRate,
        TargetValue  : 100,
        Visualization: #Progress
    },

    UI.DataPoint #CompletedEnrollments: {
        Value: CompletedEnrollments,
        Title: 'Completed Enrollments',
    },
    UI.FieldGroup #GeneratedGroup     : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'EnrollmentDate',
                Value: EnrollmentDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'CompletionDate',
                Value: CompletionDate,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Score',
                Value: Score,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Reason',
                Value: Reason,
            },
            {
                $Type: 'UI.DataField',
                Label: 'CertificateNo',
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
                $Type: 'UI.DataField',
                Label: 'ExpiryDate',
                Value: ExpiryDate,
            },
            {
                $Type      : 'UI.DataField',
                Label      : 'Status',
                Value      : Status_status,
                Criticality: Criticality
            },
            {
                $Type: 'UI.DataField',
                Label: 'Course Title',
                Value: Course_ID
            },
            {
                $Type: 'UI.DataField',
                Label: 'Employee Name',
                Value: Employee_ID
            },


        ],
    },


    UI.SelectionFields                : [
        Employee_ID,
        Course_ID,
        Employee.Department_ID
    ],
    UI.HeaderInfo                     : {
        TypeName: 'Employee',
        Title   : {Value: 'Enrollment Details'},
    },

    UI.HeaderFacets                   : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'TotalFacet',
            Target: '@UI.DataPoint#TotalEnrollments'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'CompletedEnrollmentsFacet',
            Target: '@UI.DataPoint#CompletedEnrollments'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'CompletionRateFacet',
            Target: '@UI.DataPoint#CompletionRate'
        }
    ],

    UI.DataPoint #TotalEnrollments    : {
        Title: 'Total Enrollments',
        Value: TotalEnrollments,
    },
    UI.Facets                         : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : 'Enrollment  Information',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet2',
            Label : 'Feedback Information',
            Target: 'Feedback/@UI.FieldGroup#GeneratedGroup2',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'EmployeeFacet',
            Label : 'Employee Information',
            Target: 'Employee/@UI.FieldGroup#GeneratedGroup3',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'CourseFacet',
            Label : 'Course Information',
            Target: 'Course/@UI.FieldGroup#GeneratedGroup'
        }
    /*  {
         $Type : 'UI.Reference Facet',
         ID    : 'GeneratedFacet2',
         Label : 'General Info',
         Target: 'Feedback/@UI.Identification',
     }, */
    ],
    UI.LineItem                       : [
        {
            $Type             : 'UI.DataField',
            Label             : 'EnrollmentDate',
            Value             : EnrollmentDate,

            @HTML5.CssDefaults: {

            width: '200px'},
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'CompletionDate',
            Value             : CompletionDate,
            @HTML5.CssDefaults: {

            width: '200px'},
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'Status',
            Value             : Status_status,
            Criticality       : Criticality,
            @HTML5.CssDefaults: {

            width: '150px'},
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'Department',
            Value             : Employee.Department.DeptName,
            @HTML5.CssDefaults: {width: '150px'},
        },
        {
            $Type             : 'UI.DataField',
            Label             : 'Department',
            Value             : Employee.Department.DeptName,
            @HTML5.CssDefaults: {width: '150px'},
        },
        {
            $Type             : 'UI.DataFieldForAction',
            Label             : 'Complete',
            Inline            : true,
            Action            : 'training.srv.TrainingService.complete',

            @HTML5.CssDefaults: {

            width: '150px'},

        },
        {
            $Type             : 'UI.DataFieldForAction',
            Label             : 'Apply Test',
            Inline            : true,
            Action            : 'training.srv.TrainingService.enrollTest',

            @HTML5.CssDefaults: {

            width: '150px'},
        },
        {
            $Type             : 'UI.DataFieldForAction',
            Label             : 'Revoke',
            Inline            : true,
            Action            : 'training.srv.TrainingService.revoke',

            @HTML5.CssDefaults: {

            width: '150px'},
        },
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'Get Expiring Certificates',
            Action: 'training.srv.TrainingService.EntityContainer/getExpiringCertificates'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'Create Course',
            Action: 'training.srv.TrainingService.EntityContainer/createCourse'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'Update Course',
            Action: 'training.srv.TrainingService.EntityContainer/updateCourse'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'Delete Course',
            Action: 'training.srv.TrainingService.EntityContainer/deleteCourse'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'GetCourse',
            Action: 'training.srv.TrainingService.EntityContainer/getCourse'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Label : 'expired cert',
            Action: 'training.srv.TrainingService.EntityContainer/getExpiredCertificates'
        }
    ],

);

annotate service.Enrollments with {
    Employee @(
        Common.Text       : Employee.Name,
        UI.TextArrangement: #TextOnly,
        Common.ValueList  : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'employee',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Employee_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'EmpNo',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'JobRole',
                },
            ],
        }
    )
};


annotate service.Enrollments with actions {
    complete   @(
        Common.IsActionCritical: true,
        Common.SideEffects     : {TargetProperties: [
            'Criticality',
            'Status_status'
        ]},

    );

    revoke     @(
        Common.IsActionCritical: true,
        Common.SideEffects     : {TargetProperties: [
            'Criticality',
            'Status_status'
        ]},

    );

    enrollTest @(
        Common.IsActionCritical: true,
        Common.SideEffects     : {TargetProperties: [
            'Criticality',
            'Status_status'
        ]},

    );


};


annotate service.getExpiredCertificates with @(
    Common.IsActionCritical: true,
    Common.SideEffects     : {TargetProperties: [
        'Criticality',
        'Status_status'
    ]},

);


annotate service.Enrollments with {
    Course @(
        Common.Text       : Course.Title,
        UI.TextArrangement: #TextOnly,
        Common.ValueList  : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'course',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Course_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'CourseCode',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Title',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Description',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Category_Category',
                },
            ],
        }
    )
};

annotate service.Feedbacks with @(
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

annotate service.employee with {
    Department @(
        Common.Text       : DeptName,
        UI.TextArrangement: #TextOnly,
        Common.ValueList  : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'department',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : Common.ValueListParameterDisplayOnly,
                    ValueListProperty: 'DeptName'
                }
            ]
        }
    )
};

annotate service.course with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Course Code',
                Value: CourseCode
            },
            {
                $Type: 'UI.DataField',
                Label: 'Title',
                Value: Title
            },
            {
                $Type: 'UI.DataField',
                Label: 'Description',
                Value: Description
            },

        ]
    },
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'Course Code',
            Value: CourseCode
        },
        {
            $Type: 'UI.DataField',
            Label: 'Title',
            Value: Title
        },
        {
            $Type: 'UI.DataField',
            Label: 'Description',
            Value: Description
        }
    ]
);


annotate service.employee with @(UI.FieldGroup #GeneratedGroup3: {
    $Type: 'UI.FieldGroupType',
    Data : [
        {
            $Type: 'UI.DataField',
            Label: 'EMP-ID',
            Value: EmpNo,
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target: '@Communication.Contact',
            Label : 'Employee Details'
        },
        {
            $Type: 'UI.DataField',
            Label: 'Email',
            Value: Email,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Job Role',
            Value: JobRole
        },
        {
            $Type: 'UI.DataField',
            Label: 'Profile',
            Value: ImageURL,

        },


    ],

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

annotate service.employee with {
    ImageURL @UI.IsImageURL;
};

annotate service.Enrollments with {
    QRCodeURL @UI.IsImageURL;
    @UI.Zoomable
    QRCodeURL;
};
