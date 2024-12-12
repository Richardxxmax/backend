require("dotenv").config();
const asyncHandler = require("express-async-handler");
const db = require("../../Model/dbConfig")
const currentDate = require("../../util/Date/currentDate")

const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.cloudinaryName,
  api_key: process.env.cloudinaryAPI_KEY,
  api_secret:process.env.cloudinaryAPI_SECRET,
  secure: true,
});


const createUpload = async (file) =>{
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }
  
  const deleteUpload = async (publicID) =>{
  
    const res = await cloudinary.uploader.destroy(publicID, (error,result)=>{
     if(error){
        console.log(error);
      }
    });
    return res;
  
  }

  const getPublicID = (imageUrl) =>{

    const id = imageUrl;
    const str = id.slice(-24); 
    const removeJPG = str.replace(/.jpg/g, "")
    const removePNG = removeJPG.replace(/.png/g, "")
    const removeJPG2 = removePNG.replace(/.JPG/g, "")
    const removePNG2 = removeJPG2.replace(/.PNG/g, "")
    const result = removePNG2
        return result;
   
  }



  //route for post shop avatar image
  const uploadNewsPhoto = asyncHandler (async (req, res,next) => {
        const {heading,creatorid,body,p1,p2,p3,p4,p5,categoryid,redirect} = req.body
        console.log(categoryid)
        console.log(req.file)
        console.log(req.headers['authorization'])
        const file = req.file;
        
      try{
            const b64 = Buffer.from(file.buffer).toString("base64");
            let dataURI = "data:" + file.mimetype + ";base64," + b64;
            const cldRes = await createUpload(dataURI);
            const imageUrl = cldRes.secure_url
            console.log(cldRes)
            const SQL = `INSERT INTO news(heading,image,body,p1,p2,p3,p4,p5,redirect,categoryId,creatorId,date)VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
            
    db.query(SQL,[heading,imageUrl,body,p1,p2,p3,p4,p5,redirect,categoryid,creatorid,currentDate()],(err,result)=>{
       if(err){
           res.status(500).send(err);
       }

       setTimeout(()=>{

        const SQL = "SELECT * from news"
        db.query(SQL,(error,result)=>{
            if(error){
                console.error(error)
               // return res.status(500).json({message: "Error Querying database"});
            }else if((result!=undefined)&(result.length!=0)){
                const newsCount = result.length
                const SQL = `UPDATE statistics SET newsCount=\'${newsCount}\' WHERE id=1`
                db.query(SQL,[newsCount],(error,result)=>{
                if(error){
                    console.error(error)
                   // return res.status(500).json({message: "Error Querying database"});
                }else{
 
                  // res.send({message: "News Created",status:1})
 
                }
             })
         }})

       },5000);

   })
        
          } catch (error) {
            console.log(error);
            res.send({
              message: error.message,
            });
          }
      
    next();

  })
   
module.exports = {uploadNewsPhoto}

