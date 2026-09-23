namespace stu.srv;
using {stu.db as db } from '../db/schema';
service stuapi{
    entity students as projection on db.student;

    function getDistrict(state:String ) returns Array of String;
}