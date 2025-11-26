"""
Migration script to seed initial site settings into MongoDB
Run once to initialize contact, about, and story data
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

COLLECTION_NAME = "site_settings"

initial_settings = {
    "contact": {
        "instagram": "@cafeloreomah",
        "facebook": "Cafe Loreomah Official",
        "email": "hello@cafeloreomah.com",
        "tiktok": "cafeloreomah",
        "youtube": "Cafe Loreomah",
        "phone": "0821-4243-3998",
        "address": "Jl. Airlangga, Sumbersari, Kesiman, Kec. Trawas, Kabupaten Mojokerto, Jawa Timur 61375",
        "maps": "https://maps.google.com",
        "weekdays": "09.00 - 19.00",
        "weekend": "09.00 - 20.00"
    },
    "about": {
        "title": "Tentang Kami",
        "subtitle": "Cafe Loreomah — Kopi, Alam, dan Kebersamaan di Trawas",
        "mission": "Menghadirkan pengalaman ngopi yang jujur dan berkualitas dengan bahan baku lokal, racikan yang konsisten, serta pelayanan hangat — sehingga setiap tamu merasa seperti di rumah sendiri.",
        "vision": "Menjadi destinasi kopi dan kuliner keluarga di Trawas yang mengutamakan kualitas rasa, kenyamanan suasana, dan kedekatan dengan komunitas.",
        "values": [
            {
                "title": "Kualitas",
                "description": "Biji kopi Nusantara terpilih, resep teruji, rasa konsisten di setiap sajian."
            },
            {
                "title": "Kehangatan",
                "description": "Pelayanan ramah, ruang nyaman, dan atmosfer yang cocok untuk keluarga."
            },
            {
                "title": "Komunitas",
                "description": "Tumbuh bersama warga Trawas — dari petani, UMKM, hingga para penikmat kopi."
            },
            {
                "title": "Inovasi",
                "description": "Eksplorasi menu musiman, kopi manual brew, dan kreasi non-kopi yang seimbang."
            }
        ]
    },
    "story": {
        "title": "CERITA KAMI",
        "paragraphs": [
            "Cafe Loreomah lahir dari kecintaan pada kopi Nusantara dan suasana alam Trawas yang sejuk. Kami percaya, secangkir kopi yang baik bukan hanya soal rasa — tetapi juga tentang momen, suasana, dan kebersamaan.",
            "Kami menggunakan bahan baku lokal, mendukung petani dan pelaku UMKM, serta meracik menu yang seimbang: dari manual brew, kopi susu gula aren, hingga pilihan non-kopi dan makanan keluarga. Setiap sajian diracik dengan standar konsistensi, agar pengalaman Anda selalu menyenangkan kapan pun berkunjung.",
            "Berlokasi di Jl. Airlangga, Trawas, Mojokerto, Loreomah menjadi tempat singgah yang hangat untuk berkumpul, bekerja, atau sekadar menikmati udara pegunungan. Terima kasih telah menjadi bagian dari perjalanan kami — sampai jumpa di Loreomah."
        ],
        "image": "http://localhost:8000/uploads/sliders/VideoCapture_20250813-135915.jpg"
    }
}

async def seed_settings():
    if not mongo_url or not db_name:
        print("❌ MONGO_URL dan DB_NAME harus diset di .env")
        return
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Check if settings already exist
        existing = await db[COLLECTION_NAME].find_one({})
        if existing:
            print("⚠️  Settings already exist in database. Skipping seed.")
            print("💡 To update settings, use the admin panel or delete the collection first.")
            return
        
        # Insert initial settings
        await db[COLLECTION_NAME].insert_one(initial_settings)
        print("✅ Initial site settings seeded successfully!")
        print(f"📍 Collection: {COLLECTION_NAME}")
        print(f"📊 Database: {db_name}")
        
    except Exception as e:
        print(f"❌ Error seeding settings: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print("🌱 Seeding initial site settings...")
    asyncio.run(seed_settings())
