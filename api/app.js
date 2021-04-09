const functions = require('./util-functions'); //require Util functions
const express = require('express'); //generate and manipulate routes
const model = require('./model'); //require Database model and access
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

    services = await model.Services.find().sort({service_id: -1})
    const data = {data: services.map(model.transformer)};
    res.status(200).send(data)

})


// POST request
app.post('/api/v1/services', async(req, res) => {


    //check if the inputData fields are missing or empty
    if (functions.empty(req.body.title) || functions.empty(req.body.price)) {
        return res.status(202).send(
            {
                message: 'Empty fields'
            }
        )
    }

    //Verify if title exists
    verify = await model.Services.findOne({ title: req.body.title }, 'title').exec();
    if (verify !== null){
        if (verify.title == req.body.title) {
            return res.status(202).send(
                {
                    message: 'This title already exists'
                }
            )
        }
    }


    const service_id = functions.getTimestamp();


    //save the new service data to database
    new model.Services({
        service_id:  service_id,
        title:  req.body.title,
        price: parseFloat(req.body.price),
        image:  req.body.image
    }).save().then(() => {
        console.log('registered succesfull')
    }).catch((error) =>{
        console.log('Error to register '.error)
    })



    //Formated response 
    res.status(201).send(
        {
            service_id: service_id,
            message: ''+req.body.title+' service successfully created'
        }
    )



})





app.delete('/api/v1/services/:service_id', async (req, res) => {

    //Verify if service_id exists
    verify = await model.Services.findOne({ service_id: req.params.service_id }, 'service_id').exec();
    if (verify !== null){
        if (verify.service_id == req.params.service_id) {

            await model.Services.deleteOne({ service_id: req.params.service_id }).exec();
            return res.status(200).send(
                {
                    service_id: req.params.service_id,
                    message: 'Service with id '+ req.params.service_id + ' was deleted'
                }
            )

        }
        else{
            return res.status(202).send(
                {
                    message: 'Service with id '+ req.params.service_id + ' not exist'
                }
            )
        }
    }

    else{
        return res.status(202).send(
            {
                message: 'Service with id '+ req.params.service_id + ' not exist'
            }
        )
    }


})













//configure the server port
var listener = app.listen(process.env.PORT, function(){
    console.log('Working in port ' + listener.address().port); 
});