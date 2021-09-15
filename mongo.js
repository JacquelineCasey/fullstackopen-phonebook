/* This is a utility file for adding entries to the database, and listing entries
 * there. It is not used by the main code in any way. */

const mongoose = require('mongoose');

/* Format Gaurd */
if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('Uses of this script should be formatted as follows:');
    console.log('- To add an entry: node mongo.js <password> "Full Name" 123-456-7890');
    console.log('- To view all entries: node mongo.js <password>');
    process.exit(1);
}

/* Common Logic for opening up connection, setting up person model. */
const password = process.argv[2];
const databaseUrl = `mongodb+srv://jackcasey067:${password}@phonebook-cluster.8gfky.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(databaseUrl);

// MongoDB adds its own id, so we don't use ours.
const personSchema = new mongoose.Schema ({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

/* Add a new person to the database */
if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    person.save().then(result => {
        console.log(`Added ${result.name} with number ${result.number} to phonebook.`);
        mongoose.connection.close();
    });
}

/* Print out all people in the database */
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook: ');
        result.forEach(person => {
            console.log(person.name, person.number);
        });

        mongoose.connection.close();
    });
}
