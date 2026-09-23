namespace hpappentity.db;

entity hospital {
    key ID              : String;
        hospital_name   : String;
        hospital_loc    : String;
        hospital_type   : String;
        hospital_rating : String;
        hospital_phno   : Integer;
        department      : Composition of many department
                              on department.hospital = $self;
}

entity department {
    key ID              : String;
        department_name : String;
        floor_no        : Integer;
        no_of_doctors   : Integer;
        no_of_nurse     : Integer;
        hospitalNo      : String;
        hospital        : Association to hospital
                              on hospital.ID = hospitalNo;
}
