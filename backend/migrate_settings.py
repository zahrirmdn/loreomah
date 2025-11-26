"""
Migration script to initialize settings data in MongoDB
Run this once to populate initial settings from mockData
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

async def migrate_settings():
    mongo_url = os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME")
    
    if not mongo_url or not db_name:
        print("⚠️ MONGO_URL and DB_NAME must be set in .env")
        return
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if settings already exist
    existing = await db.settings.find_one({"type": "site_settings"})
    
    if existing:
        print("✅ Settings already exist in database. Skipping initialization.")
        print("If you want to reset, delete the document and run this script again.")
        client.close()
        return
    
    # Initial settings data from mockData
    initial_settings = {
        "type": "site_settings",
        "contact": {
            "instagram": "@cafeloreomah",
            "facebook": "Cafe Loreomah Official",
            "email": "hello@cafeloreomah.com",
            "tiktok": "cafeloreomah",
            "youtube": "Cafe Loreomah",
            "phone": "0821-4243-3998",
            "address": "Jl. Airlangga, Sumbersari, Kesiman, Kec. Trawas, Kabupaten Mojokerto, Jawa Timur 61375",
            "maps": "https://maps.google.com",
            "opening_hours": {
                "weekdays": "09.00 - 19.00",
                "weekend": "09.00 - 20.00"
            }
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
    
    # Insert initial settings
    await db.settings.insert_one(initial_settings)
    print("✅ Successfully initialized settings data in MongoDB!")
    print("📝 You can now manage these settings via Admin Dashboard > Settings")
    
    client.close()

if __name__ == "__main__":
    print("🚀 Starting settings migration...")
    asyncio.run(migrate_settings())
    print("✅ Migration complete!")
