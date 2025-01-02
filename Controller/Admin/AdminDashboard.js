const db = require('../../Model/dbConfig')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const currentDate = require("../../util/Date/currentDate")


//admin data route
const AdminData = asyncHandler ( async (req,res)=>{

    const userID= req.body.userID
    const SQL = `SELECT * from account where userID=\'${userID}\'`
    let currentBalance = 0;
    let availableBalance = 0;
    let transactionHistory = 0;
  
    db.query(SQL,(err,result)=>{
        if(err) {
            console.log(err)
          return res.status(500).json({message: "Error Querying database"});
        }

          availableBalance = result[0].availableBalance
          currentBalance = result[0].currentBalance
          const SQL = `SELECT * from transactionHistory where userID=\'${userID}\'`
          db.query(SQL,(err,result)=>{
            if(err) {
                console.log(err)
              return res.status(500).json({message: "Error Querying database"});
            }
                transactionHistory = result.length
                 console.log(transactionHistory)
                  res.status(201).json({currentBalance:currentBalance,availableBalance:availableBalance,transactionHistory:transactionHistory})
            })
                
      
        })
            
     }) 









  module.exports = {AdminData};


