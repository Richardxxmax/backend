const db = require('../../Model/dbConfig')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { sendEmail } =require("../email/email")
const currentDate = require("../../util/Date/currentDate")
var validator = require('validator');
const jwt  = require("jsonwebtoken")
const {JWT_SECRET_KEY} = require("../../Middleware/auth")

//create new user or signup
const register = asyncHandler ( async (req,res)=>{
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = ((req.body.email).toString()).toLowerCase();
    const password = (req.body.password).toString()
    const SSN = req.body.SSN
    const phone= req.body.phone
    const DOB = req.body.DOB
    const password_hash=bcrypt.hashSync(`${password}`, 10);

    console.log(firstName)

    const SQL = `SELECT * from user where email=\'${email}\'`
  
    db.query(SQL,(err,result)=>{
        if(err) {
          console.log(err)
          return res.status(500).json({message: "Error Querying database"});
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
                        return res.status(201).json({message: "Account created sucessfully",status:201});
                      }
                    
                    })

                }

               
            })
         }
        }})
     }) 







//Login user 
const login = asyncHandler ( async (req,res)=>{
    const email = (req.body.email)
    const Password = req.body.password
    const SQL = `SELECT * FROM users WHERE email=\'${email}\'`;
    db.query(SQL, (error,data)=>
    {
      if(error){
        console.log(error)
       return res.status(404).json({message: "Error Querying database",status:404});
      }else if((data!=undefined)&(data.length!=0))
     {
      const user = data[0]
      const {id,password,email} = user
      const passwordCheck = bcrypt.compareSync(Password,password);
      if(passwordCheck){
        let token = jwt.sign({userId:id,username:email},JWT_SECRET_KEY)
        return res.status(202).json({message: "Accepted",user:user,token:token,status:202});
      }else if(passwordCheck===false){
        return res.status(401).json({message: "Incorrect password",status:401});
      }
        return res.status(404).json({message: "No account found with this email,please signup",status:404});
     }
    })
   })





   const forgetPassword = asyncHandler ( async (req,res)=>{

    const email = ((req.body.email).toString()).toLowerCase();
    const SQL = `SELECT * from users`;      
    db.query(SQL,(err,data)=>{
        if(err)
        {
          return res.status(500).json({message: "Error Querying database"});
        }else if(validator.isEmail(email)){
         const isExisted = data.filter((data)=>data.email===email)
         if(isExisted[0])
         {
          const otp = (Math.random() * 10000).toFixed()
          const otp_hash=bcrypt.hashSync(`${otp}`, 10);
          const SQL= `UPDATE users SET verification_code=\'${otp_hash}\' WHERE id=${isExisted[0].id}`
          db.query(SQL,(error , result)=>{ 
                  if(error)
                  console.log(error)
               console.info(result)
          }) 
           const data = { 
            email:`${email}`,
            subject:"PremiumBlog Account OTP",
            text:`Your OTP is ${otp}, please don't share with anyone `
        } 
      
        sendEmail(data)
           return res.status(201).json({message: "Otp Sent to email",status:201,email:email});
              
         }else{
           
            return res.status(401).json({message: "No accound found with this email, please signup a new account",status:401});
       
         }}else{
           return res.status(401).json({message: "invalid email address , Please enter a valid email",status:401});
         }
       })
   
    })
  
  //confirm user OTP
  const confirmOTP = asyncHandler ( async (req,res)=>{
      const email = ((req.body.email).toString()).toLowerCase();
      const otp = (req.body.otp)
      const SQL = `SELECT * FROM users`;
       db.query(SQL, (error,data)=>
       {
        if(data!=undefined)
        {
         const Data = data.filter((data)=>data.email===email)
         const obj = Data[0]
         const response =bcrypt.compareSync(otp,obj.verification_code)
   
        if(response){
   
           return res.status(202).json({message: "Authentication successful",status:201});
        }else{
   
           return res.status(401).json({message: "Incorrect Otp Please enter correct OTP",status:401});
        }
       }else{
           console.log(result)
       }
       })
      })
 //confirm user OTP and delete account
 const deleteUser = asyncHandler ( async (req,res)=>{
  const email = ((req.body.email).toString()).toLowerCase();
  const otp = (req.body.otp)
  const SQL = `SELECT * FROM users`;
   db.query(SQL, (error,data)=>{
    if(data!=undefined)
    {
     const Data = data.filter((data)=>data.email===email)
     const obj = Data[0]
     const response =bcrypt.compareSync(otp,obj.verification_code)

    if(response){
     const SQL = `DELETE  FROM users WHERE id = ${obj.id}`;
     
     db.query(SQL,(err,data)=>{
        if(err)
        {
          return res.status(500).json({message: "Error Querying database"});
        }else{ 
           const data = { 
            email:`${email}`,
            subject:"Bloomzon Delete",
            text:`Your Bloomzon account was deleted successfully`
        } 
        sendEmail(data)
        return res.status(202).json({message: "Account deleted successful",status:1});

    }
  })

   }else{

     return res.status(401).json({message: "Incorrect Otp Please enter correct OTP",status:0});
  }
  }else{
    
 }
   })
  })


   //Reset Password
   const resetPassword = asyncHandler ( async (req,res)=>{

       const email = ((req.body.email).toString()).toLowerCase();
       const password = req.body.password
       const password_hash=bcrypt.hashSync(`${password}`, 10);
     
        const SQL = `SELECT * from users`
     
       db.query(SQL,(err,data)=>{
           if(err)
           {
             return res.status(500).json({message: "Error Querying database"});
           }else if(validator.isEmail(email)){
            const isExisted = data.filter((data)=>data.email===email)
            if(isExisted[0])
            {
            
        
             const SQL= `UPDATE users SET password = \'${password_hash}\'  WHERE id=${isExisted[0].id}`
             db.query(SQL,(error , data)=>{ 
                     if(error)
                     console.log(error)
                  console.info(data)
             }) 
             const data = { 
               email:`${email}`,
               subject:"Reset Password",
               text: `Your PremiumBlog account password has been updated \n if this action was not from you please send us mail at officialpremiumblog@gmail.com`
           } 
           sendEmail(data)
              return res.status(201).json({message: "Password updated",status:201});
                 
            }else{
              
               return res.status(401).json({message: "Failed to update password",status:401});
          
            }}else{
              return res.status(401).json({message: "invalid email address , Please enter a valid email",status:401});
            }
          })
      
       })
     

    //fetch user data
   const fetchUser = asyncHandler ( async (req,res)=>{

    const { userID } = req.body
    console.log(userID)
     const SQL = `SELECT * from users WHERE id = ${userID} `
  
    db.query(SQL,(err,result)=>{
        if(err)
        {
          return res.status(500).json({status:0,message: "Error Querying database"});
        }
        res.status(201).json({result:result})

       })
   
    })
  




  module.exports = {fetchUser,login,register,forgetPassword,confirmOTP,resetPassword};


