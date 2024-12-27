const express = require("express")
const router = express.Router()


const {getTransaction} = require("../../Controller/Transaction/Transaction")


//routes
router.post("/gettransactions",getTransaction)




module.exports = router