import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://smart-trash-bin-project.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Simpan data user ke localStorage
        localStorage.setItem("email_aktif", result.email);
        localStorage.setItem("nama_aktif", result.user);

        alert("Login Berhasil! Selamat datang " + result.user);

        // Redirect ke dashboard
        window.location.href = "/dashboard";
      } else {
        alert(result.message || "Email atau Password salah");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Gagal terhubung ke backend!");
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