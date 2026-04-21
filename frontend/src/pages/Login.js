import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("email_aktif", email);
        localStorage.setItem("nama_aktif", result.user);
        alert("Login Berhasil! Selamat Datang " + result.user);
        window.location.href = "/dashboard";
      } else {
        alert(result.message || "Email atau Password Salah");
      }
    } catch (error) {
      console.error("Error Login:", error);
      alert("Gagal terhubung ke Backend. Pastikan Flask sudah jalan!");
    }
  };

  return (
    <div style={styles.container}>
      {/* Link Google Fonts untuk memanggil Font Poppins */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
      </style>

      <div style={styles.loginCard}>
        {/* --- SISI KIRI: INFORMASI --- */}
        <div style={styles.leftSection}>
          <div>
            <h1 style={styles.brandTitle}>SMART TRASH BIN</h1>
            <div style={styles.divider}></div>
            <p style={styles.brandSubtitle}>
              SISTEM MONITORING DAN PENGELOLAAN <br />
              TEMPAT SAMPAH PINTAR BERBASIS IOT
            </p>
          </div>
          
          <div style={styles.illustration}>
            <img 
              src="https://img.mbizmarket.co.id/products/thumbs/500x500/2022/10/27/6cf1cdfe8436573f885588a15073dabd.jpg" 
              alt="illustration" 
              style={styles.image} 
            />
          </div>

          <div style={styles.footerText}>
            <p>Program Studi Informatika</p>
            <p>Fakultas Ilmu Komputer</p>
            <p style={{fontWeight: '700', color: '#008f68'}}>Mia Ferdi Akson</p>
          </div>
        </div>

        {/* --- SISI KANAN: FORM LOGIN --- */}
        <div style={styles.rightSection}>
          <div style={{width: '100%'}}>
            <h2 style={styles.loginHeader}>Selamat Datang</h2>
            <p style={{fontSize: '13px', color: '#888', marginBottom: '25px', marginTop: '-20px'}}>Silakan masuk ke akun admin Anda</p>
            
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputWrapper}>
                <span style={styles.icon}>📧</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputWrapper}>
                <span style={styles.icon}>🔑</span>
                <input
                  type="password"
                  placeholder="Kata sandi"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={styles.button}
                onMouseOver={(e) => e.target.style.backgroundColor = '#008f68'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#00a37c'}
              >
                Masuk Ke Sistem
              </button>
            </form>
            
            <div style={styles.signupBox}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Belum memiliki akses?</p>
                <a href="/register" style={styles.signupLink}>Buat Akun Admin Baru</a>
            </div>
          </div>
          
          <p style={styles.versionTag}>© 2026 SMART BIN PROJECT</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f0f7f4 0%, #d1e8e0 100%)', // Latar belakang lebih lembut
    fontFamily: "'Poppins', sans-serif", // Font Kekinian
  },
  loginCard: {
    display: 'flex',
    width: '950px',
    backgroundColor: '#ffffff',
    borderRadius: '20px', // Sudut lebih bulat
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
    borderRadius: '12px', // Sudut input modern
    marginBottom: '20px',
    backgroundColor: '#fff',
    transition: '0.3s',
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
    transition: '0.2s',
  },
  versionTag: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#ccc',
    letterSpacing: '1px',
  }
};

export default Login;