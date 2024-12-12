const mysql = require("mysql2");
require("dotenv").config();

// create the connection to database
const db = mysql.createPool({
    connectionLimit : 100, //important
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.database
 })

 module.exports = db;