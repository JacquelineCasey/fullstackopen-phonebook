
import axios from 'axios';


const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
};

const create = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data);
};

const remove = (person) => {
    return axios.delete(`${baseUrl}/${person.id}`).then(response => {}); // No data after delete.
};

const update = (id, updatedPerson) => {
    console.log(id, updatedPerson);
    return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data);
};


const PhonebookService = {getAll, create, remove, update};
export default PhonebookService;
