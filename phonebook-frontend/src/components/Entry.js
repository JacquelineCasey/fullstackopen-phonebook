
import React from 'react';


const Entry = ({person, deleteCallback}) =>
    <div>
        {person.name}: {person.number} <button onClick={deleteCallback}> 
            delete
        </button>
    </div>;


export default Entry;
