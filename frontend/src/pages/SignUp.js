import React, { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Fungsi signup
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://smart-trash-bin-project.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Pendaftaran berhasil! Silakan login.");
        window.location.href = "/";
      } else {
        alert(result.message || "Pendaftaran gagal");
      }

    } catch (error) {
      console.error("Signup Error:", error);
      alert("Gagal terhubung ke backend!");
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