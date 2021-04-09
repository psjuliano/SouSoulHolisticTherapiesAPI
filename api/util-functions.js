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


module.exports.getDateTime = getDateTime;