const functions = require('./util-functions'); //require Util functions
const express = require('express'); //generate and manipulate routes
const model = require('./model'); //require Database model and access
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


// GET request
app.get('/api/v1/services', async(req, res) => {
  res.send('hello world')
})


//configure the server port
var listener = app.listen(process.env.PORT, function(){
    console.log('Working in port ' + listener.address().port); 
});