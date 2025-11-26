# 🚀 Tutorial Step-by-Step Deploy Loreomah
## Hostinger Single Hosting + Render.com (Backend Gratis)

---

## 📋 Checklist Persiapan

- [ ] Akun GitHub (untuk connect Render.com)
- [ ] Akun email baru untuk MongoDB & Render
- [ ] Backup WordPress (jika ada data penting)
- [ ] Notepad untuk catat username/password

---

## STEP 1: Setup MongoDB Atlas (Database Cloud Gratis)

### 1.1 Buat Akun MongoDB

1. **Buka browser** → https://www.mongodb.com/cloud/atlas
2. Klik **"Try Free"** atau **"Sign Up"**
3. Isi form:
   - **Email**: (gunakan email Anda)
   - **Password**: (buat password kuat, SIMPAN!)
   - Centang "I agree to the Terms of Service"
4. Klik **"Create your Atlas account"**
5. **Verifikasi email** → Buka inbox → Klik link verifikasi
6. Setelah login, akan muncul welcome screen

### 1.2 Buat Cluster Database

1. **Tampilan awal**: "Deploy a cloud database"
2. Pilih **M0** (FREE):
   - Provider: **AWS**
   - Region: **Singapore** (ap-southeast-1) ← pilih terdekat
   - Cluster Name: `Cluster0` (biarkan default)
3. Klik **"Create Deployment"**
4. Popup muncul "Security Quickstart":
   
   **Username & Password:**
   - Username: `loreomah`
   - Password: Klik **"Autogenerate Secure Password"**
   - **COPY PASSWORD INI** → Simpan di notepad!
   
   Klik **"Create Database User"**

5. **IP Access List:**
   
   **Jika muncul form langsung:**
   - IP Address: ketik `0.0.0.0/0`
   - Description: ketik `Allow all`
   - Klik **"Add Entry"**
   
   **Jika tidak muncul form / sudah di dashboard:**
   - Di sidebar kiri, klik **"Network Access"** (ikon gembok)
   - Klik tombol **"+ ADD IP ADDRESS"** (hijau, pojok kanan)
   - Pilih **"ALLOW ACCESS FROM ANYWHERE"**
   - Atau manual ketik: IP `0.0.0.0/0`, Description `Allow all`
   - Klik **"Confirm"**

6. Klik **"Finish and Close"** (jika ada popup)

### 1.3 Dapatkan Connection String

1. Di dashboard MongoDB Atlas, klik **"Connect"** (tombol di samping cluster Anda)
2. Pilih **"Drivers"**
3. Driver: **Python**, Version: **3.12 or later**
4. **Copy connection string** yang muncul, contoh:
   ```
   mongodb+srv://loreomah:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

5. **EDIT connection string:**
   - Ganti `<password>` dengan password yang tadi di-copy
   - Tambahkan nama database sebelum `?`, jadi:
   ```
   mongodb+srv://loreomah:PASSWORD123@cluster0.xxxxx.mongodb.net/loreomah?retryWrites=true&w=majority&appName=Cluster0
   ```

6. **SIMPAN di notepad** dengan label:
   ```
   MONGO_URL=mongodb+srv://loreomah:PASSWORD123@cluster0.xxxxx.mongodb.net/loreomah?retryWrites=true&w=majority&appName=Cluster0
   ```

✅ **MongoDB Atlas selesai!**

---

## STEP 2: Push Code ke GitHub (Jika Belum)

### 2.1 Cek Status Git

```powershell
cd C:\Users\zahri\Documents\GitHub\loreomah
git status
```

### 2.2 Commit & Push

```powershell
# Add semua perubahan
git add .

# Commit
git commit -m "Prepare for production deployment"

