import axios from "axios";

export const API = axios.create({
  baseURL: "https://smart-trash-bin-project.onrender.com"
});