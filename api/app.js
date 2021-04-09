const express = require('express'); //generate and manipulate routes
const mongoose = require('mongoose'); //ORM to manipulate MongoDB
const fs = require('fs'); //Module to manipulete files
const fileUpload = require('express-fileupload'); //Allow file uploads and form data
const cors = require('cors'); //Allow or bloc access for diferent origins
require('dotenv').config();

const app = express();

app.use(
    express.json(), //Json data
    fileUpload(), //File upload
    cors() //Requests for all origins
)


//configure the server port
var listener = app.listen(process.env.PORT, function(){
    console.log('Working in port ' + listener.address().port); 
});