# Push ke GitHub
git push origin main
```

Jika muncul error authentication, login GitHub lewat browser dan generate **Personal Access Token**.

✅ **Code di GitHub ready!**

---

## STEP 3: Setup Backend di Render.com

### 3.1 Buat Akun Render

1. **Buka browser** → https://render.com
2. Klik **"Get Started"**
3. **Sign Up with GitHub**:
   - Klik tombol **GitHub**
   - Authorize Render.com
   - Login GitHub jika diminta

### 3.2 Buat Web Service

1. Dashboard Render → Klik **"New +"** (pojok kanan atas)
2. Pilih **"Web Service"**
3. **Connect a repository**:
   - Cari repository: `loreomah`
   - Klik **"Connect"** di samping repo zahrirmdn/loreomah

### 3.3 Configure Web Service

Isi form berikut:

**Basic Info:**
- **Name**: `loreomah-backend` (bisa custom)
- **Region**: `Singapore` (pilih terdekat)
- **Branch**: `main`
- **Root Directory**: `backend` ← **PENTING!**

**Build & Deploy:**
- **Runtime**: `Python 3` (auto-detect)
- **Build Command**: 
  ```
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```
  uvicorn server:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Pilih **"Free"** ($0/month)

### 3.4 Environment Variables

Scroll ke bawah → bagian **"Environment Variables"**

Klik **"Add Environment Variable"**, tambahkan satu per satu:

| Key | Value |
|-----|-------|
| `MONGO_URL` | (paste connection string MongoDB dari Step 1.3) |
| `DB_NAME` | `loreomah` |
| `JWT_SECRET` | `loreomah-super-secret-key-2025` |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `noreply@yourdomain.com` ← (ganti dengan domain Anda) |
| `SMTP_PASSWORD` | (password email dari Hostinger) |

**Cara isi:**
- Klik **"Add Environment Variable"**
- Ketik `MONGO_URL` di kolom Key
- Paste connection string di kolom Value
- Klik **"Add Environment Variable"** lagi untuk yang berikutnya

### 3.5 Deploy

1. Scroll paling bawah
2. Klik **"Create Web Service"**
3. **Tunggu deploy** (5-10 menit):
   - Lihat logs di layar
   - Tunggu sampai muncul "Your service is live 🎉"

### 3.6 Copy Backend URL

Setelah deploy berhasil:
1. Di atas logs, ada URL service Anda, contoh:
   ```
   https://loreomah-backend.onrender.com
   ```
2. **COPY URL ini** → Simpan di notepad dengan label:
   ```
   BACKEND_URL=https://loreomah-backend.onrender.com
   ```

### 3.7 Test Backend

Buka di browser:
```
https://loreomah-backend.onrender.com/docs
```

Harusnya muncul **Swagger API Documentation** (halaman interaktif API).

✅ **Backend Render.com selesai!**

---

## STEP 4: Seed Data ke Database

### 4.1 Update Environment Lokal

Buka file `backend/.env` di VS Code, edit jadi:

```env
MONGO_URL=mongodb+srv://loreomah:PASSWORD123@cluster0.xxxxx.mongodb.net/loreomah?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=loreomah
JWT_SECRET=loreomah-super-secret-key-2025
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-email-password
```

*Ganti `PASSWORD123` dan detail SMTP dengan yang sebenarnya.*

### 4.2 Jalankan Seed Scripts

```powershell
cd C:\Users\zahri\Documents\GitHub\loreomah\backend

# Seed site settings (contact, about, story)
python seed_settings.py

# Create admin user
python create_admin.py
```

**Output yang diharapkan:**
```
✅ Initial site settings seeded successfully!
✅ Admin account created successfully!
📧 Email: admin@loreomah.com
🔑 Password: admin123
```

✅ **Database sudah ada data!**

---

## STEP 5: Build Frontend untuk Production

### 5.1 Update Backend URL

Edit file `frontend/.env.production`:

```env
REACT_APP_BACKEND_URL=https://loreomah-backend.onrender.com
```

*Ganti dengan URL Render Anda dari Step 3.6*

### 5.2 Build Production

```powershell
cd C:\Users\zahri\Documents\GitHub\loreomah\frontend

# Install dependencies (jika belum)
npm install

# Build production
npm run build
```

**Output:**
```
Compiled successfully.
File sizes after gzip:
  184.27 kB  build\static\js\main.18c726cf.js
  ...
