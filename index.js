const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser");
const helmet = require("helmet");
const date = require("./util/Date/currentDate")

const PORT = process.env.PORT || 7500
const usersRoutes = require("./Routes/users/userRouter")
const AdminRoutes = require("./Routes/Admin/AdminRoute")
const CronJob = require("./Routes/CronJob/CronJob")
const transactionRoute = require("./Routes/transactions/transactionsRouter")


const app = express();
//Middleware
//MiddleWares

app.set('trust proxy', true);
app.use(cors({"Access-Control-Expose-Headers": "Content-Range"}));
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(helmet())
app.use(usersRoutes)
app.use(AdminRoutes)
app.use(transactionRoute)
app.use(CronJob)

console.log(date())

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})
