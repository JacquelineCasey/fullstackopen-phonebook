'use strict'

require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message));

// MongoDB adds its own id, so we don't use ours.
const personSchema = new mongoose.Schema ({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
