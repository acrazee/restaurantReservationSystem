const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
//parse URL-encoded bodies and JSON bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
//serve files from 'frontend' dir
app.use(express.static('frontend'));


//import routes
const reservationRoutes = require('./routes/reservationRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

//use routes
app.use('/api/reservations', reservationRoutes );
app.use('/api/admin',adminRoutes);

module.exports = app;