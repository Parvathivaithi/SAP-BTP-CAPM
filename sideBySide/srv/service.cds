namespace side.srv;

using {API_BUSINESS_SITUATION_SRV as s4} from './external/API_BUSINESS_SITUATION_SRV.csn';

service consumeapi{
     entity datacontext as projection on s4.A_SitnDataContext
     {
        SitnDataContextID,
        SitnInstceActivityID,
        SitnInstanceID,
        CreationDateTime
     };
     function getlocation(pincode:String) returns  {
        latitude  : Decimal(10,7);
        longitude : Decimal(10,7);
        state     : String;
        district  : String;
        city      : String;
        town      : String;
    };
}