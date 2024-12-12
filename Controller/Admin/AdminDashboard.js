const db = require('../../Model/dbConfig')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { sendEmail } =require("../email/email")
const currentDate = require("../../util/Date/currentDate")
var validator = require('validator');

//create new user or signup
const AdminData = asyncHandler ( async (req,res)=>{
    const userID= req.body.userID
    const SQL = `SELECT * from users where id=\'${userID}\'`
  
    db.query(SQL,(err,result)=>{
        if(err) {
          //return res.status(500).json({message: "Error Querying database"});
        }else if((result!=undefined)&(result.length!=0)){
            const user = result[0]
            const {isAdmin} = user
            if(isAdmin===1){
                const SQL = `SELECT * FROM statistics`
                db.query(SQL,(error,result)=>{
                   if(error){
                       console.error(error)
                    //   return res.status(500).send({message: "Error Querying database"});
                   }else{
                       console.log(result)
                       res.send(result[0])
                   }


                })
            }
        }})
            
     }) 


 const getAllVisitorsAdmin = asyncHandler ( async (req,res)=>{

    
        const SQL = `SELECT * from visitor  ORDER BY id DESC`;
        
    db.query(SQL,(err,result)=>{
       if(err){
           res.status(500).send(err);
       }
         
        res.status(201).json({result:result})
     
    })
    
    })




const deleteVisitor = asyncHandler ( async (req,res)=>{

    const {userID,visitorID} = req.body
    const SQL = `SELECT * from users  WHERE id=${userID}`;//check if its an admin user
    
db.query(SQL,(error,result)=>{
   if(error){
    res.status(401).json({status:0,message:"ERROR IN ACCESSING DATABASE"})
   }else if((result!=undefined)&(result.length!=0)){
      const user = result[0];
      const {isAdmin} = user
      console.log(isAdmin)
      if(isAdmin===1){
        const SQL = "SELECT * from statistics"
        db.query(SQL,(error,result)=>{
            if(error){
                console.log(error)
                return res.status(500).json({status:0,message: "Error Querying database"});
            }else if((result!=undefined)&(result.length!=0)){
                const visitorCounter = Number(result[0].visitorCounter)
                const SQL = `UPDATE statistics SET visitorCounter=\'${(visitorCounter - 1)}\' WHERE id=1`
                db.query(SQL,(error,result)=>{
                if(error){
                    console.log(error)
                   return res.status(500).json({status:0,message: "Error Querying database"});
                }else{
                    
                    const SQL = `DELETE from statistics WHERE id=${visitorID}`;
                    db.query(SQL,(error,result)=>{
                       if(error){
                           res.status(201).json({status:0,message:"Error Querying database"})
                       }else{
                           res.status(201).json({status:1,message:"VISITOR RECORD DELETED SUCCESSFULLY"})
                       }
           
                    })

                  }
             })
         }})











      }else{
        res.status(403).json({status:1,message:"ACCESS DENIED"})
      }

   }else{
    res.status(201).json({status:0,message:"Unauthorized action!!"})
 
   }
})
})
    







  module.exports = {deleteVisitor,getAllVisitorsAdmin,AdminData};


