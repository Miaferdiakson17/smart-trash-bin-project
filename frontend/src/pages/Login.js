import React, { useState } from 'react';
import API from './api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/api/login', {
        email,
        password
      });

      localStorage.setItem("email_aktif", response.data.email);
      localStorage.setItem("nama_aktif", response.data.user);

      alert("Login berhasil! Selamat datang " + response.data.user);

      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login Error:", error);

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

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p>
        Belum punya akun? <a href="/register">Daftar</a>
      </p>
    </div>
  );
}

export default Login;