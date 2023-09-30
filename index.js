const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const dbConnection = require('./dbConfig/dbConnection.js');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

// Database Connection...
dbConnection();

//Add some middlewares

app.use(cors());
app.use(xss());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
// Authentication Routes: 
app.use('/api/auth', require('./routes/auth.js'));
// Property Routes: 
app.use('/api/property', require('./routes/property.js'));

app.listen(PORT, ()=>{
    console.log("Server is running on the PORT "+PORT);
})
