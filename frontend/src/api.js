import axios from "axios";

// Semua request frontend akan diarahkan ke backend Render
const API = axios.create({
  baseURL: "https://smart-trash-bin-project.onrender.com"
});

export default API;