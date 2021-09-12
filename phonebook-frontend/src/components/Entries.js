
import React from 'react';
import Entry from './Entry';


const Entries = ({persons, deletePerson}) => 
    <>
        {persons.map((person) => <Entry 
            key={person.id} 
            person={person} 
            deleteCallback={() => deletePerson(person)}
        />)}
    </>;


export default Entries;
