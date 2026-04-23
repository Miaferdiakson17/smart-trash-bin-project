import axios from 'axios';

const API = axios.create({
  // Pastikan pakai link .onrender.com kamu, BUKAN localhost
  baseURL: 'https://smart-trash-bin-project.onrender.com', 
});

export default API;