import React, { useState } from 'react';
import API from './api'; // Import koneksi API

function Login() {
  // State untuk menyimpan input email dan password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi login saat tombol ditekan
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    try {
      /*
        Mengirim data login ke backend:
        POST https://smart-trash-bin-project.onrender.com/api/login
      */
      const response = await API.post('/api/login', {
        email: email,
        password: password
      });

      /*
        Jika login berhasil, backend akan mengirim:
        {
          user: "...",
          email: "..."
        }
      */

      // Simpan data login ke localStorage
      localStorage.setItem("email_aktif", response.data.email);
      localStorage.setItem("nama_aktif", response.data.user);

      alert("Login berhasil! Selamat datang " + response.data.user);

      // Pindah ke halaman dashboard
      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login Error:", error);

      /*
        Jika backend mengirim error seperti:
        "Email atau Password salah"
      */
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Gagal terhubung ke backend!");
      }
    }
  };

  return (
    <div>
      <h2>Login Admin</h2>

      {/* Form login */}
      <form onSubmit={handleLogin}>
        
        {/* Input email */}
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        {/* Input password */}
        <input
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        {/* Tombol login */}
        <button type="submit">Login</button>
      </form>

      <p>
        Belum punya akun? <a href="/register">Daftar</a>
      </p>
    </div>
  );
}

export default Login;