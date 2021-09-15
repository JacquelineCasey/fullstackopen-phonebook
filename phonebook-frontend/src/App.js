
import React from 'react';

import Entries from './components/Entries';
import Filter from './components/Filter';
import Form from './components/Form';
import Notification from './components/Notification';
import PhonebookService from './services/phonebook';


const App = () => {
    /* Text Field State and Handlers. */
    const [newName, setNewName] = React.useState('');
    const [newNumber, setNewNumber] = React.useState('');
    const [filterTarget, setFilterTarget] = React.useState('');

    const handleNameFieldChange = (event) => setNewName(event.target.value);
    const handleNumberFieldChange = (event) => setNewNumber(event.target.value);
    const handleFilterFieldChange = (event) => setFilterTarget(event.target.value);

    /* Notification State and Handler */
    const [notificationState, setNotificationState] = React.useState({text: null, isWarning: false, timer: undefined});

    const addNotification = (text, isWarning=false) => {
        /* Ensure that old timers don't make this timer super short. */
        window.clearTimeout(notificationState.timer);
        const timer = setTimeout(() => {
            setNotificationState({text: null, isWarning});
        }, 5000);
        setNotificationState({text, isWarning, timer});
    };

    /* Phonebook Data */
    const [persons, setPersons] = React.useState([]);

    /* Get Initial Phonebook Data */
    React.useEffect(() => {
        PhonebookService.getAll().then(returnedData => {
            setPersons(returnedData);
        });
    }, []); // []: Only fire the effect once.

    /* Update Phonebook Data */
    const handleFormSubmission = (event) => {
        event.preventDefault();

        const newPerson = {name: newName, number: newNumber};
        const matchingPerson = persons.find(person => person.name === newPerson.name); // Probably undefined
        
        /* Check if newPerson is unique. */
        if (matchingPerson === undefined) {
            PhonebookService
                .create(newPerson)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson));
                    addNotification(`Added ${newPerson.name}`);
                })
                .catch(error => {
                    console.log(error.response.data);
                    addNotification(error.response.data.error, true);
                });
        }
        /* If not, offer to update. */
        else if(window.confirm(`${matchingPerson.name} is already in the the ` 
                + 'phonebook. Would you like to update their info?')) {
            PhonebookService.update(matchingPerson.id, newPerson)
                .then(returnedPerson => {
                    setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p));
                    addNotification(`Updated ${newPerson.name}`);
                })
                .catch(error => {
                    console.log(error.response.data);
                    if (error.response.status === 404) {
                        addNotification(`Entry on ${matchingPerson.name} had already been deleted from the server.`, true);
                        setPersons(persons.filter(p => p.id !== matchingPerson.id));
                    }
                    else
                        addNotification(error.response.data.error, true);
                });
        }
        
        setNewName('');
        setNewNumber('');
    };

    /* Delete Phonebook Data */
    const deletePerson = person => {
        if (!window.confirm(`Delete entry on ${person.name}?`))
            return;
        
        PhonebookService.remove(person)
            .then(() => {
                setPersons(persons.filter(p => p.id !== person.id));
                addNotification(`Deleted ${person.name}`);
            })
            .catch(() => {
                // 501 Not Implemented
                addNotification('Error: server responded with 501 Not Implemented (probably).', true);

                // 404: not sent, we currently send 204 No Content (Success) on no deletion
                // addNotification(`Entry on ${person.name} had already been deleted from the server.`, true); // true = warning
                // setPersons(persons.filter(p => p.id !== person.id));
            });
    };

    /* Only Show Entries that match the filter target. */
    const personsToShow = persons.filter((person) => 
        person.name.toLowerCase().includes(filterTarget.toLowerCase())
    );

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification notification={notificationState}/>
            <Filter value={filterTarget} onChange={handleFilterFieldChange}/>

            <h2>Add a new Entry</h2>
            <Form
                name={newName}
                number={newNumber}
                onNameChange={handleNameFieldChange}
                onNumberChange={handleNumberFieldChange}
                onSubmit={handleFormSubmission}
            />

            <h2>Numbers</h2>
            <Entries persons={personsToShow} deletePerson={deletePerson}/>
        </div>
    );
};


export default App;
