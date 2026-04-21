import React, { useState } from 'react';
import API from './api'; // import koneksi API

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/api/signup', formData);

      alert("Pendaftaran berhasil! Silakan login.");
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

      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Nama lengkap"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Masukkan email"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Masukkan password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <button type="submit">Daftar</button>
      </form>

      <p>
        Sudah punya akun? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default SignUp;