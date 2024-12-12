const express = require("express")
const router = express.Router()


const {deleteVisitor,AdminData,getAllVisitorsAdmin } = require("../../Controller/Admin/AdminDashboard")
const {auth} = require("../../Middleware/auth")
//admin routes
router.post("/adminpanel",auth,AdminData);
router.post("/adminpanel/getvisitors",auth,getAllVisitorsAdmin);
router.post("/adminpanel/deletevisitors",auth,deleteVisitor);





module.exports = router