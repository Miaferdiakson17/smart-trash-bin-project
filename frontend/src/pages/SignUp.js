import React, { useState } from 'react';
import API from './api'; // Import koneksi API

function SignUp() {
  // State untuk menyimpan data form signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Fungsi signup saat tombol ditekan
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      /*
        Mengirim data signup ke backend:
        POST https://smart-trash-bin-project.onrender.com/api/signup
      */
      await API.post('/api/signup', formData);

      alert("Pendaftaran berhasil! Silakan login.");

      // Setelah signup berhasil, kembali ke login
      window.location.href = "/";

    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Gagal terhubung ke backend!");
      }
    }
  };

  return (
    <div>
      <h2>Daftar Admin</h2>

      {/* Form signup */}
      <form onSubmit={handleSignUp}>
        
        {/* Input nama */}
        <input
          type="text"
          placeholder="Nama lengkap"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <br /><br />

        {/* Input email */}
        <input
          type="email"
          placeholder="Masukkan email"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <br /><br />

        {/* Input password */}
        <input
          type="password"
          placeholder="Masukkan password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <br /><br />

        {/* Tombol daftar */}
        <button type="submit">Daftar</button>
      </form>

      <p>
        Sudah punya akun? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default SignUp;