require("dotenv").config();
const jwt =  require('jsonwebtoken')
const Multer = require('multer')

const storage = new Multer.memoryStorage();

const upload = Multer({
  storage,
});

 const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const auth = (req,res,next) =>{


    if(req.headers.authorization===undefined || req.headers.authorization===null){
    
        res.status(401).json({
            message : "Unauthorized, token does not exist"
        })
    }

    let token = req.headers['authorization'];

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        next();
    });


}

module.exports = {
      JWT_SECRET_KEY,auth,upload
}