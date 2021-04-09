const functions = require('./util-functions'); //require Util functions
const mongoose = require('mongoose'); //ORM to manipulate MongoDB
require('dotenv').config();


//Database credentials defined in .env file
const dbServer = process.env.DB_SERVER;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbCluster = process.env.DB_CLUSTER;

//change connectionString acording to your server connection - in this case, is Atlas Mongo DB
let connectionString =  ''+dbServer+dbUser+':'+dbPassword+dbCluster+dbName+'';

mongoose.Promise = global.Promise;
//Connect to Mongo database
mongoose.connect(connectionString, {
    useNewUrlParser: true , 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
}).then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log("Error to connect database: " + err);
});


//Define model to generate database and collection automatically
const serviceSchema = mongoose.Schema({
    service_id: { type: String,  unique: true, required: true, trim: true },
    title: { type: String, unique: true, required: true, trim: true },
    price:{ type: String , required: true, trim: true },
    created: { type: String, default: functions.getDateTime() },
    updated: { type: String, default: functions.getDateTime() }
});

//Generate Collection item
const Services = mongoose.model('services', serviceSchema);
