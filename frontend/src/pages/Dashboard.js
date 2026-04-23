import React, { useEffect, useState } from 'react';
import apiService from '../services/APIService';

/*
=====================================================
CLASS DASHBOARD PAGE
=====================================================
*/
function Dashboard() {
  // State data
  const [trashData, setTrashData] = useState([]);
  const [adminData, setAdminData] = useState([]);

  /*
  =====================================================
  AMBIL DATA DARI BACKEND
  =====================================================
  */
  const fetchData = async () => {
    try {
      const trashResponse = await apiService.getTrashData();
      const adminResponse = await apiService.getAdmins();

      setTrashData(trashResponse.data);
      setAdminData(adminResponse.data);

    } catch (error) {
      console.log("Gagal mengambil data", error);
    }
  };

  /*
  =====================================================
  LOAD DATA SAAT HALAMAN DIBUKA
  =====================================================
  */
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard Smart Trash Bin</h1>

      <h2>Data Sampah</h2>
      <ul>
        {trashData.map((item, index) => (
          <li key={index}>
            {item.bin_id} - {item.percentage}% - {item.status}
          </li>
        ))}
      </ul>

      <h2>Data Admin</h2>
      <ul>
        {adminData.map((admin, index) => (
          <li key={index}>
            {admin.name} - {admin.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;