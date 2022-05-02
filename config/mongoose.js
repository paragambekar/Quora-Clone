const mongoose = require('mongoose');
const env = require('../config/environment');
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

// Throw error when not able to establish connection with data 
db.on('error',console.error.bind(console,'Error connecting to database'));

// To check is successfully connected to database 
db.once('open',function(){
    console.log('Successfully connected to MongoDB');
});

module.exports = db;