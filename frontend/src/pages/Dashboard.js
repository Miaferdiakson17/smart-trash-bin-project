import React, { useState, useEffect } from 'react';

/* =====================================================
   KONFIGURASI BACKEND
   Semua request API akan menggunakan URL ini
===================================================== */
const BASE_URL = "https://smart-trash-bin-project.onrender.com";

/* =====================================================
   KOMPONEN KARTU STATISTIK
===================================================== */
const StatCard = ({ icon, value, label, color }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIconBox, color }}>{icon}</div>
    <div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

/* =====================================================
   KOMPONEN BAR KAPASITAS TEMPAT SAMPAH
===================================================== */
const CapacityBar = ({ percentage }) => {
  const isFull = percentage > 85;

  return (
    <>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${percentage}%`,
            backgroundColor: isFull ? '#e74c3c' : '#00a37c'
          }}
        ></div>
      </div>
      <span>{Math.round(percentage)}%</span>
    </>
  );
};

/* =====================================================
   DASHBOARD UTAMA
===================================================== */
function Dashboard() {
  /* -------------------------
     STATE DATA
  ------------------------- */
  const [trashData, setTrashData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [activeAdmin, setActiveAdmin] = useState("");

  /* =====================================================
     AMBIL SEMUA DATA DARI BACKEND
  ===================================================== */
  const fetchData = async () => {
    try {
      const [trashRes, adminRes, statsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/trash`),
        fetch(`${BASE_URL}/api/admins`),
        fetch(`${BASE_URL}/api/trash/daily-stats`)
      ]);

      const trashJson = await trashRes.json();
      const adminJson = await adminRes.json();
      const statsJson = await statsRes.json();

      setTrashData(Array.isArray(trashJson) ? trashJson : []);
      setAdminData(Array.isArray(adminJson) ? adminJson : []);
      setDailyStats(Array.isArray(statsJson) ? statsJson : []);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  /* =====================================================
     HAPUS ADMIN
  ===================================================== */
  const handleDeleteAdmin = async (email) => {
    const confirmDelete = window.confirm(`Hapus admin ${email}?`);

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/api/admins/${email}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert("Admin berhasil dihapus");
        fetchData(); // refresh data
      }

    } catch (error) {
      alert("Gagal menghapus admin");
    }
  };

  /* =====================================================
     LOAD DATA SAAT HALAMAN DIBUKA
  ===================================================== */
  useEffect(() => {
    // ambil nama admin dari localStorage
    setActiveAdmin(localStorage.getItem("nama_aktif") || "Admin");

    // ambil data awal
    fetchData();

    // refresh data setiap 5 detik
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     TAMPILAN DASHBOARD
  ===================================================== */
  return (
    <div style={styles.container}>
      <h1>Dashboard Smart Trash Bin</h1>

      {/* Statistik Ringkas */}
      <div style={styles.statsGrid}>
        <StatCard
          icon="🗑️"
          value={trashData.length}
          label="Total Data Sampah"
          color="#008f68"
        />

        <StatCard
          icon="👥"
          value={adminData.length}
          label="Total Admin"
          color="#f39c12"
        />
      </div>

      {/* Data Tempat Sampah */}
      <h2>Data Tempat Sampah</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID Bin</th>
            <th>Kapasitas</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trashData.map((item, index) => (
            <tr key={index}>
              <td>{item.bin_id}</td>
              <td>
                <CapacityBar percentage={item.percentage} />
              </td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Data Admin */}
      <h2>Daftar Admin</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((admin, index) => (
            <tr key={index}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>
                {admin.name !== activeAdmin ? (
                  <button onClick={() => handleDeleteAdmin(admin.email)}>
                    Hapus
                  </button>
                ) : (
                  "Aktif"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =====================================================
   STYLE SEDERHANA
===================================================== */
const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial'
  },

  statsGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px'
  },

  statCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    gap: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  statIconBox: {
    fontSize: '28px'
  },

  statValue: {
    fontSize: '20px',
    fontWeight: 'bold'
  },

  statLabel: {
    color: '#777'
  },

  progressBar: {
    width: '100px',
    height: '8px',
    backgroundColor: '#ddd',
    borderRadius: '5px',
    marginBottom: '5px'
  },

  progressFill: {
    height: '100%',
    borderRadius: '5px'
  },

  table: {
    width: '100%',
    marginBottom: '30px',
    borderCollapse: 'collapse'
  }
};

export default Dashboard;