# Database Migration - Site Settings

## Overview
Semua data statis (contact, about, story) telah dipindahkan dari hardcoded `mockData.js` ke MongoDB.

## Changes Summary

### Backend
✅ **New Router**: `backend/routers/settings_router.py`
- `GET /api/settings/` - Ambil semua settings
- `PUT /api/settings/contact` - Update kontak info
- `PUT /api/settings/about` - Update tentang kami
- `PUT /api/settings/story` - Update cerita

✅ **Database Collection**: `site_settings`
- Struktur: `{ contact: {...}, about: {...}, story: {...} }`

### Frontend Admin
✅ **New Page**: `frontend/src/pages/admin/SettingsAdmin.jsx`
- 3 tabs: Kontak, Tentang, Cerita
- Edit form dengan validasi
- Auto-save dengan feedback

✅ **Admin Dashboard**: Tab "Settings" ditambahkan (kolom ke-7)

### Frontend Components (Updated)
Semua komponen sekarang fetch dari API:
- `ContactSection.jsx` → `/api/settings/` (contact)
- `Footer.jsx` → `/api/settings/` (contact)
- `ContactPage.jsx` → `/api/settings/` (contact)
- `StorySection.jsx` → `/api/settings/` (story)
- `AboutPage.jsx` → `/api/settings/` (about)
- `HeroSlider.jsx` → menggunakan API instance (tidak lagi hardcoded URL)

### Data Migration
✅ **Seed Script**: `backend/seed_settings.py`
```bash
cd backend
python seed_settings.py
```

Status: ✅ **Seeded successfully** (26 Nov 2025)

## Removed from mockData.js
- ❌ `sliderData` (sudah pakai database sejak awal)
- ❌ `galleryImages` (sudah pakai database sejak awal)
- ❌ `contactData` → Moved to MongoDB
- ❌ `aboutData` → Moved to MongoDB
- ❌ `storyData` → Moved to MongoDB

## Remaining in mockData.js
- ✅ `menuCategories` (fallback untuk MenuDetailPage)
- ✅ `menuItems` (fallback untuk MenuDetailPage)
- ✅ `menuDriveLink` (fallback)

## How to Edit Site Content
1. Login sebagai admin
2. Buka Admin Dashboard → Tab "Settings"
3. Pilih tab yang ingin diedit (Kontak/Tentang/Cerita)
4. Edit form dan klik "Simpan Perubahan"
5. Perubahan langsung terlihat di frontend

## API Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/settings/` | GET | Public | Get all settings |
| `/api/settings/contact` | PUT | Admin | Update contact info |
| `/api/settings/about` | PUT | Admin | Update about data |
| `/api/settings/story` | PUT | Admin | Update story data |

## Notes
- Semua data settings disimpan dalam 1 dokumen di collection `site_settings`
- Frontend memiliki fallback data untuk graceful degradation jika API gagal
- Image story bisa di-update melalui admin settings (harus URL lengkap atau relative path dari backend)
