
const asyncHandler = require("express-async-handler");


//create new user or signup
const CronJobController = asyncHandler ( async (req,res)=>{
        
    res.send({id:1,message:"CronJob Successfully"})
            
     }) 







  module.exports = {CronJobController};


