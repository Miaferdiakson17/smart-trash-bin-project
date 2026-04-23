import axios from 'axios';

const API = axios.create({
    baseURL: 'https://smart-trash-bin-project.onrender.com' 
});

export default API;