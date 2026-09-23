namespace training.srv;

using {training.db as db} from '../db/schema';

service TrainingService {
    entity employee   as projection on db.Employees;
    entity department as projection on db.Departments;
    entity course     as projection on db.TrainingCourses;
    entity enrollment as projection on db.Enrollments;
    entity trainers as projection on db.Trainers;
    entity assesment_det as projection on db.AssessmentDetails;
    entity traineeAss  as projection on db.TraineeAssessments;

    action enroll(employeeID:UUID, courseID:UUID) returns String;
    action complete(enrollmentID:UUID,score:Integer) returns String;
    action revoke(enrollmentID:UUID , reason:String) returns String;
    action enrollTest(enrollmentID:UUID) returns String;
    function getExpiringCertificates(daysAhead:Integer) returns array of String;
}

service FeedbackService {
    entity feedback as projection on db.Feedbacks;
    action submitFeedback(enrollmentID:UUID,rating:Integer,comments:String) returns String;
}
