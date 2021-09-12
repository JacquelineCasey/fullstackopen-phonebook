
import React from 'react';
import InputField from './InputField';


const Form = ({name, number, onNameChange, onNumberChange, onSubmit}) => 
    <form>
        <InputField label='name' value={name} onChange={onNameChange}/>
        <InputField label='number' value={number} onChange={onNumberChange}/>
        <div>
            <button type='submit' onClick={onSubmit}>add</button>
        </div>
    </form>;


export default Form;
