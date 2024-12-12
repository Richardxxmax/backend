const  db = require("../../Model/dbConfig.js")
const asyncHandler = require("express-async-handler");
const date = require("../../util/Date/currentDate.js");
const currentDate = require("../../util/Date/currentDate.js");


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




const deleteNews = asyncHandler ( async (req,res)=>{

    const {userID,newsID} = req.body
    const SQL = `SELECT * from news  WHERE id=${newsID}`;
    
db.query(SQL,(error,result)=>{
   if(error){
    res.status(201).json({status:0,message:"ERROR IN DELETING NEW"})
   }else if(result!=undefined){
      const newsData = result[0];
      const {heading,image,body,p1,p2,p3,p4,p5,comments,likes,views,bookmarks,share,redirect,status,categoryId,creatorId} = newsData
      const SQL = `INSERT INTO recyclebin(heading,image,body,p1,p2,p3,p4,p5,comments,likes,views,bookmarks,share,redirect,status,categoryId,creatorId,deletedBy,date)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
     db.query(SQL,[heading,image,body,p1,p2,p3,p4,p5,comments,likes,views,bookmarks,share,redirect,status,categoryId,creatorId,userID,currentDate()],(error,result)=>{
        if(error){
            console.log(error)
            res.status(201).json({status:0,message:"ERROR IN DELETING NEW"})
        }else{
            const SQL = `DELETE from news  WHERE id=${newsID}`;
         db.query(SQL,(error,result)=>{
            if(error){
                res.status(201).json({status:0,message:"ERROR IN DELETING NEW"})
            }else{
                res.status(201).json({status:1,message:"NEWS DELETED SUCCESSFULLY"})
            }

         })
           
        }
    
    })

   }else{
    res.status(201).json({status:0,message:"ERROR IN DELETING NEW"})
 
   }

     
//res.status(201).json({status:0,message:"ERROR IN DELETING NEWS2"}) 
})

})


const getAllNewsAdmin = asyncHandler ( async (req,res)=>{

    
    const SQL = `SELECT * from news  ORDER BY id DESC`;
    
db.query(SQL,(err,news)=>{
   if(err){
      console.log(err)
      return
   }
     
       res.status(201).json({visitorID:1,data:news})
 
})

})




const getAllNews = asyncHandler ( async (req,res)=>{

     const visitorId = req.body.visitorId
     const visitorIP = req.headers['ip']
     const city = req.headers['city']
     const longitude = req.headers['longitude']
     const latitude = req.headers['latitude']
     const networkip = req.headers['networkip']
     const countryName = req.headers['country_name']
     const categoryId = req.headers['categoryid']
     const SQL = `SELECT * from news WHERE categoryId = ${categoryId} ORDER BY id DESC`;
     console.log(visitorId)
 db.query(SQL,(err,news)=>{
    if(err){
        res.status(500).send(err);
    }
     if(visitorId==="-1"){
        

        const SQL = `INSERT INTO visitor(ip,networkIP,city,countryName,latitude,longitude,date)VALUES(?,?,?,?,?,?,?)`;
           
        db.query(SQL,[visitorIP,networkip,city,countryName,latitude,longitude,date()],(err,result)=>{
       if(err){
           res.status(500).send(err);
       }

       const SQL = "SELECT * from statistics"
       db.query(SQL,(error,result)=>{
           if(error){
               console.error(error)
              // return res.status(500).json({message: "Error Querying database"});
           }else if(result!=undefined){
               const visitorCounter = Number(result[0].visitorCounter)
               const SQL = `UPDATE statistics SET visitorCounter=\'${(visitorCounter + 1)}\' WHERE id=1`
               db.query(SQL,(error,result)=>{
               if(error){
                   console.error(error)
                  // return res.status(500).json({message: "Error Querying database"});
               }else{
                res.status(201).json({visitorID:1,data:news})
                 }
            })
        }else{
            return
        }})
   
    
     })



     }else{
        
        res.status(201).json({visitorID:1,data:news})
     }


   
})
})


