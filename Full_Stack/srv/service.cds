namespace hpappentity.srv;


using {hpappentity.db as db} from '../db/schema';

service entityapi {
    entity hospital   as projection on db.hospital;
    entity department as projection on db.department;
}
