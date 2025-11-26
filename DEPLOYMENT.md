# 🚀 Panduan Deploy Loreomah ke Hostinger

## 📋 Prerequisites

1. **Hostinger VPS** dengan SSH access
2. **Domain** sudah pointing ke IP server Hostinger
3. **MongoDB Atlas** account (gratis) - untuk database cloud
4. **GitHub** repository sudah ada

---

## 🔐 Setup SSH & Git di Hostinger

### 1. Login ke VPS via SSH
```bash
ssh root@your-server-ip
# atau
ssh username@your-server-ip
```

### 2. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y git python3 python3-pip python3-venv nodejs npm nginx

# Install PM2 globally
npm install -g pm2

# Install MongoDB client tools (optional)
apt install -y mongodb-clients
```

### 3. Setup MongoDB Atlas

1. Buka https://www.mongodb.com/cloud/atlas
2. Buat account gratis
3. Create cluster baru (pilih region terdekat)
4. Database Access → Add user (username & password)
5. Network Access → Add IP (0.0.0.0/0 untuk allow all)
6. Connect → Copy connection string

---

## 📦 Deploy Application

### 1. Clone Repository
```bash
cd /home/username  # atau direktori pilihan Anda
git clone https://github.com/zahrirmdn/loreomah.git
cd loreomah
chmod +x deploy.sh
./deploy.sh
```

### 2. Konfigurasi Environment
Edit file `.env` di backend:
```bash
nano backend/.env
```

Isi dengan:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=loreomah
JWT_SECRET=your-random-secret-key-here
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-email-password
```

### 3. Setup Nginx
```bash
# Copy konfigurasi
cp nginx.conf /etc/nginx/sites-available/loreomah

# Edit dan sesuaikan path username
nano /etc/nginx/sites-available/loreomah

# Enable site
ln -s /etc/nginx/sites-available/loreomah /etc/nginx/sites-enabled/

# Test konfigurasi
nginx -t

# Restart Nginx
systemctl restart nginx
```

### 4. Update Frontend Environment
Edit `frontend/.env.production`:
```bash
nano frontend/.env.production
```

Isi:
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

Rebuild frontend:
```bash
cd frontend
npm run build
```

### 5. Start Backend
```bash
cd backend
source venv/bin/activate
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8000" --name loreomah-backend
pm2 save
pm2 startup  # ikuti instruksi yang muncul
```

### 6. Seed Database (Pertama kali)
```bash
# Seed settings
python seed_settings.py

# Create admin account
python create_admin.py
```

---

## 🔐 Setup SSL (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal sudah aktif otomatis
```

---

## 🔄 Auto-Deploy dari GitHub

### Setup GitHub Actions (Otomatis)

1. **Di GitHub Repository**, buka Settings → Secrets and variables → Actions

2. **Tambahkan secrets**:
   - `SSH_HOST`: IP server Hostinger
   - `SSH_USER`: username SSH
   - `SSH_PASSWORD`: password SSH (atau gunakan SSH key)
   - `SSH_PORT`: 22 (default)
   - `DEPLOY_PATH`: /home/username/loreomah

3. **Push ke main branch** akan otomatis deploy!

### Manual Update (via SSH)
```bash
cd /home/username/loreomah
git pull origin main
cd frontend && npm run build
pm2 restart loreomah-backend
```

---

## 🛠️ Maintenance Commands

### Cek status aplikasi
```bash
pm2 status
pm2 logs loreomah-backend
```

### Restart backend
```bash
pm2 restart loreomah-backend
```

### Update aplikasi
```bash
cd /home/username/loreomah
git pull
./deploy.sh
```

### Backup database
```bash
mongodump --uri="your-mongodb-uri" --out=/backup/loreomah-$(date +%Y%m%d)
```

---

## 🔍 Troubleshooting

### Backend tidak jalan
```bash
pm2 logs loreomah-backend --lines 100
```

### Port sudah dipakai
```bash
netstat -tulpn | grep 8000
kill -9 <PID>
pm2 restart loreomah-backend
```

### Nginx error
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Cek firewall
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

---

## 📞 Support

Jika ada masalah:
1. Cek logs: `pm2 logs`
2. Cek Nginx: `tail -f /var/log/nginx/error.log`
3. Cek status: `pm2 status`
4. Restart semua: `pm2 restart all`