The build folder is ready to be deployed.
```

✅ **Frontend build selesai!**

Folder `frontend/build/` sekarang berisi file siap upload.

---

## STEP 6: Backup WordPress di Hostinger

### 6.1 Backup via hPanel

1. **Login hPanel Hostinger**: https://hpanel.hostinger.com
2. Pilih **website/domain Anda**
3. Menu **"Files"** → **"Backups"**
4. Klik **"Generate Backup"**
5. Tunggu selesai → **Download backup**
6. Simpan file backup di komputer

### 6.2 Backup Manual (Alternatif)

1. hPanel → **"File Manager"**
2. Buka folder `public_html/`
3. **Select All** (centang semua)
4. Klik **"Compress"** → ZIP
5. **Download** file ZIP
6. Simpan di komputer

✅ **WordPress sudah di-backup!**

---

## STEP 7: Upload Frontend ke Hostinger

### 7.1 Bersihkan public_html

1. **hPanel** → **File Manager**
2. Navigate ke folder `public_html/`
3. **Select All** (centang semua file/folder WordPress)
4. Klik **"Delete"**
5. Confirm delete
6. Pastikan `public_html/` kosong

### 7.2 Upload Build Files

**Cara 1: Via File Manager (Recommended)**

1. Masih di `public_html/`
2. Klik **"Upload Files"** (pojok kanan atas)
3. Buka folder di komputer:
   ```
   C:\Users\zahri\Documents\GitHub\loreomah\frontend\build
   ```
4. **Select All** isi folder `build/`:
   - `index.html`
   - folder `static/`
   - `favicon.png`
   - dll
5. **Drag & Drop** semua ke upload area File Manager
6. Tunggu upload selesai (progress bar hijau)

**Jangan lupa upload `.htaccess`:**
1. Di komputer, buka:
   ```
   C:\Users\zahri\Documents\GitHub\loreomah\frontend\.htaccess
   ```
2. Upload file ini juga ke `public_html/.htaccess`

**Cara 2: Via FTP (Alternatif)**

1. Download **FileZilla**: https://filezilla-project.org
2. Connect ke FTP Hostinger:
   - Host: `ftp.yourdomain.com`
   - Username: (dari hPanel → FTP Accounts)
   - Password: (dari hPanel → FTP Accounts)
   - Port: `21`
3. Navigate local ke `frontend/build/`
4. Navigate remote ke `public_html/`
5. Drag semua file dari kiri (lokal) ke kanan (server)

### 7.3 Struktur Akhir public_html

Harusnya seperti ini:

```
public_html/
├── .htaccess          ← file Apache config
├── index.html         ← entry point React
├── favicon.png
├── static/
│   ├── css/
│   │   └── main.xxxxx.css
│   ├── js/
│   │   └── main.xxxxx.js
│   └── media/
│       └── (images/fonts)
└── asset-manifest.json
```

✅ **Frontend sudah di-upload!**

---

## STEP 8: Setup Email di Hostinger (untuk SMTP)

### 8.1 Buat Email Account

1. **hPanel** → **Emails** → **Email Accounts**
2. Klik **"Create Email Account"**
3. Email: `noreply@yourdomain.com`
4. Password: (buat password kuat, SIMPAN!)
5. Mailbox size: `1 GB` (cukup)
6. Klik **"Create"**

### 8.2 Update Backend Environment

Karena backend sudah di Render, update environment variables:

1. Buka **Render.com** → Dashboard
2. Pilih service **loreomah-backend**
3. Tab **"Environment"**
4. Edit variable:
   - `SMTP_USER`: `noreply@yourdomain.com`
   - `SMTP_PASSWORD`: (password email yang baru dibuat)
5. Klik **"Save Changes"**
6. Service akan **auto-redeploy**

✅ **Email SMTP ready!**

---

## STEP 9: Test Website Production

### 9.1 Buka Website

Buka browser → ketik domain Anda:
```
https://yourdomain.com
```

**Yang harusnya muncul:**
- ✅ Landing page Loreomah
- ✅ Hero slider
- ✅ Menu section
- ✅ Gallery
- ✅ Contact section
- ✅ Footer

### 9.2 Test Login Admin

1. Klik **"Login"** di navbar
2. Login dengan:
   - Email: `admin@loreomah.com`
   - Password: `admin123`
3. Harusnya redirect ke **Admin Dashboard**

### 9.3 Test Upload (Admin)

1. Di Admin Dashboard → Tab **"Sliders"**
2. Coba upload gambar baru
3. Klik **"Add Slider"**
4. Isi title, description, upload image
5. Klik **"Submit"**

**Jika berhasil:**
- ✅ Gambar muncul di list slider
- ✅ Kembali ke homepage → gambar muncul di hero slider

### 9.4 Test Reservasi (User)

1. Logout admin → Buat akun user baru
2. Login sebagai user
3. Klik **"Booking"** → Isi form reservasi
4. Submit
5. Cek email → harusnya dapat email OTP
6. Cek admin dashboard → reservasi muncul dengan badge "Baru"

### 9.5 Test Email

1. Homepage → scroll ke **Contact Section**
2. Klik contact form → isi & submit
3. Admin dashboard → Tab **"Messages"**
4. Harusnya pesan muncul

✅ **Semua fitur berjalan!**

---

## STEP 10: Konfigurasi Domain & SSL

### 10.1 Force HTTPS

1. **hPanel** → **Advanced** → **Force HTTPS**
2. Toggle **ON**
3. Klik **"Apply"**

Sekarang semua akses `http://` otomatis redirect ke `https://`

