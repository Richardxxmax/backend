const db = require('../../Model/dbConfig')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const currentDate = require("../../util/Date/currentDate")
const validator = require('validator');
const moment = require("moment") 
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



//admin data route
const updateAvailableBalance = asyncHandler ( async (req,res)=>{

    const userID = req.body.userID
    const balance = req.body.balance
    const SQL = `UPDATE account SET availableBalance = ${balance}  WHERE userID=\'${userID}\'`
    if (validator.isNumeric(balance)) {

        db.query(SQL,(err,result)=>{
            if(err) {
                console.log(err)
              return res.status(500).json({message: "Error Querying database"});
            }
            return res.status(200).json({message: "Updated Successfully",status:200,balance:balance});
        
            })
        
    } else {
        return res.status(400).json({message: "Failed to update, please enter valid number",status:400,balance:balance});
    }
  
   
            
     }) 


    //admin data route
     const updateCurrentBalance = asyncHandler ( async (req,res)=>{

        const userID = req.body.userID
        const balance = req.body.balance
        const SQL = `UPDATE account SET currentBalance = ${balance}  WHERE userID=\'${userID}\'`
        if (validator.isNumeric(balance)) {
    
            db.query(SQL,(err,result)=>{
                if(err) {
                    console.log(err)
                  return res.status(500).json({message: "Error Querying database"});
                }
                return res.status(200).json({message: "Updated Successfully",status:200,balance:balance});
            
                })
            
        } else {
            return res.status(400).json({message: "Failed to update, please enter valid number",status:400,balance:balance});
        }
      
       
                
         }) 


    //createhistory
     const createHistory = asyncHandler ( async (req,res)=>{
   
        const  userID = req.body.userID
        const purpose = req.body.purpose
        const date = moment(req.body.date).format('MMMM Do YYYY, h:mm:ss a')
        const amount = req.body.amount
        const receiver = req.body.receiver
        const transactionType = "Merchandise"
        const status =  "sent"
        const SQL = `INSERT INTO transactionHistory (userID, amount, transactionType, transactionDate,status, purpose, receiver,updatedAt, createdAt) VALUES (?,?,?,?,?,?,?,?,?)`
       
          
            db.query(SQL,[userID,amount,transactionType,date,status,purpose,receiver,currentDate(),currentDate()],(err,result)=>{
                if(err) {
                    console.log(err)
                  return res.status(500).json({message: "Error Querying database"});
                }
                return res.status(200).json({message: "Created Successfully",status:200});
            
                })
            
           
      
       
                
         }) 
    
    






  module.exports = {AdminData,updateAvailableBalance,updateCurrentBalance,createHistory};


