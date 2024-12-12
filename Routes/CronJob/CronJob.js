const express = require("express")
const router = express.Router()

const {CronJobController} = require("../../Controller/CronJob/CronJobController")

router.get('/cronjob',CronJobController)


module.exports = router