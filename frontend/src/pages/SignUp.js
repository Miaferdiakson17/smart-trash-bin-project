import React, { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Pendaftaran Berhasil! Silakan Login.");
        window.location.href = "/"; 
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Gagal terhubung ke server backend!");
    }
  };

  return (
    <div style={styles.container}>
      {/* Menggunakan Font Poppins agar serasi dengan Login */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
      </style>

      <div style={styles.loginCard}>
        {/* --- SISI KIRI: INFORMASI --- */}
        <div style={styles.leftSection}>
          <div>
            <h1 style={styles.brandTitle}>SMART BIN</h1>
            <div style={styles.divider}></div>
            <p style={styles.brandSubtitle}>
              PENDAFTARAN ADMIN BARU <br />
              SISTEM MONITORING TEMPAT SAMPAH
            </p>
          </div>
          
          <div style={styles.illustration}>
            {/* Menggunakan ilustrasi yang sama agar konsisten */}
            <img 
              src="https://img.mbizmarket.co.id/products/thumbs/500x500/2022/10/27/6cf1cdfe8436573f885588a15073dabd.jpg" 
              alt="illustration" 
              style={styles.image} 
            />
          </div>

          <div style={styles.footerText}>
            <p>Pastikan data yang dimasukkan benar.</p>
            <p>Akses ini khusus untuk pengelola sistem.</p>
            <p style={{fontWeight: '700', color: '#008f68'}}>Smart Bin Project 2026</p>
          </div>
        </div>

        {/* --- SISI KANAN: FORM SIGN UP --- */}
        <div style={styles.rightSection}>
          <div style={{width: '100%'}}>
            <h2 style={styles.loginHeader}>Buat Akun</h2>
            <p style={{fontSize: '13px', color: '#888', marginBottom: '25px', marginTop: '-20px'}}>Lengkapi formulir untuk mendaftar</p>
            
            <form onSubmit={handleSignUp} style={styles.form}>
              <div style={styles.inputWrapper}>
                <span style={styles.icon}>👤</span>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  style={styles.input}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>📧</span>
                <input
                  type="email"
                  placeholder="Alamat Email"
                  style={styles.input}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>🔑</span>
                <input
                  type="password"
                  placeholder="Kata sandi baru"
                  style={styles.input}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={styles.button}
                onMouseOver={(e) => e.target.style.backgroundColor = '#008f68'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#00a37c'}
              >
                Daftar Sekarang
              </button>
            </form>
            
            <div style={styles.signupBox}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Sudah memiliki akun?</p>
                <a href="/" style={styles.signupLink}>Kembali ke Login</a>
            </div>
          </div>
          
          <p style={styles.versionTag}>© 2026 MIA FERDI AKSON</p>
        </div>
      </div>
    </div>
  );
}

// 🎨 Styling serasi dengan halaman Login
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f0f7f4 0%, #d1e8e0 100%)',
    fontFamily: "'Poppins', sans-serif",
  },
  loginCard: {
    display: 'flex',
    width: '950px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,143,104,0.15)',
    minHeight: '550px',
  },
  leftSection: {
    flex: 1.1,
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #f0f0f0',
  },
  brandTitle: {
    color: '#008f68',
    fontSize: '36px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '1px',
  },
  divider: {
    width: '50px',
    height: '4px',
    backgroundColor: '#00a37c',
    margin: '15px 0',
    borderRadius: '2px',
  },
  brandSubtitle: {
    color: '#444',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.6',
  },
  illustration: {
    textAlign: 'center',
    padding: '20px',
  },
  image: {
    width: '85%',
    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
  },
  footerText: {
    fontSize: '12px',
    color: '#aaa',
    lineHeight: '1.6',
    letterSpacing: '0.5px',
  },
  rightSection: {
    flex: 0.9,
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fcfdfd',
  },
  loginHeader: {
    color: '#1a1a1a',
    fontSize: '28px',
    marginBottom: '25px',
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid #eee',
    borderRadius: '12px',
    marginBottom: '20px',
    backgroundColor: '#fff',
  },
  icon: {
    padding: '12px 15px',
    fontSize: '18px',
  },
  input: {
    flex: 1,
    padding: '15px 10px',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
  },
  button: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#00a37c',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 5px 15px rgba(0,163,124,0.3)',
    marginTop: '10px',
  },
  signupBox: {
    marginTop: '30px',
    textAlign: 'center',
  },
  signupLink: {
    color: '#00a37c',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  versionTag: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#ccc',
    letterSpacing: '1px',
  }
};

export default SignUp;