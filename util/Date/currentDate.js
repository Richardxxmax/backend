const moment = require("moment")
const currentDate = ()=>{
   return moment().format('MMMM Do YYYY, h:mm:ss a');
}

module.exports = currentDate;
