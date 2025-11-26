#!/bin/bash

# Hostinger Auto-Deploy Script
# Jalankan script ini di server Hostinger untuk setup auto-deployment

echo "🚀 Setting up Loreomah deployment..."

# 1. Clone repository (jika belum ada)
if [ ! -d "loreomah" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/zahrirmdn/loreomah.git
    cd loreomah
else
    echo "📂 Repository already exists, updating..."
    cd loreomah
    git pull origin main
fi

# 2. Setup Backend
echo "🐍 Setting up Python backend..."
cd backend

# Install Python dependencies
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
MONGO_URL=mongodb+srv://your-mongodb-atlas-url
DB_NAME=loreomah
JWT_SECRET=$(openssl rand -hex 32)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@loreomah.com
SMTP_PASSWORD=your-email-password
EOF
    echo "⚠️  Please edit backend/.env with your actual credentials!"
fi

# 3. Setup Frontend
echo "⚛️ Setting up React frontend..."
cd ../frontend

# Install Node dependencies
npm install

# Build production files
npm run build

# 4. Setup PM2 for process management
echo "🔧 Setting up PM2..."
npm install -g pm2

# Start backend with PM2
cd ../backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8000" --name loreomah-backend
pm2 save
pm2 startup

echo ""
echo "✅ Setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your MongoDB and SMTP credentials"
echo "2. Configure Nginx/Apache to serve frontend/build/"
echo "3. Setup reverse proxy to backend (port 8000)"
echo ""
echo "🔄 To update later, just run: git pull && ./deploy.sh"
