from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from auth import require_admin

router = APIRouter(prefix="/api/settings", tags=["settings"])

COLLECTION_NAME = "site_settings"

class ContactData(BaseModel):
    instagram: str
    facebook: str
    email: str
    tiktok: str
    youtube: str
    phone: str
    address: str
    maps: str
    weekdays: str
    weekend: str

class AboutValue(BaseModel):
    title: str
    description: str

class AboutData(BaseModel):
    title: str
    subtitle: str
    mission: str
    vision: str
    values: List[AboutValue]

class StoryData(BaseModel):
    title: str
    paragraphs: List[str]
    image: str

class SiteSettings(BaseModel):
    contact: ContactData
    about: AboutData
    story: StoryData

@router.get("/")
async def get_settings(request: Request):
    """Get all site settings"""
    db = request.app.state.db
    doc = await db[COLLECTION_NAME].find_one({}, {"_id": 0})
    if not doc:
        # Return default structure if not found
        return {
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
                    {"title": "Kualitas", "description": "Biji kopi Nusantara terpilih, resep teruji, rasa konsisten di setiap sajian."},
                    {"title": "Kehangatan", "description": "Pelayanan ramah, ruang nyaman, dan atmosfer yang cocok untuk keluarga."},
                    {"title": "Komunitas", "description": "Tumbuh bersama warga Trawas — dari petani, UMKM, hingga para penikmat kopi."},
                    {"title": "Inovasi", "description": "Eksplorasi menu musiman, kopi manual brew, dan kreasi non-kopi yang seimbang."}
                ]
            },
            "story": {
                "title": "CERITA KAMI",
                "paragraphs": [
                    "Cafe Loreomah lahir dari kecintaan pada kopi Nusantara dan suasana alam Trawas yang sejuk. Kami percaya, secangkir kopi yang baik bukan hanya soal rasa — tetapi juga tentang momen, suasana, dan kebersamaan.",
                    "Kami menggunakan bahan baku lokal, mendukung petani dan pelaku UMKM, serta meracik menu yang seimbang: dari manual brew, kopi susu gula aren, hingga pilihan non-kopi dan makanan keluarga. Setiap sajian diracik dengan standar konsistensi, agar pengalaman Anda selalu menyenangkan kapan pun berkunjung.",
                    "Berlokasi di Jl. Airlangga, Trawas, Mojokerto, Loreomah menjadi tempat singgah yang hangat untuk berkumpul, bekerja, atau sekadar menikmati udara pegunungan. Terima kasih telah menjadi bagian dari perjalanan kami — sampai jumpa di Loreomah."
                ],
                "image": "http://localhost:8000/uploads/sliders/default-story.jpg"
            }
        }
    return doc

@router.put("/")
async def update_settings(request: Request, payload: SiteSettings, admin: dict = Depends(require_admin)):
    """Update all site settings (admin only)"""
    db = request.app.state.db
    doc = payload.model_dump()
    # Upsert: update if exists, insert if not
    await db[COLLECTION_NAME].update_one(
        {},
        {"$set": doc},
        upsert=True
    )
    updated = await db[COLLECTION_NAME].find_one({}, {"_id": 0})
    return updated

@router.put("/contact")
async def update_contact(request: Request, payload: ContactData, admin: dict = Depends(require_admin)):
    """Update only contact section"""
    db = request.app.state.db
    await db[COLLECTION_NAME].update_one(
        {},
        {"$set": {"contact": payload.model_dump()}},
        upsert=True
    )
    updated = await db[COLLECTION_NAME].find_one({}, {"_id": 0})
    return updated

@router.put("/about")
async def update_about(request: Request, payload: AboutData, admin: dict = Depends(require_admin)):
    """Update only about section"""
    db = request.app.state.db
    await db[COLLECTION_NAME].update_one(
        {},
        {"$set": {"about": payload.model_dump()}},
        upsert=True
    )
    updated = await db[COLLECTION_NAME].find_one({}, {"_id": 0})
    return updated

@router.put("/story")
async def update_story(request: Request, payload: StoryData, admin: dict = Depends(require_admin)):
    """Update only story section"""
    db = request.app.state.db
    await db[COLLECTION_NAME].update_one(
        {},
        {"$set": {"story": payload.model_dump()}},
        upsert=True
    )
    updated = await db[COLLECTION_NAME].find_one({}, {"_id": 0})
    return updated
