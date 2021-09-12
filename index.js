'use strict';

const { json } = require('express');
const express = require('express');
const morgan = require('morgan');


const app = express();

app.use(express.json());

// Define a new token (:content)
morgan.token('content', (req, res) => {
    if (req.method === 'POST')
        return JSON.stringify(req.body);
    return '';
}); 

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content')); // Log incoming requests.

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
];


app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people. </p> 
                   <p> ${new Date()} </p>`);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    
    const foundPerson = persons.find(p => p.id === id);
    if (foundPerson)
        response.json(foundPerson);  
    else
        response.status(404).end(); // Not Found
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    const foundPerson = persons.find(p => p.id === id);
    if (foundPerson) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end(); // No Content
    }
    else 
        response.status(204).end(); // No Content
});

// The max value is not enforced by javascript, but feels traditional enough to use here.
const max_id = Math.pow(2, 31) - 1;

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
    if (typeof person.number !== 'number')
        return 'number is not a number'

    if (persons.find(p => p.name === person.name))
        return 'person already exists in phonebook';
    
    return ''; // No problems detected.
}  

app.post('/api/persons', (request, response) => {
    const input = request.body;
    const error = validatePerson(input);

    if (error)
        return response.status(400).json({error}); // Bad Request

    const newPerson = {
        name: input.name, 
        number: input.number,
        id: Math.floor(Math.random() * max_id)
    };
    persons = persons.concat(newPerson);
    response.json(newPerson);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
