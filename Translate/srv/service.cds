namespace translate.srv;

service translateAPI{
    function translate(data:String,res:String) returns String;
}