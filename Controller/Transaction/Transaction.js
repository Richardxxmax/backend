const db = require('../../Model/dbConfig')
const asyncHandler = require("express-async-handler");
const currentDate = require("../../util/Date/currentDate")


//create new transaction or signup
const createTransaction = asyncHandler ( async (req,res)=>{
    
    const userID = req.body.userID
    const amount = req.body.amount
    const transactionType = req.body.transactionType;
    const transactionDate = req.body.transactionDate
    const status = req.body.status
    const purpose = req.body.purpose
    const receiver = req.body.receiver
    

    const SQL = `SELECT * from user where email=\'${email}\'`
  
    db.query(SQL,(err,result)=>{
        if(err) {
          console.log(err)
          return res.status(500).json({message: "Internal Server Error",status:500});
        }else{
        if(result.length!=0){
           return res.status(403).json({message: "An account with this email already existed please login",status:403});
              
         }else if(validator.isEmail(email)===false){
           console.log("invalid email")
          return res.status(404).json({message: "Email address is invalid",status:404});

         }else if(validator.isEmail(email)){
         
            const SQL = `INSERT INTO user(firstName,lastName,email,SSN,phone,password,DOB,createdAt,updatedAt)VALUES(?,?,?,?,?,?,?,?,?)`;
            db.query(SQL,[firstName,lastName,email,SSN,phone,password_hash,DOB,currentDate(),currentDate()],(err,result)=> {
                if(err){
                 console.log("error",err);       
                }else{
                     
                    console.log(result.insertId)
                    const userID =result.insertId
                    const SQL = `INSERT INTO account(userID,createdAt)VALUES(?,?)`;
                    db.query(SQL,[userID,currentDate()],(err,result)=> {
                      if(err){
                       console.log("error",err);       
                      }else{
                        return res.status(200).json({message: "Account created sucessfully",status:200});
                      }
                    
                    })

                }

               
            })
         }
        }})
     }) 







//get transactions
const getTransaction = asyncHandler ( async (req,res)=>{
    const userID = req.body.userID
    const SQL = ` SELECT * from transactionHistory WHERE userID=${userID}`

    db.query(SQL,(error,result)=>{

        if(error){
          console.log(error)
          return res.status(500).json({message:error,status:500})
        }else{
          console.log(result)
          return res.status(200).json({message: "data fetched successfully",status:200,transactions:result});
        }
    })
    
})




  module.exports = {createTransaction,getTransaction};


