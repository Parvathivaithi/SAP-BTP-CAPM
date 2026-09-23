namespace training.db;

using {managed} from '@sap/cds/common';

entity Employees {
    key ID         : UUID;
        EmpNo      : Integer ;
        Name       : String(100) ;
        Email      : String(100);
        JobRole    : String;
        ImageURL   : String;
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
        Category_Category       : String @assert.range enum {
            TECHNICAL;
            SOFTSKILLS;
            COMPLIANCE;
            HR;
            ANALYTICS;
            OTHER;


        };
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
    key ID                           : UUID;
        EnrollmentDate               : Date;
        CompletionDate               : Date;
        Score                        : Integer @assert.range : [
            0,
            100
        ];
        Criticality                  : Integer;
        CertificateCriticality       : Integer;
        Status_status                : String @assert.range enum {
            CERTIFIED;
            ACTIVE;
            COMPLETED;
            EXPIRED;
            REVOKED;
        };
        Reason                       : String;
        CertificateNo                : String  @assert.format: '^CERT-[0-9]{4}-[0-9]{4}$';
        ExpiryDate                   : Date;
        QRCodeURL                    : String;
        CertificateID                : String;
        CertificateURL               : String;
        Employee                     : Association to Employees;
        Course                       : Association to TrainingCourses;
        Feedback                     : Composition of one Feedbacks
                                           on Feedback.Enrollment = $self;

        TraineeAssessment            : Association to many TraineeAssessments
                                           on TraineeAssessment.Enrollment = $self;

        virtual CompletionRate       : Decimal(5, 2);
        virtual TotalEnrollments     : Integer;
        virtual CompletedEnrollments : Integer;

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
    key ID         : UUID;
        TrainerNo  : String;
        Name       : String(100);
        Email      : String;
        Experience : Integer;
        Course     : Association to many TrainingCourses
                         on Course.Trainer = $self;

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

// type category : String enum {
//     TECHNICAL;
//     SOFTSKILLS;
//     COMPLIENCE;
//     HR;
//     ANALYTICS;
//     OTHER;
// }
