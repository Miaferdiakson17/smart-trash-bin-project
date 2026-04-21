from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

# --- CLASS UTAMA UNTUK MENGELOLA API SMART BIN ---
class SmartBinAPI:
    def __init__(self):
        """
        Konstruktor: Inisialisasi awal saat server dijalankan
        """
        # 1. Inisialisasi Flask App
        self.app = Flask(__name__)
        
        # 2. Mengaktifkan CORS agar React (Frontend) bisa mengakses API ini
        CORS(self.app)

        # 3. Konfigurasi Database Supabase
        self.url = "https://hjxdtogcfmutvjcxgkja.supabase.co"
        self.key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeGR0b2djZm11dHZqY3hna2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTkyMjMsImV4cCI6MjA5MDg5NTIyM30.VXaQArfBgNPiMu2S3E9YuGC6y3PdgIupaCiKU0EEbJY"
        
        # 4. Membuat koneksi (client) ke Supabase
        try:
            self.supabase: Client = create_client(self.url, self.key)
            print("Koneksi Supabase Berhasil!")
        except Exception as e:
            print(f"Gagal koneksi ke Supabase: {e}")

        # 5. Daftarkan semua endpoint (rute) API
        self.setup_routes()

    # --- FUNGSI LOGIKA (HELPER METHODS) ---
    
    def calculate_percentage(self, distance):
        """Menghitung persentase isi sampah berdasarkan jarak sensor (HC-SR04)"""
        max_height = 30  # Asumsi tinggi tong sampah adalah 30 cm
        try:
            dist = float(distance)
            # Rumus: (1 - (jarak_sekarang / tinggi_maksimal)) * 100
            percent = (1 - (dist / max_height)) * 100
            # Batasi agar hasil selalu di antara 0% sampai 100%
            return max(0, min(100, percent))
        except:
            return 0

    def get_status(self, percent):
        """Menentukan label status berdasarkan persentase isi"""
        if percent < 30: 
            return "kosong"
        elif percent < 80: 
            return "setengah"
        else: 
            return "penuh"

    # --- DEFINISI ENDPOINT (ROUTES) ---

    def setup_routes(self):
        
        # 📝 Route: Pendaftaran Admin Baru (SignUp)
        @self.app.route('/api/signup', methods=['POST'])
        def signup():
            data = request.json
            name, email, password = data.get('name'), data.get('email'), data.get('password')

            if not all([name, email, password]):
                return jsonify({"message": "Data tidak lengkap"}), 400

            try:
                # Cek apakah email sudah ada di tabel 'users'
                check = self.supabase.table("users").select("*").eq("email", email).execute()
                if check.data:
                    return jsonify({"message": "Email sudah terdaftar!"}), 400

                # Jika belum ada, masukkan data admin baru
                self.supabase.table("users").insert({"name": name, "email": email, "password": password}).execute()
                return jsonify({"message": "success"}), 201
            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # 🔐 Route: Masuk ke Sistem (Login)
        @self.app.route('/api/login', methods=['POST'])
        def login():
            data = request.json
            email_input, password_input = data.get('email'), data.get('password')

            try:
                # Cari user berdasarkan email
                response = self.supabase.table("users").select("*").eq("email", email_input).execute()
                # Jika user ditemukan dan password cocok
                if response.data and str(response.data[0]['password']) == str(password_input):
                    user = response.data[0]
                    return jsonify({
                        "message": "success", 
                        "user": user['name'], 
                        "email": user['email']
                    }), 200
                return jsonify({"message": "Email atau Password salah"}), 401
            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # 📥 Route: Menerima Data dari ESP32 (Sensor ke Database)
        @self.app.route('/api/trash', methods=['POST'])
        def receive_data():
            data = request.json
            dist = data.get('distance', 30)
            percentage = self.calculate_percentage(dist)
            
            # Siapkan objek data untuk dikirim ke tabel 'trash_data'
            new_entry = {
                "bin_id": data.get('bin_id', 'BIN-01'),
                "type": data.get('type', 'Umum'),
                "percentage": percentage,
                "status": self.get_status(percentage),
                "admin_email": data.get('admin_email')
            }
            try:
                self.supabase.table("trash_data").insert(new_entry).execute()
                return jsonify({"status": "success", "percentage": percentage}), 201
            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # 📤 Route: Mengambil Data Monitoring untuk Tampilan Tabel Dashboard
        @self.app.route('/api/trash', methods=['GET'])
        def get_data():
            try:
                # Ambil 50 data terbaru berdasarkan waktu dibuat
                response = self.supabase.table("trash_data").select("*").order("created_at", desc=True).limit(50).execute()
                return jsonify(response.data)
            except Exception as e:
                return jsonify({"message": str(e)}), 500
        # 📅 Route: Mengambil Statistik Log Harian
        @self.app.route('/api/trash/daily-stats', methods=['GET'])
        def get_daily_stats():
            try:
                # Mengambil data log (bin_id dan created_at)
                response = self.supabase.table("trash_data").select("created_at").execute()
                data = response.data
                
                # Menghitung jumlah log per tanggal
                stats = {}
                for entry in data:
                    # Ambil bagian tanggal saja (YYYY-MM-DD)
                    date_str = entry['created_at'].split('T')[0]
                    stats[date_str] = stats.get(date_str, 0) + 1
                
                # Ubah format ke list agar mudah dibaca React [{date: '...', count: ...}]
                formatted_stats = [{"date": k, "count": v} for k, v in sorted(stats.items(), reverse=True)]
                
                return jsonify(formatted_stats)
            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # 👥 Route: Mengambil Semua Daftar Admin (Daftar Pengelola)
        @self.app.route('/api/admins', methods=['GET'])
        def get_admins():
            try:
                # Ambil kolom nama dan email saja
                response = self.supabase.table("users").select("name, email").execute()
                return jsonify(response.data)
            except Exception as e:
                return jsonify({"message": str(e)}), 500
            # 📜 Route: Mengambil Riwayat Spesifik per ID BIN
        @self.app.route('/api/trash/history/<bin_id>', methods=['GET'])
        def get_bin_history(bin_id):
            try:
                # Mengambil 20 data terakhir khusus untuk ID Bin tertentu
                response = self.supabase.table("trash_data")\
                    .select("*")\
                    .eq("bin_id", bin_id)\
                    .order("created_at", desc=True)\
                    .limit(20)\
                    .execute()
                return jsonify(response.data)
            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # 🗑️ Route Baru: Menghapus Akun Admin secara Langsung dari Web Dashboard
        @self.app.route('/api/admins/<email>', methods=['DELETE'])
        def delete_admin(email):
            """Endpoint ini berfungsi menghapus baris data di tabel 'users' berdasarkan email"""
            try:
                # Jalankan perintah DELETE di Supabase dimana email sama dengan parameter yang dikirim
                response = self.supabase.table("users").delete().eq("email", email).execute()
                
                # Jika penghapusan berhasil (data yang dihapus ditemukan)
                if response.data:
                    return jsonify({"message": "Admin berhasil dihapus dari database"}), 200
                else:
                    return jsonify({"message": "Admin tidak ditemukan"}), 404
            except Exception as e:
                return jsonify({"message": str(e)}), 500

    # --- FUNGSI UNTUK MENJALANKAN SERVER ---
    def run(self):
        # Jalankan Flask di port 5000 dengan mode debug aktif
        self.app.run(debug=True, port=5000)

# --- EKSEKUSI PROGRAM ---
if __name__ == '__main__':
    # Membuat objek dari class SmartBinAPI
    server = SmartBinAPI()
    # Memanggil fungsi run untuk menyalakan API
    server.run()