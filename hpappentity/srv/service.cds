namespace hpappentity.srv;


using  {hpappentity.db as db} from '../db/schema';
service entityapi{
    entity hospital as projection on db.hospital;
    entity receptionist as projection on db.receptionist;
    entity department as projection on db.department;
    entity doctor as projection on db.doctor;
    entity doctorAppointment as projection on db.doctorAppointment;
    entity patient as projection on db.patient;
    entity appointment as projection on db.appointment;
    entity doctorAdmission as projection on db.doctorAdmission;
    entity admission as projection on db.admission;
    entity prescription as projection on db.prescription;
    entity labtest as projection on db.labtest;
    entity nurse as projection on db.nurse;
    entity nurse_assignment as projection on db.nurse_assignment;
    entity ward as projection on db.ward;
    entity bill as projection on db.bill;
    entity discharge as projection on db.discharge;
}