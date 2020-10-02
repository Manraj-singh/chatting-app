const moment = require('moment');


function formatMessage(username,text){
    return{
        username,
        text,
        //  hour - minute format
        //  a - AM or PM
        time: moment().format('h:mm a')

    }
}

module.exports = formatMessage;
