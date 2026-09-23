namespace sample.srv;

using{sample.db as db} from '../db/schema';

service api {
    entity students as projection on db.student;
}