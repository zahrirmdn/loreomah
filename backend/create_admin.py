"""
Script untuk membuat akun admin
Jalankan: python create_admin.py
"""
import requests

# Konfigurasi admin
ADMIN_EMAIL = "admin@loreomah.com"
ADMIN_PASSWORD = "admin123"
API_URL = "http://localhost:8000/auth/admin/register"

try:
    response = requests.post(API_URL, json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    
    if response.status_code == 200:
        print("✅ Admin account created successfully!")
        print(f"📧 Email: {ADMIN_EMAIL}")
        print(f"🔑 Password: {ADMIN_PASSWORD}")
        print("\nSekarang bisa login di http://localhost:3002")
    else:
        error_detail = response.json().get("detail", "Unknown error")
        if "already registered" in error_detail.lower():
            print("ℹ️  Admin account already exists!")
            print(f"📧 Email: {ADMIN_EMAIL}")
            print(f"🔑 Password: {ADMIN_PASSWORD}")
        else:
            print(f"❌ Error: {error_detail}")
            
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend!")
    print("Pastikan backend sudah running di http://localhost:8000")
    print("\nJalankan: uvicorn server:app --reload --host 0.0.0.0 --port 8000")
except Exception as e:
    print(f"❌ Error: {e}")
