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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
    .catch(error => next(error));
});

// TODO: Handle case where incoming id is not in database.
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person)
            response.json(person);
        else
            response.status(404).end(); // Not Found
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(removed => {
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

    if (!person.number)
        return 'number missing';
    if (typeof person.number !== 'string')
        return 'number is not a string';

    // if (persons.find(p => p.name === person.name)) // persons temporarily does not exist.
    //     return 'person already exists in phonebook';
    
    return ''; // No problems detected.
}  

app.post('/api/persons', (request, response, next) => {
    const receivedPerson = request.body;
    const error = validatePerson(receivedPerson);

    if (error)
        return next({name: 'ValidationError', message: error});

    const person = new Person({ // ID handled by database
        name: receivedPerson.name, 
        number: receivedPerson.number,
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const receivedPerson = request.body;
    const error = validatePerson(receivedPerson);

    if (error)
        return next({name: 'ValidationError', message: error});

    const personToSend = {
        name: receivedPerson.name,
        number: receivedPerson.number
    };

    // {new: true} will make this pass the updated person (instead of the old person)
    Person.findByIdAndUpdate(request.params.id, personToSend, {new: true}).then(updatedPerson => {
        if (updatedPerson)
            response.json(updatedPerson);
        else
            response.status(404).end(); // Not Found
    })
    .catch(error => next(error));
});


const handleErrors = ((error, request, response, next) => {
    console.error(error.message);

    if (error.name == 'CastError') {
        return response.status(400).send({error: 'malformatted id'}); // Bad Request
    }

    if (error.name == 'ValidationError')
        return response.status(400).send({error: error.message}); // Bad Request

    next(error);
});

app.use(handleErrors)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
