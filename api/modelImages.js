const functions = require('./util-functions'); //require util functions
const {Storage} = require('@google-cloud/storage'); //To storage images in Google Cloud
const fs = require('fs'); //To manipulate files
require('dotenv').config();



async function generateFirebaseKey(){

    //Generate firebase key with data defined in .env file
    //See https://cloud.google.com/iam/docs/creating-managing-service-account-keys 
    fs.access("firebase-key.json", (err) => {
        if (err) {

            // json data
            const objectData = {
                type: process.env.TYPE,
                project_id: process.env.PROJECT_ID,
                private_key_id: process.env.PRIVATE_KEY_ID,
                private_key: process.env.PRIVATE_KEY,
                client_email: process.env.CLIENT_EMAIL,
                client_id: process.env.CLIENT_ID,
                auth_uri: process.env.AUTH_URI,
                token_uri: process.env.TOKEN_URI,
                auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
                client_x509_cert_url: process.env.CLIENT_CERT_URL
            }
        

            const jsonData = JSON.stringify(objectData);

            //Generate file if not exists
            fs.writeFile("firebase-key.json", jsonData, function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
            
                //console.log("JSON file has been saved.");
            });

        } 
    });
    


}




//upload of file
async function uploadImage(file) {

    generateFirebaseKey()

    //Define file of firebase key
    const storage = new Storage({
        keyFilename: './firebase-key.json'
    });
    
    const bucketName = process.env.BUCKET_NAME


    try{
        // Uploads a local file to the Google Cloud bucket
        await storage.bucket(bucketName).upload(file, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            // By setting the option `destination`, you can change the name of the
            // object you are uploading to a bucket.
            metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                //cacheControl: 'public, max-age=31536000',
                cacheControl: 'no-cache'
            },  
        }); 
        return true
    }

    catch(err) {
        console.log(err);
        return false
    }

}






async function listImages() {

    generateFirebaseKey()

    // Creates a client
    const storage = new Storage({
        keyFilename: './firebase-key.json'
    });

    const bucketName = process.env.BUCKET_NAME
    
    // Lists files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles();


    let arr = [];

    //Insert data in array
    files.forEach(file => {
        arr.push("https://storage.cloud.google.com/" + bucketName + "/" + file.name);
    });

    return arr;

}




//delete file
async function deleteImage(fileName) {

    generateFirebaseKey()

    // Creates a client
    const storage = new Storage({
        keyFilename: './firebase-key.json'
    });

    const bucketName = process.env.BUCKET_NAME

    try{
        //Delete file from Google Cloud (Firebase)
        await storage.bucket(bucketName).file(fileName).delete();
        return true
    }
    catch(err) {
        console.log(err);
        return false
    }

}




module.exports.uploadImage = uploadImage;
module.exports.listImages = listImages;
module.exports.deleteImage = deleteImage;
