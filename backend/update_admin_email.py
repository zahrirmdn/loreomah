"""
Script untuk update email admin di database
Jalankan: python update_admin_email.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

OLD_EMAIL = "admin@example.com"
NEW_EMAIL = "admin@loreomah.com"

async def update_admin_email():
    if not mongo_url or not db_name:
        print("❌ MONGO_URL dan DB_NAME harus diset di .env")
        return
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Check if old email exists
        old_admin = await db.users.find_one({"email": OLD_EMAIL})
        if not old_admin:
            print(f"⚠️  Admin dengan email {OLD_EMAIL} tidak ditemukan")
            print(f"ℹ️  Mungkin sudah diganti atau belum ada")
            
            # Check if new email already exists
            new_admin = await db.users.find_one({"email": NEW_EMAIL})
            if new_admin:
                print(f"✅ Admin dengan email {NEW_EMAIL} sudah ada")
                print(f"   Role: {new_admin.get('role')}")
            return
        
        # Check if new email already exists
        existing_new = await db.users.find_one({"email": NEW_EMAIL})
        if existing_new:
            print(f"⚠️  Email {NEW_EMAIL} sudah digunakan oleh user lain")
            print(f"   Tidak bisa update. Hapus user {NEW_EMAIL} terlebih dahulu jika perlu.")
            return
        
        # Update email
        result = await db.users.update_one(
            {"email": OLD_EMAIL},
            {"$set": {"email": NEW_EMAIL}}
        )
        
        if result.modified_count > 0:
            print(f"✅ Email admin berhasil diupdate!")
            print(f"   Dari: {OLD_EMAIL}")
            print(f"   Ke:   {NEW_EMAIL}")
            print(f"\n💡 Login sekarang menggunakan:")
            print(f"   Email: {NEW_EMAIL}")
            print(f"   Password: (tetap sama seperti sebelumnya)")
        else:
            print(f"⚠️  Tidak ada perubahan")
        
        # Also update in reservations if any
        reservations_result = await db.reservations.update_many(
            {"user_email": OLD_EMAIL},
            {"$set": {"user_email": NEW_EMAIL}}
        )
        
        if reservations_result.modified_count > 0:
            print(f"✅ {reservations_result.modified_count} reservasi juga diupdate")
        
    except Exception as e:
        print(f"❌ Error updating admin email: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print(f"🔄 Updating admin email dari {OLD_EMAIL} ke {NEW_EMAIL}...")
    asyncio.run(update_admin_email())
