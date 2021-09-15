'use strict'

require('dotenv').config();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message));

// MongoDB adds its own id, so we don't use ours.
const personSchema = new mongoose.Schema ({
    name: {
        type: String,
        unique: true
    },
    number: String
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});


module.exports = mongoose.model('Person', personSchema);
