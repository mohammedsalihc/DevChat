const moment = require('moment')
formatMessages = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}


module.exports = formatMessages