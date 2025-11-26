# 🚀 Panduan Deployment Loreomah ke Hostinger

## Persiapan

### 1. Build Frontend (Sudah Selesai ✅)
```bash
cd frontend
npm run build
```
Folder `frontend/build/` sekarang berisi file production.

## Deployment Steps

### Opsi A: Shared Hosting (hPanel) - Frontend Only

#### 1. Siapkan Backend di Cloud Terpisah
Backend FastAPI perlu hosting yang support Python. Gunakan:
- **Railway.app** (gratis untuk mulai)
- **Render.com** (gratis)
- **PythonAnywhere** (gratis)
- **DigitalOcean/AWS** (berbayar)

#### 2. Setup MongoDB
Gunakan **MongoDB Atlas** (gratis):
1. Daftar di https://www.mongodb.com/cloud/atlas
2. Buat cluster gratis (M0)
3. Setup database user & password
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Copy connection string

#### 3. Deploy Backend ke Railway/Render

**File yang diperlukan di root project:**

**`Procfile`** (untuk Railway/Render):
```
web: cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
```

**`runtime.txt`**:
```
python-3.10
```

**`requirements.txt`** (di folder backend):
```
fastapi
uvicorn[standard]
motor
pydantic
python-jose[cryptography]
passlib[bcrypt]
python-multipart
python-dotenv
requests
```

**Environment Variables** di Railway/Render:
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=loreomah
JWT_SECRET=your-super-secret-key-change-this
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@loreomah.com
SMTP_PASSWORD=your-email-password
```

#### 4. Update Frontend untuk Production

Edit `frontend/.env.production`:
```env
REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
```

Rebuild frontend:
```bash
cd frontend
npm run build
```

#### 5. Upload ke Hostinger

Via **File Manager** atau **FTP**:
1. Login ke hPanel Hostinger
2. Buka **File Manager**
3. Navigate ke `public_html/`
4. **Hapus semua file** di `public_html/`
5. **Upload semua file** dari folder `frontend/build/`:
   - `index.html`
   - `static/` folder
   - `favicon.png`
   - dll

6. Buat file `.htaccess` di `public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access 1 year"
  ExpiresByType image/jpeg "access 1 year"
  ExpiresByType image/gif "access 1 year"
  ExpiresByType image/png "access 1 year"
  ExpiresByType image/svg+xml "access 1 year"
  ExpiresByType text/css "access 1 month"
  ExpiresByType application/javascript "access 1 month"
  ExpiresByType application/x-javascript "access 1 month"
  ExpiresByType text/javascript "access 1 month"
</IfModule>
```

### Opsi B: VPS Hosting (Full Stack)

#### 1. Connect via SSH
```bash
ssh your-username@your-vps-ip
```

#### 2. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.10
sudo apt install python3.10 python3.10-venv python3-pip -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 3. Upload Project
```bash
# Via Git
cd /var/www/
sudo git clone https://github.com/zahrirmdn/loreomah.git
cd loreomah

# Atau upload via SFTP/SCP
```

#### 4. Setup Backend
```bash
cd /var/www/loreomah/backend

# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
nano .env
```

Isi `.env`:
```env
MONGO_URL=mongodb+srv://...
DB_NAME=loreomah
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@loreomah.com
SMTP_PASSWORD=your-password
```

```bash
# Seed initial data
python seed_settings.py

# Start with PM2
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8000" --name loreomah-backend
pm2 save
pm2 startup
```

#### 5. Setup Frontend
```bash
cd /var/www/loreomah/frontend

# Install dependencies
npm install

# Create production env
echo "REACT_APP_BACKEND_URL=https://loreomah.com/api" > .env.production

# Build
npm run build
```

#### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/loreomah
```

```nginx
server {
    listen 80;
    server_name loreomah.com www.loreomah.com;

    # Frontend (React build)
    location / {
        root /var/www/loreomah/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Browser caching
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend uploads
    location /uploads/ {
        alias /var/www/loreomah/backend/backend/uploads/;
        expires 1y;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/loreomah /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 7. Setup SSL (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d loreomah.com -d www.loreomah.com
```

## Checklist Deployment

- [ ] MongoDB Atlas sudah dibuat & connection string ready
- [ ] Backend deployed (Railway/Render/VPS)
- [ ] Environment variables sudah diset
- [ ] Seed data dijalankan (settings, admin user)
- [ ] Frontend di-build dengan `REACT_APP_BACKEND_URL` yang benar
- [ ] Upload frontend ke `public_html/` atau configure Nginx
- [ ] `.htaccess` atau Nginx config sudah benar
- [ ] Test login admin di production
- [ ] Test upload gambar (slider, gallery, menu)
- [ ] Test reservasi & email confirmation
- [ ] SSL certificate installed (HTTPS)

## Troubleshooting

### CORS Error
Update `backend/server.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://loreomah.com", "https://www.loreomah.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 404 on Page Refresh
Pastikan `.htaccess` (shared hosting) atau Nginx `try_files` sudah benar.

### Images Not Loading
Check path:
- Backend: `http://localhost:8000/uploads/...` → `https://loreomah.com/uploads/...`
- Update `API_BASE` di frontend jika perlu

### Email Not Sending
Gunakan SMTP Hostinger:
- Host: `smtp.hostinger.com`
- Port: `587`
- User: email Anda (e.g., `noreply@loreomah.com`)
- Buat email di Hostinger Email Manager

## Monitoring

```bash
# Check backend logs
pm2 logs loreomah-backend

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart loreomah-backend
sudo systemctl restart nginx
```

## Update Production

```bash
# Pull latest code
cd /var/www/loreomah
git pull

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart loreomah-backend

# Update frontend
cd ../frontend
npm install
npm run build
```

---

**Support:**
- Hostinger Docs: https://support.hostinger.com
- Railway: https://railway.app
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
