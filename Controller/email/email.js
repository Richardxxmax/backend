require("dotenv").config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.smtpUser,
    pass: process.env.smtpPassword
  }
});


  const  sendEmail = async (data) =>{
    const mailOptions = {
          from: 'PremiumBlog News',
          to: `${data.email}`,
          subject: `${data.subject}`,
          text: `${data.text}`,
        };
        
    try{
        transporter.sendMail(mailOptions,(error, data)=>{
          if (error) {
         console.log(error);
          } else {
            console.log('Email sent: ' + data.response);
          }
        });
     
    }catch(error){
        console.error(error)
    } 
  
  }
  

module.exports = { sendEmail }