
import React from 'react';


const InputField = ({label, value, onChange}) => 
    <div>
        {label}: <input value={value} onChange={onChange}/>
    </div>;


export default InputField;
