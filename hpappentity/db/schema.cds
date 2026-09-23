namespace hpappentity.db;

entity hospital{
    key ID:String;
    hospital_name:String;
    hospital_loc:String;
    hospital_type:String;
    hospital_rating:String;
    hospital_phno:Integer;
    department:composition of many department on  department.hospital = $self ;
}
entity department{
    key ID :String;
    department_name:String;
    floor_no:Integer;
    no_of_doctors:Integer;
    no_of_nurse:Integer;
    hospitalNo:String;
    hospital : Association to hospital on hospital.ID=hospitalNo;
    doctor :Association to many doctor on doctor.department = $self;
    nurse:Association to many nurse on nurse.department_id = $self;
    ward_id:Association to many ward on ward_id.department_id=$self;
   // admission_id:Association to many admission on admission_id.department_id = $self;
}


entity receptionist{
    key ID :String;
    name:String;
    contact_no:String;
    shift_time:String;
    status:String;
    regapp:Association to many appointment on regapp.receptionist_id = $self;
    regadmit:Association to many admission on regadmit.receptionist_id = $self;
}

entity patient{
    key ID:String;
    patient_name:String;
    gender:String;
    age:Integer;
    blood_group:String;
    reason:String;
   
    appointment:Composition of one appointment on appointment.patient=$self;
   // prescription :Composition of one prescription on prescription.patient = $self;
    nurse_assignment :Composition of many nurse_assignment on nurse_assignment.patient_id=$self;
    admission_id : Composition of many admission on admission_id.pat_id = $self; 
}


entity doctor{
    key ID:String;
    doctor_name:String;
    address:String;
    specialisation : String;
    experience:String;
    contact_no:String;
    department: Association to department;
    doctorAppointment:Association to many doctorAppointment on doctorAppointment.doctor_id = $self;
    doctorAdmit:Association to many doctorAdmission on doctorAdmit.doctor_id =$self;

    //admission_id:Association to many admission 
}


entity doctorAppointment{
    key ID:String;
    appointment_id : Association to appointment;
    doctor_id:Association to doctor;
}



entity appointment{
    key ID:String;
    date:String;
    time:String;
    status:String;
    patient:Association to  patient;
    bill:Association to bill;
    prescription :Association to many prescription on prescription.appointment_id=$self;
    doctorAppmt:Association to many doctorAppointment on doctorAppmt.appointment_id = $self;
    receptionist_id : Association to receptionist;


}

entity admission {
    key ID :String;
    admission_date:Date;
    admission_time:Time;
    admission_type:String;
    reason:String;
    bed_number:Integer;
    pat_id:Association to patient;
    ward_id:Association to ward;
    discharge_id:Composition of many discharge on discharge_id.admission_id =$self;
    receptionist_id:Association to receptionist;
    doctorAdmit:Association to many doctorAdmission on doctorAdmit.admission_id =$self;
    

}

entity doctorAdmission{
    key ID:String;
    doctor_id:Association to doctor;
    admission_id:Association to admission;
}



entity prescription {
    key ID:String;
    date:String;
    diagnosis:String;
    medicine_name:String;
    patient_id:String;
    patient:Association to  patient on patient.ID = patient_id;
    labtest:composition of many labtest on labtest.prescription=$self;
    appointment_id:Association to appointment;
}


entity labtest{
    key ID:String;
    test_name:String;
    price:Integer;
    result:String;
    prescription_id:String;
    prescription: Association to prescription on prescription.ID=prescription_id;
    bill:Association to bill;

}


entity bill{
    key ID:String;
    date:String;
    amount:String;
    appointment_id:String;
    appointment:Association to appointment on appointment.ID=appointment_id;
    labtest_id:String;
    labtest:Association to labtest on labtest.ID=labtest_id;
}

entity nurse{
    key ID :String;
    name:String;
    contact_No:String;
    location:String;
    shift_time:String;
    Experience:Integer;
    department_id:Association to department;
    nurse_assignment:Composition of many nurse_assignment on nurse_assignment.nurse_id=$self;
}

entity nurse_assignment{
    key ID :String;
    nurse_id:Association to nurse;
    patient_id:Association to patient;
}


entity ward{
    key ID : String;
    ward_type:String;
    availability_of_bed:Integer;
    Total_no_of_bed:Integer;
    Floor_no:Integer;
    department_id:Association to department;
    admission:Association to many admission on admission.ward_id=$self;

}

entity discharge{
    key ID :String;
    discharge_date:Date;
    discharge_status:String;
    follow_up_date:Date;
    admission_id:Association to admission;
}



// entity car{
//     key id :String;
//     car_name:String;
//     engine:Composition of many engine on engine.car =$self;

// }
// entity engine{
//     key id:String;
//     engine_name:String;
//     car: Association to car;
// }