const getNewsById = asyncHandler ( async (req,res)=>{
    const link = req.params.id
    const heading = link.replaceAll("+"," ")
    const visitorIP = req.headers['ip']
    const city = req.headers['city']
    const longitude = req.headers['longitude']
    const latitude = req.headers['latitude']
    const networkip = req.headers['networkip']
    const countryName = req.headers['country_name']
    const visitorId = req.headers['visitorid']
    if((heading!==undefined)&&(heading!==null)&&(heading!==-1)&&(heading!=="-1")){
    const ViewSQL =  `SELECT views from news WHERE heading=\'${heading}\' `;

     db.query(ViewSQL,(err,result)=>{

        if(err){
            res.status(500).send(err);
        }
        if((result!=undefined)&(result.length!=0)){

            var views = Number(result[0].views)
        }else{
            var views = 0
        }

    
        const updateViewSQL = `UPDATE news SET views = \'${views+1}\' WHERE heading=\'${heading}\' `;
        db.query(updateViewSQL,(err,result)=>{
               if(err){
                res.status(500).send(err);
               }
               
        })

    })

    const SQL = `SELECT * from news WHERE heading=\'${heading}\' `;
    db.query(SQL,(err,newsRecord)=>{
       if(err){
           res.status(500).send(err);
       }
       if((newsRecord!=undefined)&(newsRecord.length!=0)){
        var id = newsRecord[0].id
        var commentSQL  =  `SELECT * from comments WHERE post_id=\'${id}\' `;
    }else{
         return
    }
       db.query(commentSQL,(error,comments)=>{
        if(error){
            res.status(500).send(err);
        }
        
        if(visitorId==="-1"){

            const SQL = `INSERT INTO visitor(ip,networkIP,city,countryName,latitude,longitude,date)VALUES(?,?,?,?,?,?,?)`;
           
            db.query(SQL,[visitorIP,networkip,city,countryName,latitude,longitude,date()],(err,result)=>{
               if(err){
                   res.status(500).send(err);
               }
        
               const SQL = "SELECT * from statistics"
               db.query(SQL,(error,result)=>{
                   if(error){
                       console.error(error)
                      // return res.status(500).json({message: "Error Querying database"});
                   }else if((result!=undefined)&(result.length!=0)){
                       const visitorCounter = Number(result[0].visitorCounter)
                       const SQL = `UPDATE statistics SET visitorCounter=\'${(visitorCounter + 1)}\' WHERE id=1`
                       db.query(SQL,(error,result)=>{
                       if(error){
                           console.error(error)
                          return res.status(500).json({message: "Error Querying database"});
                       }else{
                        res.status(200).json({newsRecord:newsRecord,commentRecord:comments,visitorID:1,notFound:false})
                         }
                    })
                }})
           
            
             })
            }else{
                  res.status(200).json({newsRecord:newsRecord,commentRecord:comments,visitorID:1,notFound:false})
            }




       })

   })
}else{
    //handle error of link not found

    res.status(200).json({newsRecord:newsRecord,commentRecord:comments,visitorID:1,notFound:true})
   
}

   })


   

   const createNews = asyncHandler ( async (req,res)=>{

    const {heading,image,body,p1,p2,p3,p4,p5,redirect} = req.body

    console.log(redirect)

    const SQL = `INSERT INTO news(heading,image,body,p1,p2,p3,p4,p5,redirect,date)VALUES(?,?,?,?,?,?,?,?,?,?)`;
   
    db.query(SQL,[heading,image,body,p1,p2,p3,p4,p5,redirect,date()],(err,result)=>{
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
 
                   res.status(201).json({message: "News Created",status:1})
 
                }
             })
         }})

       },5000);

   })
   })

   const postComment= asyncHandler ( async (req,res)=>{

    const {post_id,user_id,comment} = req.body
    let Author = "Anonymous";
    const link = post_id.replaceAll("+"," ")

    const SQL = `SELECT * from news  WHERE heading = \'${link}\' `;

    db.query(SQL,(error,result)=>{

        if(error){
            console.error(error)
            return res.status(500).json({message: "Error Querying database"});
        }
        if((result!=undefined)&(result.length!=0)){
            var post_id = result[0].id

        }else{
             return
        }

    const SQL = `SELECT * from users WHERE id=\'${user_id}\' `;
    db.query(SQL,(error,result)=>{
        if(error){
            console.error(error)
            return res.status(500).json({message: "Error Querying database"});
        }else if((result!=undefined)&(result.length!=0)){
              Author = result[0].firstName
         const SQL = `INSERT INTO comments(post_id,user_id,author,comment,date)VALUES(?,?,?,?,?)`;
   
         db.query(SQL,[post_id,user_id,Author,comment,date()],(err,result)=>{
         if(err){
           res.status(500).send(err);
          }else{

            const commentSQL =  `SELECT comments from news WHERE id=\'${post_id}\' `;

            db.query(commentSQL,(err,result)=>{
       
               if(err){
                   res.status(500).send(err);
               }
               if((result!=undefined)&(result.length!=0)){
                var  comments = Number(result[0].comments)
    
            }else{
                 return
              }
              const updateCommentSQL = `UPDATE news SET comments = \'${comments+1}\' WHERE id=\'${post_id}\' `;
               db.query(updateCommentSQL,(err,result)=>{
                      if(err){
                       res.status(500).send(err);
                      }

                      setTimeout(()=>{
                        res.status(200).json({comment:comment,date:date(),author:Author})

                      },1000);
                      
               })
       
           })

          }


        
        })
        }else{
            console.log(Author)
            const SQL = `INSERT INTO comments(post_id,user_id,author,comment,date)VALUES(?,?,?,?,?)`;
   
         db.query(SQL,[post_id,user_id,Author,comment,date()],(err,result)=>{
         if(err){
           res.status(500).send(err);
          }else{

            const commentSQL =  `SELECT comments from news WHERE id=\'${post_id}\' `;

            db.query(commentSQL,(err,result)=>{
       
               if(err){
                   res.status(500).send(err);
               }
               const comments = Number(result[0].comments)
               
               const updateCommentSQL = `UPDATE news SET comments = \'${comments+1}\' WHERE id=\'${post_id}\' `;
               db.query(updateCommentSQL,(err,result)=>{
                      if(err){
                       res.status(500).send(err);
                      }

                      setTimeout(()=>{
                        res.status(200).json({comment:comment,date:date(),author:Author})

                      },1000);
                      
               })
       
           })

          }


        
        })

        

        }
    })
      })
   })


   const sharePost = asyncHandler ( async (req,res)=>{

    const {post_id,user_id} = req.body
    let userFirstName = "Anonymous";
    console.log(user_id)
    console.log(post_id)

    const SQL = `SELECT * from users WHERE id=\'${user_id}\' `;
    db.query(SQL,(error,result)=>{
        if(error){
            console.log(error)
            return 
        }else if((result!=undefined)&(result.length!=0)){
              userFirstName = result[0].firstName
         const SQL = `INSERT INTO sharedPost(post_id,user_id,userFirstName,date)VALUES(?,?,?,?)`;
   
         db.query(SQL,[post_id,user_id,userFirstName,date()],(err,result)=>{
         if(err){
            console.log(err)
            return 
          }else{
            const SQL =  `SELECT share from news WHERE id=\'${post_id}\' `;

            db.query(SQL,(err,result)=>{
       
               if(err){
                console.log(err)
                return 
               }
               const share = Number(result[0].share)
               
               const updateShareSQL = `UPDATE news SET share = \'${share+1}\' WHERE id=\'${post_id}\' `;
               db.query(updateShareSQL,(err,result)=>{
                      if(err){
                        console.log(err)
                        return 
                      }
                })
       
           })}
        })
        }else{
            
            const SQL = `INSERT INTO sharedPost(post_id,user_id,userFirstName,date)VALUES(?,?,?,?)`;
   
         db.query(SQL,[post_id,user_id,userFirstName,date()],(err,result)=>{
         if(err){
            console.log(err)
            return 
          }else{

            const SQL =  `SELECT share from news WHERE id=\'${post_id}\' `;

            db.query(SQL,(err,result)=>{
       
               if(err){
                console.log(err)
                return 
               }
               if((result!=undefined)&(result.length!=0)){
                  var share = Number(result[0].share)
               }

               const SQL = `UPDATE news SET share = \'${share+1}\' WHERE id=\'${post_id}\' `;
               db.query(SQL,(err,result)=>{
                      if(err){
                       res.status(500).send(err);
                      }
                      
               })
       
           })

          }
        
        })

        

        }
    })
   })


   const likePost =  asyncHandler ( async (req,res)=>{

    const {post_id,user_id} = req.body
    let userFirstName = "Anonymous";
    console.log(user_id)
    console.log(post_id)

    const SQL = `SELECT * from users WHERE id=\'${user_id}\' `;
    db.query(SQL,(error,result)=>{
        if(error){
            console.log(error)
            return 
        }else if((result!=undefined)&(result.length!=0)){
              userFirstName = result[0].firstName
         const SQL = `INSERT INTO likedPost(post_id,user_id,userFirstName,date)VALUES(?,?,?,?)`;
     
         db.query(SQL,[post_id,user_id,userFirstName,date()],(err,result)=>{
         if(err){
            console.log(err)
            return 
          }else{
            const SQL =  `SELECT likes from news WHERE id=\'${post_id}\' `;

            db.query(SQL,(err,result)=>{
       
               if(err){
                console.log(err)
                return 
               }
               const likes = Number(result[0].likes)
               
               const updateShareSQL = `UPDATE news SET likes = \'${likes+1}\' WHERE id=\'${post_id}\' `;
               db.query(updateShareSQL,(err,result)=>{
                      if(err){
                        console.log(err)
                        return 
                      }
                })
       
           })}
        })
        }else{

        
            
            const SQL = `INSERT INTO likedPost(post_id,user_id,userFirstName,date)VALUES(?,?,?,?)`;
   
         db.query(SQL,[post_id,user_id,userFirstName,date()],(err,result)=>{
         if(err){
            console.log(err)
            return 
          }else{

            const SQL =  `SELECT likes from news WHERE id=\'${post_id}\' `;

            db.query(SQL,(err,result)=>{
       
               if(err){
                console.log(err)
                return 
               }
               if((result!=undefined)&(result.length!=0)){
                  var likes = Number(result[0].likes)
               }

               const SQL = `UPDATE news SET likes = \'${likes+1}\' WHERE id=\'${post_id}\' `;
               db.query(SQL,(err,result)=>{
                      if(err){
                       console.log(error)
                       return
                      }
                      
               })
       
           })

          }
        
        })

        

        }
    })
   })


   const bookmarkPost =  asyncHandler ( async (req,res)=>{

    const {post_id,user_id} = req.body
    let userFirstName = "Anonymous";
    console.log(user_id)
    console.log(post_id)

    const SQL = `SELECT * from users WHERE id=\'${user_id}\' `;
    db.query(SQL,(error,result)=>{
        if(error){
            console.log(error)
            return 
        }else if((result!=undefined)&(result.length!=0)){
              userFirstName = result[0].firstName
         const SQL = `INSERT INTO bookmarkPost(post_id,user_id,userFirstName,date)VALUES(?,?,?,?)`;
     
         db.query(SQL,[post_id,user_id,userFirstName,date()],(err,result)=>{
         if(err){
            console.log(err)
            return 
          }else{
            const SQL =  `SELECT bookmarks from news WHERE id=\'${post_id}\' `;

            db.query(SQL,(err,result)=>{
       
               if(err){
                console.log(err)
                return 
               }
               const bookmarks = Number(result[0].bookmarks)
               
               const updateShareSQL = `UPDATE news SET bookmarks = \'${bookmarks+1}\' WHERE id=\'${post_id}\' `;
               db.query(updateShareSQL,(err,result)=>{
                      if(err){
                        console.log(err)
                        return 
                      }
                })
       
           })}
        })
        }else{

          const SQL = `INSERT INTO bookmarkPost(post_id,user_id,userFirstName,date)VALUES(?,?,?,?)`;
   
         db.query(SQL,[post_id,user_id,userFirstName,date()],(err,result)=>{
         if(err){
            console.log(err)
            return 
          }else{

            const SQL =  `SELECT bookmarks from news WHERE id=\'${post_id}\' `;

            db.query(SQL,(err,result)=>{
       
               if(err){
                console.log(err)
                return 
               }
               if((result!=undefined)&(result.length!=0)){
                  var bookmarks = Number(result[0].bookmarks)
               }

               const SQL = `UPDATE news SET bookmarks = \'${bookmarks+1}\' WHERE id=\'${post_id}\' `;
               db.query(SQL,(err,result)=>{
                      if(err){
                       console.log(error)
                       return
                      }
                      
               })
       
           })

          }
        
        })

        

        }
    })
   })



   module.exports =  {getAllNews,getAllNewsAdmin,getNewsById,createNews,postComment,sharePost,likePost,bookmarkPost,deleteNews}