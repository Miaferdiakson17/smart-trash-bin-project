import React, { useState, useEffect } from 'react';

// --- 1. KOMPONEN UI: STAT CARD ---
const StatCard = ({ icon, value, label, color }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIconBox, color: color }}>{icon}</div>
    <div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

// --- 2. KOMPONEN UI: PROGRESS BAR ---
const CapacityBar = ({ percentage }) => {
  const isFull = percentage > 85;
  return (
    <>
      <div style={styles.progressBar}>
        <div style={{
          ...styles.progressFill,
          width: `${percentage}%`,
          backgroundColor: isFull ? '#e74c3c' : '#00a37c'
        }}></div>
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600' }}>{Math.round(percentage)}%</span>
    </>
  );
};

// --- 3. KOMPONEN UI: MODAL RIWAYAT ---
const HistoryModal = ({ isOpen, onClose, data, binId }) => {
  if (!isOpen) return null;
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0 }}>📜 Riwayat {binId}</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.modalBody}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>WAKTU</th>
                <th style={styles.th}>KAPASITAS</th>
                <th style={styles.th}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {/* Safety Check untuk History Data */}
              {Array.isArray(data) && data.length > 0 ? (
                data.map((h, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{new Date(h.created_at).toLocaleString('id-ID')}</td>
                    <td style={styles.td}>{Math.round(h.percentage)}%</td>
                    <td style={styles.td}>
                      <span style={h.status === 'penuh' ? styles.badgeRed : styles.badgeGreen}>{h.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={styles.td}>Tidak ada riwayat.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- 4. KOMPONEN UTAMA: DASHBOARD ---
function Dashboard() {
  const [trashData, setTrashData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [dailyStats, setDailyStats] = useState([]); 
  const [activeAdmin, setActiveAdmin] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedBin, setSelectedBin] = useState('');

  const fetchData = async () => {
    try {
      const [resTrash, resAdmins, resStats] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/trash'),
        fetch('http://127.0.0.1:5000/api/admins'),
        fetch('http://127.0.0.1:5000/api/trash/daily-stats')
      ]);
      
      const trashJson = await resTrash.json();
      const adminsJson = await resAdmins.json();
      const statsJson = await resStats.json();

      setTrashData(Array.isArray(trashJson) ? trashJson : []);
      setAdminData(Array.isArray(adminsJson) ? adminsJson : []);
      setDailyStats(Array.isArray(statsJson) ? statsJson : []);
    } catch (error) {
      console.error("Koneksi API Gagal:", error);
    }
  };

  const viewHistory = async (binId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/trash/history/${binId}`);
      const result = await res.json();
      setHistoryData(Array.isArray(result) ? result : []);
      setSelectedBin(binId);
      setIsModalOpen(true);
    } catch (error) { alert("Gagal memuat riwayat"); }
  };

  const handleDeleteAdmin = async (email) => {
    if (window.confirm(`Hapus permanen admin: ${email}?`)) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/admins/${email}`, { method: 'DELETE' });
        if (res.ok) { fetchData(); alert("Admin berhasil dihapus!"); }
      } catch (error) { alert("Gagal menghapus data."); }
    }
  };

  useEffect(() => {
    setActiveAdmin(localStorage.getItem("nama_aktif") || "Admin");
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.appContainer}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');`}</style>

      <HistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={historyData} binId={selectedBin} />

      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>S</div>
          <span style={styles.logoText}>SMART TRASH BIN</span>
        </div>

        <nav style={styles.navMenu}>
          <NavItem active={activeMenu === 'dashboard'} label="Dashboard" icon="📊" onClick={() => setActiveMenu('dashboard')} />
          <NavItem active={activeMenu === 'admin'} label="User Admin" icon="👥" onClick={() => setActiveMenu('admin')} />
          
          <div style={styles.sidebarLogSection}>
            <h4 style={styles.sidebarLogTitle}>LOG TERBARU</h4>
            {/* PERBAIKAN: Menggunakan optional chaining ?. */}
            {trashData?.slice(0, 5).map((log, index) => (
              <div key={index} style={styles.miniLogCard} onClick={() => viewHistory(log.bin_id)}>
                <strong>{log.bin_id}</strong> - {Math.round(log.percentage)}%
              </div>
            ))}
          </div>

          <div style={styles.logoutBtn} onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
            <span style={styles.navIcon}>🚪</span> Keluar Sistem
          </div>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <div style={styles.breadcrumb}>Dashboard &gt; {activeMenu === 'dashboard' ? 'Monitoring' : 'Manajemen'}</div>
          <div style={styles.userProfile}>
            <span style={styles.userName}>{activeAdmin}</span>
            <div style={styles.avatar}>👤</div>
          </div>
        </header>

        <div style={styles.contentWrapper}>
          <h2 style={styles.welcomeText}>
            {activeMenu === 'dashboard' ? 'Monitoring Real-time' : 'Daftar Pengelola Admin'}
          </h2>

          {activeMenu === 'dashboard' ? (
            <>
              <div style={styles.statsGrid}>
                <StatCard icon="🗑️" value={trashData.length} label="Total Data Log" color="#008f68" />
                <StatCard icon="👤" value={adminData.length} label="Admin Terdaftar" color="#f39c12" />
              </div>

              <div style={styles.dailyStatsSection}>
                <h3 style={styles.tableTitle}>📅 Ringkasan Log Harian</h3>
                <div style={styles.statsRow}>
                  {/* PERBAIKAN: Menggunakan optional chaining ?. */}
                  {dailyStats?.slice(0, 5).map((stat, i) => (
                    <div key={i} style={styles.dailyCard}>
                      <div style={styles.dailyDate}>{new Date(stat.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                      <div style={styles.dailyCount}>{stat.count} <span style={{fontSize: '12px', fontWeight: '400'}}>Log</span></div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.tableSection}>
                <h3 style={styles.tableTitle}>📊 Tabel Kapasitas Sampah</h3>
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID BIN</th>
                        <th style={styles.th}>KAPASITAS</th>
                        <th style={styles.th}>TIPE</th>
                        <th style={styles.th}>STATUS</th>
                        <th style={styles.th}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* PERBAIKAN: Validasi Array.isArray */}
                      {Array.isArray(trashData) && trashData.length > 0 ? (
                        trashData.map((item, index) => (
                          <tr key={index} style={styles.tr}>
                            <td style={styles.td}><strong>{item.bin_id}</strong></td>
                            <td style={styles.td}><CapacityBar percentage={item.percentage} /></td>
                            <td style={styles.td}>{item.type}</td>
                            <td style={styles.td}>
                              <span style={item.status === 'penuh' ? styles.badgeRed : styles.badgeGreen}>{item.status}</span>
                            </td>
                            <td style={styles.td}>
                              <button onClick={() => viewHistory(item.bin_id)} style={styles.historyBtn}>Cek Riwayat</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5" style={styles.td}>Memuat data sensor...</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div style={styles.tableSection}>
              <h3 style={styles.tableTitle}>👥 Database Admin Sistem</h3>
              <div style={styles.tableCard}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>NAMA</th>
                      <th style={styles.th}>EMAIL</th>
                      <th style={styles.th}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(adminData) && adminData.map((admin, index) => (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}><strong>{admin.name}</strong></td>
                        <td style={styles.td}>{admin.email}</td>
                        <td style={styles.td}>
                          {admin.name !== activeAdmin ? (
                            <button onClick={() => handleDeleteAdmin(admin.email)} style={styles.deleteButton}>Hapus</button>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#bbb' }}>Aktif</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ active, label, icon, onClick }) => (
  <div style={active ? styles.navItemActive : styles.navItem} onClick={onClick}>
    <span style={styles.navIcon}>{icon}</span> {label}
  </div>
);

const styles = {
  appContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#008f68', fontFamily: "'Poppins', sans-serif" },
  sidebar: { width: '280px', backgroundColor: '#008f68', color: '#fff', padding: '30px 0', display: 'flex', flexDirection: 'column' },
  logoArea: { display: 'flex', alignItems: 'center', padding: '0 30px', marginBottom: '40px' },
  logoIcon: { backgroundColor: '#fff', color: '#008f68', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '12px' },
  logoText: { fontSize: '20px', fontWeight: '700' },
  navMenu: { display: 'flex', flexDirection: 'column', flex: 1 },
  navItem: { padding: '16px 30px', cursor: 'pointer', color: '#c1e1d8', display: 'flex', alignItems: 'center', fontSize: '14px' },
  navItemActive: { padding: '16px 30px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.15)', borderLeft: '5px solid #fff', color: '#fff', fontWeight: '600' },
  navIcon: { marginRight: '15px' },
  sidebarLogSection: { padding: '20px 30px' },
  sidebarLogTitle: { fontSize: '11px', opacity: 0.6, marginBottom: '10px', letterSpacing: '1px' },
  miniLogCard: { backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px', marginBottom: '8px', fontSize: '12px', cursor: 'pointer' },
  logoutBtn: { padding: '16px 30px', cursor: 'pointer', color: '#ff7675', marginTop: 'auto' },
  mainContent: { flex: 1, backgroundColor: '#f5fcf9', borderTopLeftRadius: '45px', padding: '40px', overflowY: 'auto' },
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  userProfile: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 18px', borderRadius: '35px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  userName: { marginRight: '12px', fontWeight: '600', fontSize: '14px', color: '#333' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: '26px', fontWeight: '700', marginBottom: '35px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', marginBottom: '40px' },
  statCard: { backgroundColor: '#fff', padding: '28px', borderRadius: '22px', display: 'flex', alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' },
  statIconBox: { fontSize: '30px', marginRight: '20px', width: '60px', height: '60px', backgroundColor: '#f0fbf7', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#008f68' },
  statLabel: { fontSize: '14px', color: '#999' },
  dailyStatsSection: { marginBottom: '40px' },
  statsRow: { display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' },
  dailyCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '18px', minWidth: '150px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: '4px solid #008f68' },
  dailyDate: { fontSize: '13px', color: '#999', marginBottom: '5px', fontWeight: '600' },
  dailyCount: { fontSize: '22px', fontWeight: '700', color: '#333' },
  tableSection: { marginTop: '20px' },
  tableTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '20px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '25px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '16px', color: '#bbb', fontSize: '12px', borderBottom: '1px solid #f8f9fa' },
  td: { padding: '20px 16px', fontSize: '14px', borderBottom: '1px solid #fcfcfc' },
  tr: { transition: '0.2s' },
  progressBar: { width: '100px', height: '8px', backgroundColor: '#f1f1f1', borderRadius: '10px', marginBottom: '4px' },
  progressFill: { height: '100%', borderRadius: '10px', transition: 'width 0.8s ease' },
  badgeGreen: { backgroundColor: '#d1e7dd', color: '#0f5132', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  badgeRed: { backgroundColor: '#f8d7da', color: '#842029', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  historyBtn: { backgroundColor: '#008f68', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px' },
  deleteButton: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', width: '600px', borderRadius: '25px', padding: '30px', maxHeight: '80vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeBtn: { border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer' },
};

export default Dashboard;