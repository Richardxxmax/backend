const express = require("express")
const router = express.Router()


const {AdminData} = require("../../Controller/Admin/AdminDashboard")
const {auth} = require("../../Middleware/auth")
//admin routes
router.post("/adminpanel",auth,AdminData);






module.exports = router