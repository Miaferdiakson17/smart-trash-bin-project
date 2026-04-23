import React, { useState } from 'react';
import apiService from '../services/APIService';

/*
=====================================================
CLASS SIGNUP PAGE
=====================================================
*/
function SignUp() {
  // State form register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  /*
  =====================================================
  HANDLE REGISTER
  =====================================================
  */
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Kirim data ke backend
      await apiService.signup(formData);

      alert("Pendaftaran berhasil!");
      window.location.href = "/";

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
      <h2>Daftar Admin</h2>

      <form onSubmit={handleSignUp}>
        {/* Input nama */}
        <input
          type="text"
          placeholder="Nama Lengkap"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <br /><br />

        {/* Input email */}
        <input
          type="email"
          placeholder="Masukkan Email"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <br /><br />

        {/* Input password */}
        <input
          type="password"
          placeholder="Masukkan Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <br /><br />

        <button type="submit">Daftar</button>
      </form>

      <p>
        Sudah punya akun? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default SignUp;