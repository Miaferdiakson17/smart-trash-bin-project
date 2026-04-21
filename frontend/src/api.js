import axios from 'axios';

const API = axios.create({
  // GANTI BARIS DI BAWAH INI DENGAN LINK RENDER KAMU
  baseURL: 'https://smart-trash-bin-project.onrender.com', 
});

export default API;