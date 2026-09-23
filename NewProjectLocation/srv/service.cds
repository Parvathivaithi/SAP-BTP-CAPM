namespace loacation.srv;

service API {
    function getDistrict(state: String)         returns array of String;

    function getPincodeDetails(pincode: String) returns {
        latitude  : Decimal(10, 7);
        longitude : Decimal(10, 7);
        // state     : String;
        // district  : String;
        // city      : String;
        // town      : String;
    }

    function getState(country: String)          returns array of String;

    function getLatlongitude(house_no: String,
                       street: String,
                       city:String,
                       state: String,
                       country: String,
                       pincode: String)         returns {
        latitude  : Decimal(9, 6);
        longitude : Decimal(9, 6);
    }
}
