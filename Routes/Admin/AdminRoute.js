const express = require("express")
const router = express.Router()


const {AdminData,updateAvailableBalance,updateCurrentBalance} = require("../../Controller/Admin/AdminDashboard")
const {auth} = require("../../Middleware/auth")
//admin routes
router.post("/adminpanel",auth,AdminData);
router.post("/updateavailablebalance",updateAvailableBalance);
router.post("/updatecurrentbalance",updateCurrentBalance);






module.exports = router