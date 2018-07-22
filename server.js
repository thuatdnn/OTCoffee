const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user:passw0rd@ds121321.mlab.com:21321/bapticket', );
mongoose.connection.on('error', error => console.log(error) );


global.APP_KEY = "abcdef";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3000, ()=>{
    console.log("server was started with port 3000")
})