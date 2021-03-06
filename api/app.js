const functions = require('./util-functions'); //require Util functions
const express = require('express'); //generate and manipulate routes
const model = require('./model'); //require Database model and access
const modelImages = require('./modelImages'); //require Database model and access
const fileUpload = require('express-fileupload'); //Allow file uploads and form data
const cors = require('cors'); //Allow or block access for diferent origins
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(
    express.json(), //Json data
    fileUpload(), //File upload
    cors(), //Requests for all origins
    express.static("view") //Allow static file path - view
)

/* VIEW route - GET method */
app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile('view/');
})




// GET request
app.get('/api/v1/services', async(req, res) => {

    //Mongoose function to retrieve dta from database
    services = await model.Services.find().sort({service_id: -1})
    const data = {data: services.map(model.transformer)};
    res.status(200).send(data)

})


// POST request
app.post('/api/v1/services', async(req, res) => {


    //check if the input fields are missing or empty
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




app.get('/api/v1/services/:service_id', async (req, res) => {


    //check if the param service_id are missing or empty
    if (functions.empty(req.params.service_id)) {
        return res.status(202).send(
            {
                message: 'Empty service_id'
            }
        )
    }

    service = await model.Services.findOne({ service_id: req.params.service_id }).exec();

    if (service !== null) {
        const data = {data: [model.transformer(service)]};
        res.status(200).send(data)
    }
    else{
        return res.status(404).send(
            {
                message: 'The service with id '+req.params.service_id+' not exist'
            }
        )
    }


})






app.put('/api/v1/services/:service_id', async (req, res) => {


    //check if the param service_id are missing or empty
    if (functions.empty(req.params.service_id)) {
        return res.status(202).send(
            {
                message: 'Empty service_id'
            }
        )
    }

    service = await model.Services.findOne({ service_id: req.params.service_id }).exec();

    if (service !== null) {
        
        //check if the input fields are missing or empty
        if (functions.empty(req.body.title) || functions.empty(req.body.price)) {
            return res.status(202).send(
                {
                    message: 'Empty fields'
                }
            )
        }

        const filter = { service_id: req.params.service_id };
        const update = { 
            title:  req.body.title,
            price: parseFloat(req.body.price),
            image:  req.body.image,
            updated: functions.getDateTime(),
        };


        await model.Services.findOneAndUpdate(filter, update);

        //Formated response 
        res.status(200).send(
            {
                service_id: req.params.service_id,
                message: ''+req.body.title+' service successfully updated'
            }
        )


    }
    else{
        return res.status(404).send(
            {
                message: 'The service with id '+req.params.service_id+' not exist'
            }
        )
    }


})







app.delete('/api/v1/services/:service_id', async (req, res) => {


    //check if the param service_id are missing or empty
    if (functions.empty(req.params.service_id)) {
        return res.status(202).send(
            {
                message: 'Empty service_id'
            }
        )
    }

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






// GET request for images
app.get('/api/v1/images', async(req, res) => {

    let images = await modelImages.listImages();
    let data = images

    res.status(200).send(data)

})


// POST request for images
app.post('/api/v1/images', async(req, res) => {

    if(req.files == null){
        return res.status(202).send(
            {
                message: 'Empty image file'
            }
        )    
    }

    else{

        imageFile = req.files.image
        imageName = req.files.image.name;
        
        //Temporarily saves image to server 
        imageFile.mv('./'+imageName);

        //Send image to Google Cloud storage
        uploaded = await modelImages.uploadImage(imageName);

        if(uploaded){
            //Delete image in server 
            fs.unlinkSync('./'+imageName);
            res.status(200).send()
        }
        else{
            res.status(202).send()
        }
    }

})



// DELETE request for images
app.delete('/api/v1/images/:file_name', async(req, res) => {

    //check if the param service_id are missing or empty
    if (functions.empty(req.params.file_name)) {
        return res.status(202).send(
            {
                message: 'Empty File Name'
            }
        )
    }

    //Delete image in Google Cloud storage
    let images = await modelImages.deleteImage(req.params.file_name);
    let data = images

    res.status(200).send(data)

})







//configure the server port
var listener = app.listen(process.env.PORT, function(){
    console.log('Working in port ' + listener.address().port); 
});