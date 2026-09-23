namespace training.db;

using {managed} from '@sap/cds/common';

entity Employees {
    key ID         : UUID;
        EmpNo      : Integer;
        Name       : String(100);
        JobRole    : String;
        Department : Association to Departments;
        Enrollment : Association to many Enrollments
                         on Enrollment.Employee = $self;
}

entity Departments {
    key ID       : UUID;
        DeptCode : String;
        DeptName : String;
        Employee : Association to many Employees
                       on Employee.Department = $self;
}

entity TrainingCourses {
    key ID             : UUID;
        CourseCode     : String;
        Title          : String;
        Description    : String;
        Category       : Association to category;
        Duration_Hours : Integer;
        Duration_Days  : Integer;
        IsMandatory    : Boolean;
        ValidityMonths : Integer;
        MaxEnrollments : Integer;
        Trainer        : Association to Trainers;
        Enrollment     : Association to many Enrollments
                             on Enrollment.Course = $self;
}


entity Enrollments : managed {
    key ID                : UUID;
        EnrollmentDate    : Date;
        CompletionDate    : Date;
        Score             : Integer @assert.range : [
            0,
            100
        ];
        Status            : Association to status;
        Reason            : String;
        CertificateNo     : String  @assert.format: '^CERT-[0-9]{4}-[0-9]{4}$';
        ExpiryDate        : Date;
        Employee          : Association to Employees;
        Course            : Association to TrainingCourses;
        Feedback          : Composition of one Feedbacks
                                on Feedback.Enrollment = $self;

        TraineeAssessment : Association to many TraineeAssessments
                                on TraineeAssessment.Enrollment = $self;

}

entity Feedbacks {
    key ID          : UUID;
        Rating      : Integer @assert.range: [
            1,
            5
        ];
        Comments    : String;
        SubmittedAt : Timestamp;
        Enrollment  : Association to Enrollments;
}

entity Trainers {
    key ID        : UUID;
        TrainerNo : String;
        Name      : String(100);
        Email     : String;
        Experience : Integer;
        Course    : Association to many TrainingCourses on Course.Trainer = $self;

}

entity AssessmentDetails {
    key ID             : UUID;
        AssessmentName : String;
        TotalMarks     : Integer;
        PassMarks      : Integer;
        Course         : Association to TrainingCourses;
}

entity TraineeAssessments : managed {
    key ID            : UUID;
        ObtainedMarks : Integer;
        Result        : String enum {
            PASS;
            FAIL;
        };

        Enrollment    : Association to Enrollments;
}

entity status {
        @assert.range: [
            'CERTIFIED',
            'COMPLETED',
            'ACTIVE',
            'EXPIRED',
            'REVOKED'
        ]
    key status : String enum {
            CERTIFIED;
            ACTIVE;
            COMPLETED;
            EXPIRED;
            REVOKED;
        }
}


entity category {
        @assert.range: [
            'TECHNICAL',
            'SOFTSKILLS',
            'COMPLIANCE',
            'HR',
            'ANALYTICS',
            'OTHER'
        ]

    key Category : String enum {
            TECHNICAL;
            SOFTSKILLS;
            COMPLIANCE;
            HR;
            ANALYTICS;
            OTHER;


        }
}

// type category : String enum {
//     TECHNICAL;
//     SOFTSKILLS;
//     COMPLIENCE;
//     HR;
//     ANALYTICS;
//     OTHER;
// }
