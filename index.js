'use strict';

const cors = require('cors');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const Person = require('./models/person');


const app = express();

app.use(express.json());

// Allow for Cross Origin Resource Sharing
app.use(cors());

// Have express serve stuff in build/ if it can find a match.
app.use(express.static('phonebook-frontend/build')); 

// Define a new token (:content)
morgan.token('content', (req, res) => {
    if (req.method === 'POST')
        return JSON.stringify(req.body);
    return '';
}); 

// Log incoming requests. (But not CORS or static requests, as this is below)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content')); 


app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people. </p> 
                   <p> ${new Date()} </p>`);
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

// TODO: Handle case where incoming id is not in database.
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    });
});

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(removed => {
            /* Could differentiate already deleted vs actual delete here in the future. */
            response.status(204).end(); // No Content
        })
        .catch(error => next(error));
});

// Returns a string error, or "" if no error.
function validatePerson(person) {
    if (!person)
        return 'missing person';

    if (!person.name)
        return 'name missing';
    if (typeof person.name !== 'string')
        return 'name is not a string';

    if (person.number === undefined)
        return 'number missing';
    if (typeof person.number !== 'string')
        return 'number is not a string';

    // if (persons.find(p => p.name === person.name)) // persons temporarily does not exist.
    //     return 'person already exists in phonebook';
    
    return ''; // No problems detected.
}  

app.post('/api/persons', (request, response) => {
    const input = request.body;
    const error = validatePerson(input);

    if (error)
        return response.status(400).json({error}); // Bad Request

    const person = new Person({ // ID handled by database
        name: input.name, 
        number: input.number,
    });

    person.save().then(savedPerson => response.json(savedPerson));
});





const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
