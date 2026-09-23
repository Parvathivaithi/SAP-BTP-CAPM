namespace practise.db;
using {cuid, managed , temporal } from '@sap/cds/common';


aspect reuse {
    address:String;
    city:String;
    pincode:Integer @assert.format :'^[0-9]{6}$';
    email : String @assert.format :'^[^@]+@[^@]+\.[^@]+$';
}

entity student:managed,reuse {
    key ID :UUID;
    firstname:String;
    secondname:String;
    @Core.Computed:true
    virtual name : String default 'null';
    cal_name:String = firstname ||''|| secondname;
    age:Integer;

    enroll_ref:Association to many courseEnrollment on enroll_ref.Student_ID = $self;
 
}

entity courseEnrollment{
     key ID:UUID;
     course_ID:Association to course;
     Student_ID :Association to student;
}

entity course:temporal {
    Key ID :UUID;
    course_name : String;
    duration : String;
    Books :books;
    enroll_ref: Association to many courseEnrollment on enroll_ref.course_ID = $self;

}

type books{
    bookName:String;
    author:String;
}