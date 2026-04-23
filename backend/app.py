# Import library yang dibutuhkan
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import os


# Membuat class utama backend Smart Trash Bin
class SmartBinAPI:
    def __init__(self):

        # Membuat aplikasi Flask
        self.app = Flask(__name__)

        # Mengaktifkan CORS agar frontend (misalnya dari Vercel) bisa akses API ini
        CORS(self.app, resources={r"/api/*": {"origins": "*"}})

        # URL project Supabase
        self.url = "https://hjxdtogcfmutvjcxgkja.supabase.co"

        # API Key Supabase
        self.key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeGR0b2djZm11dHZqY3hna2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTkyMjMsImV4cCI6MjA5MDg5NTIyM30.VXaQArfBgNPiMu2S3E9YuGC6y3PdgIupaCiKU0EEbJY"

        try:
            # Membuat koneksi ke database Supabase
            self.supabase: Client = create_client(self.url, self.key)
            print("Koneksi Supabase Berhasil!")
        except Exception as e:
            print(f"Gagal koneksi ke Supabase: {e}")

        # Menjalankan semua route API
        self.setup_routes()

    # Fungsi untuk menghitung persentase kapasitas sampah
    def calculate_percentage(self, distance):
        max_height = 30  # tinggi maksimal tempat sampah

        try:
            dist = float(distance)

            # Mengubah jarak sensor menjadi persentase isi sampah
            percent = (1 - (dist / max_height)) * 100

            # Membatasi nilai antara 0 sampai 100
            return max(0, min(100, percent))
        except:
            return 0

    # Fungsi untuk menentukan status sampah berdasarkan persentase
    def get_status(self, percent):
        if percent < 30:
            return "kosong"
        elif percent < 80:
            return "setengah"
        else:
            return "penuh"

    # Semua endpoint API didefinisikan di sini
    def setup_routes(self):

        # Route utama untuk cek apakah server berjalan
        @self.app.route('/')
        def home():
            return jsonify({"status": "Server Smart Trash Bin is Running"}), 200

        # API untuk registrasi user/admin
        @self.app.route('/api/signup', methods=['POST'])
        def signup():
            data = request.json

            # Mengambil data dari request frontend
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            try:
                # Cek apakah email sudah ada di database
                check = self.supabase.table("users").select("*").eq("email", email).execute()

                if check.data:
                    return jsonify({"message": "Email sudah terdaftar!"}), 400

                # Simpan user baru ke tabel users
                self.supabase.table("users").insert({
                    "name": name,
                    "email": email,
                    "password": password
                }).execute()

                return jsonify({"message": "success"}), 201

            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # API untuk login user/admin
        @self.app.route('/api/login', methods=['POST'])
        def login():
            data = request.json

            email_input = data.get('email')
            password_input = data.get('password')

            try:
                # Cari user berdasarkan email
                response = self.supabase.table("users").select("*").eq("email", email_input).execute()

                # Cek password
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

        # API menerima data sensor tempat sampah
        @self.app.route('/api/trash', methods=['POST'])
        def receive_data():
            data = request.json

            # Ambil data jarak sensor
            dist = data.get('distance', 30)

            # Hitung persentase kapasitas sampah
            percentage = self.calculate_percentage(dist)

            # Data yang akan disimpan ke database
            new_entry = {
                "bin_id": data.get('bin_id', 'BIN-01'),
                "type": data.get('type', 'Umum'),
                "percentage": percentage,
                "status": self.get_status(percentage),
                "admin_email": data.get('admin_email')
            }

            try:
                # Simpan data sensor ke tabel trash_data
                self.supabase.table("trash_data").insert(new_entry).execute()

                return jsonify({
                    "status": "success",
                    "percentage": percentage
                }), 201

            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # API untuk mengambil data sampah terbaru
        @self.app.route('/api/trash', methods=['GET'])
        def get_data():
            try:
                # Ambil 50 data terbaru dari tabel trash_data
                response = self.supabase.table("trash_data") \
                    .select("*") \
                    .order("created_at", desc=True) \
                    .limit(50) \
                    .execute()

                return jsonify(response.data)

            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # API untuk mengambil daftar admin
        @self.app.route('/api/admins', methods=['GET'])
        def get_admins():
            try:
                response = self.supabase.table("users").select("name, email").execute()
                return jsonify(response.data)

            except Exception as e:
                return jsonify({"message": str(e)}), 500

        # API untuk menghapus admin berdasarkan email
        @self.app.route('/api/admins/<email>', methods=['DELETE'])
        def delete_admin(email):
            try:
                response = self.supabase.table("users").delete().eq("email", email).execute()

                if response.data:
                    return jsonify({"message": "success"}), 200

                return jsonify({"message": "Admin tidak ditemukan"}), 404

            except Exception as e:
                return jsonify({"message": str(e)}), 500

    # Menjalankan Flask server di port yang disediakan Render
    def run(self):
        port = int(os.environ.get("PORT", 5000))
        self.app.run(host='0.0.0.0', port=port)


# Membuat object server
server = SmartBinAPI()

# Membuat variabel app agar bisa dibaca oleh Gunicorn
app = server.app


# Jika dijalankan langsung dari Python
if __name__ == '__main__':
    server.run()