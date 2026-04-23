import React, { useState } from 'react';
import apiService from './services/APIService';

/*
=====================================================
CLASS LOGIN PAGE
=====================================================
*/
function Login() {
  // State input email dan password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /*
  =====================================================
  HANDLE LOGIN
  =====================================================
  */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Kirim email dan password ke backend
      const response = await apiService.login(email, password);

      // Simpan data admin ke localStorage
      localStorage.setItem("email_aktif", response.data.email);
      localStorage.setItem("nama_aktif", response.data.user);

      alert("Login berhasil!");

      // Pindah ke dashboard
      window.location.href = "/dashboard";

    } catch (error) {
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
        {/* Input email */}
        <input
          type="email"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        {/* Input password */}
        <input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p>
        Belum punya akun? <a href="/register">Daftar</a>
      </p>
    </div>
  );
}

export default Login;