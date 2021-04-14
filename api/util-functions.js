//get current date in usual format
const getDateTime = function() {

    let dt = new Date();

    year  = dt.getFullYear();
    month = (dt.getMonth() + 1).toString().padStart(2, "0");
    day   = dt.getDate().toString().padStart(2, "0");
    hour   = dt.getHours().toString().padStart(2, "0");
    minute   = dt.getMinutes().toString().padStart(2, "0");
    second   = dt.getSeconds().toString().padStart(2, "0");

    //Formated date
    return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
}



const getTimestamp = () => {
    let dt = new Date();
    return dt.getTime();
}




//verify if value (string) is empty
const empty = function(string) {
    //Force convert to string
    string = String(string);
    //Remove extra white spaces
    string = string.replace(/\s{2,}/g, '');

    if(string == null || string == ''){
        return true
    }
    else{
        return false
    }
}


module.exports.empty = empty;
module.exports.getTimestamp = getTimestamp;
module.exports.getDateTime = getDateTime;
