const express = require("express")
const router = express.Router()


const { login,register,forgetPassword,confirmOTP,resetPassword,fetchUser} = require("../../Controller/users/userController")
//const {forgetPassword,,,deleteUser} = require("../../Controllers/usersController/Auth/Auth")


//user routes
router.post("/login",login);
router.post("/createaccount",register);


//Auth route
router.post("/forgotpassword",forgetPassword);
router.post("/confirmotp",confirmOTP);
router.post("/resetpassword",resetPassword);
router.post("/getuser",fetchUser);


module.exports = router