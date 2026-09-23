namespace training.srv;

using {training.db as db} from '../db/schema';

service TrainingService @(restrict: [
    {
        grant: [
            'READ',
            'CREATE'
        ],
        to   : 'Employee'
    },
    {
        grant: [
            'CREATE',
            'READ',
            'UPDATE'
        ],
        to   : 'Manager'
    },
    {
        grant: ['*'],
        to   : 'Administrator'
    }
]) {
    entity employee      as projection on db.Employees;
    entity department    as projection on db.Departments;
    entity course        as projection on db.TrainingCourses;

    @cds.redirection.target
    @odata.draft.enabled
    entity Enrollments @(restrict: [
        {
            grant: [
                'READ',
                'CREATE'
            ],
            to   : 'Employee'
        },
        {
            grant: [
                'CREATE',
                'READ',
                'UPDATE'
            ],
            to   : 'Manager'
        },
        {
            grant: ['*'],
            to   : 'Administrator'
        }
    ])                   as
        projection on db.Enrollments {
            *,
            @Core.Computed
            EnrollmentDate,
            @Core.Computed
            CompletionDate,
            @Core.Computed
            Score,
            @Core.Computed
            Reason,
            @Core.Computed
            CertificateNo,
            @Core.Computed
            ExpiryDate
        }
        actions {
            action complete(score: Integer) returns String;
            action revoke(reason: String)   returns String;
            action enrollTest()             returns String;

        };

    function QrCode(enrollmentID: UUID)                  returns String;

    entity trainers      as projection on db.Trainers;
    entity assesment_det as projection on db.AssessmentDetails;
    entity traineeAss    as projection on db.TraineeAssessments;

    /* view CompletionRate as
        select from Enrollments {
            count( * ) as totalCount,
            sum(case
                    when ExpiryDate is not null
                         then 1
                    else 0
                end)   as completedCount,
            (
                sum(case
                        when ExpiryDate is not null
                             then 1
                        else 0
                    end)                *      100.0 / count( * )
            )          as rate
        };
 */

    /*   entity CompletionKPI as select from TrainingService.Enrollments {
       cast(count(*) as Integer) as TotalEnrollments
   }; */
    // view EnrollmentCounts as
    //     select from db.Enrollments {
    //         key ID,
    //             // Essential for grouping

    //             count( * ) as totalEnrollments,

    //             sum(case
    //                     when ExpiryDate is not null
    //                          then 1
    //                     else 0
    //                 end)   as completedEnrollments,

    //             // Completion Rate Calculation
    //             case
    //                 when count( * ) > 0
    //                      then(
    //                              cast ( sum(case
    //                                             when ExpiryDate is not null
    //                                                  then 1
    //                                             else 0
    //                                         end) as Decimal(5, 2)) / cast(
    //                                  count( * ) as Decimal(5, 2)
    //                              )
    //                          ) * 100.0
    //                 else 0.0
    //             end        as CompletionRate : Decimal(5, 2)

    //     }
    //     group by
    //         ID;

    function getCompletionRate()                         returns {
        totalEnrollments     : Integer;
        completedEnrollments : Integer;
        completionRate       : Decimal(5, 2)
    }

    action   createCourse(CourseCode: String,
                          Title: String,
                          Description: String,
                          Category: String,
                          Duration_Hours: Integer,
                          Duration_Days: Integer,
                          IsMandatory: Boolean,
                          ValidityMonths: Integer,
                          MaxEnrollments: Integer,
                          TrainerID: UUID)               returns String;

    action   updateCourse(ID: UUID,
                          CourseCode: String,
                          Title: String,
                          Description: String,
                          Category: String,
                          Duration_Hours: Integer,
                          Duration_Days: Integer,
                          IsMandatory: Boolean,
                          ValidityMonths: Integer,
                          MaxEnrollments: Integer,
                          Trainer_ID: UUID)              returns String;

    action   deleteCourse(CourseID: UUID)                returns String;
    action getExpiredCertificates() returns array of Enrollments;
    function getCourse()                                 returns array of String;

    function getExpiringCertificates(daysAhead: Integer) returns array of Enrollments;
}

service FeedbackService @(impl: './feedback.js') {
    @cds.redirection.target: 'TrainingService/employee'
    entity employee    as projection on db.Employees;

    @cds.redirection.target: 'TrainingService/Enrollments'
    entity Enrollments as projection on db.Enrollments;


    @cds.redirection.target: 'TrainingService/course'
    entity course      as projection on db.TrainingCourses;


    @cds.redirection.target: 'TrainingService/trainers'
    entity trainers    as projection on db.Trainers;

    @cds.redirection.target: 'TrainingService/traineeAss'
    entity traineeAss  as projection on db.TraineeAssessments;

    action enroll(

                  @(
                      Common.ValueListWithFixedValues: true,
                      Common.ValueList: {
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
                                  ValueListProperty: 'Name',
                              },

                          ],
                      }
                  )
                  employeeID: UUID,

                  @(
                      Common.ValueListWithFixedValues: true,
                      Common.ValueList: {
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
                                  ValueListProperty: 'Title',
                              },

                          ],
                      }
                  )
                  courseID: UUID)                        returns String;

    entity feedback    as projection on db.Feedbacks;

    action submitFeedback(
                           @(
                               Common.ValueListWithFixedValues: true,
                               Common.ValueList: {
                                   $Type         : 'Common.ValueListType',
                                   CollectionPath: 'Enrollments',
                                   Parameters    : [
                                       {
                                           $Type            : 'Common.ValueListParameterInOut',
                                           LocalDataProperty: ID,
                                           ValueListProperty: 'ID',
                                       },

                                       {
                                           $Type            : 'Common.ValueListParameterDisplayOnly',
                                           ValueListProperty: 'Employee.Name',
                                       },

                                   ],
                               }
                           )
                        enrollmentID:UUID,
                          rating: Integer,
                          comments: String)              returns String;

}

// SECURE_SESSION_COOKIE=false cds bind --exec -- npm start --prefix app/router