### 10.2 Update Site Settings di Admin

1. Login admin → Tab **"Settings"**
2. Tab **"Kontak"**
3. Update semua link social media dengan URL real:
   - Instagram: `https://instagram.com/cafeloreomah`
   - TikTok: `https://tiktok.com/@cafeloreomah`
   - dll
4. Update alamat, telepon, email
5. **Simpan Perubahan**

---

## 🎉 SELESAI!

Website Loreomah sudah live di Hostinger dengan:
- ✅ Frontend React di Hostinger Single Hosting
- ✅ Backend FastAPI di Render.com (gratis)
- ✅ Database MongoDB Atlas (gratis)
- ✅ Email SMTP via Hostinger
- ✅ SSL/HTTPS aktif

---

## 📊 Monitoring & Maintenance

### Cek Status Backend Render

1. Login **Render.com**
2. Dashboard → service **loreomah-backend**
3. Tab **"Logs"** → Lihat real-time logs
4. Tab **"Metrics"** → Lihat usage

**Catatan Free Tier Render:**
- Backend akan "sleep" setelah 15 menit tidak ada traffic
- Saat ada request pertama, butuh ~30 detik untuk "wake up"
- Jika website ramai, pertimbangkan upgrade ke paid plan ($7/bulan)

### Update Code Production

**Jika ada perubahan code:**

```powershell
# 1. Commit & push ke GitHub
git add .
git commit -m "Update fitur xyz"
git push origin main

# 2. Render auto-deploy dari GitHub (tunggu 5 menit)

# 3. Jika ada perubahan frontend:
cd frontend
npm run build
# Upload ulang isi folder build/ ke Hostinger
```

### Backup Database

**Export dari MongoDB Atlas:**
1. Atlas Dashboard → Cluster
2. **"..."** (three dots) → **"Command Line Tools"**
3. Download **mongodump**
4. Jalankan:
   ```powershell
   mongodump --uri="mongodb+srv://loreomah:PASSWORD@cluster0.xxxxx.mongodb.net/loreomah"
   ```

---

## 🆘 Troubleshooting

### Error: "Failed to fetch"
- **Penyebab**: Backend Render sedang sleep
- **Solusi**: Tunggu 30 detik, refresh browser

### Error: "CORS policy"
- **Penyebab**: CORS tidak allow domain production
- **Solusi**: Edit `backend/server.py`, tambahkan domain:
  ```python
  allow_origins=["https://yourdomain.com", "https://www.yourdomain.com"]
  ```
  Commit & push → Render auto-deploy

### Gambar tidak muncul
- **Penyebab**: Path image salah
- **Solusi**: Pastikan di backend `uploads/` folder sudah ada
- Atau re-upload gambar via admin panel

### Email tidak terkirim
- **Cek**: SMTP credentials di Render environment variables
- **Test**: Kirim test email dari Hostinger webmail
- **Alternatif**: Gunakan Gmail SMTP (perlu App Password)

---

## 💡 Tips Optimasi

1. **Cloudflare** (Gratis):
   - Tambahkan domain ke Cloudflare
   - Aktifkan CDN & caching
   - Website jadi lebih cepat

2. **Image Optimization**:
   - Compress gambar sebelum upload
   - Gunakan WebP format
   - Resize sesuai kebutuhan display

3. **Monitoring**:
   - Setup uptime monitoring (UptimeRobot gratis)
   - Alert jika website down

---

## 📞 Support

Jika ada kendala:
1. Cek logs Render.com
2. Cek MongoDB Atlas connection
3. Cek Hostinger File Manager (path files)
4. Test API endpoint: `https://backend-url.onrender.com/docs`

---

**Selamat! Website Loreomah sudah production-ready! 🚀☕**
