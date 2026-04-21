import axios from "axios";

/*
  File ini berfungsi sebagai pusat koneksi ke backend.
  Jadi semua halaman login, signup, dashboard cukup memanggil API dari sini.
*/

const API = axios.create({
  // URL backend Flask yang sudah di-deploy di Render
  baseURL: "https://smart-trash-bin-project.onrender.com"
});

export default API;