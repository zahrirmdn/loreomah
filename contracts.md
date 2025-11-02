# Cafe Loreomah - API Contracts & Backend Implementation Plan

## Overview
Dokumen ini menjelaskan kontrak API, data yang di-mock, dan rencana implementasi backend untuk website Cafe Loreomah.

---

## 1. Data yang Saat Ini Di-Mock (mockData.js)

### 1.1 Slider Data
```javascript
sliderData = [
  { id, image, title, description }
]
```
**Location**: `mockData.js`
**Count**: 3 slides
**Will be replaced with**: Database collection `sliders`

### 1.2 Menu Categories & Items
```javascript
menuCategories = [
  { id, name, title, image, description }
]
menuItems = {
  food: [...],
  snacks: [...],
  coffee: [...],
  nonCoffee: [...]
}
```
**Location**: `mockData.js`
**Count**: 4 categories, 16 items total
**Will be replaced with**: Database collection `menu_items` with category field

### 1.3 Story Data
```javascript
storyData = {
  title, paragraphs: [], image
}
```
**Location**: `mockData.js`
**Will be replaced with**: Database collection `content_pages`

### 1.4 Gallery Images
```javascript
galleryImages = [
  { id, image, alt }
]
```
**Location**: `mockData.js`
**Count**: 12 images
**Will be replaced with**: Database collection `gallery`

### 1.5 Contact Data
```javascript
contactData = {
  instagram, facebook, email, tiktok, phone, address, maps
}
```
**Location**: `mockData.js`
**Will be replaced with**: Database collection `settings`

### 1.6 About Data
```javascript
aboutData = {
  title, subtitle, mission, vision, values: []
}
```
**Location**: `mockData.js`
**Will be replaced with**: Database collection `content_pages`

---

## 2. API Contracts

### 2.1 Authentication APIs

#### POST /api/auth/register
**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user"
  }
}
```

#### POST /api/auth/login
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user|admin"
  }
}
```

#### POST /api/auth/google
**Request:**
```json
{
  "token": "google_oauth_token"
}
```
**Response:**
```json
{
  "message": "Google login successful",
  "token": "string",
  "user": { ... }
}
```

---

### 2.2 Content Management APIs (Admin Only)

#### GET /api/sliders
**Response:**
```json
[
  {
    "id": "string",
    "image": "string",
    "title": "string",
    "description": "string",
    "order": "number"
  }
]
```

#### POST /api/sliders
**Request:** (multipart/form-data)
```
image: File
title: string
description: string
```

#### PUT /api/sliders/:id
**Request:** (multipart/form-data)
```
image: File (optional)
title: string
description: string
```

#### DELETE /api/sliders/:id
**Response:**
```json
{
  "message": "Slider deleted successfully"
}
```

---

#### GET /api/menu-items
**Query Params:** `?category=food|snacks|coffee|nonCoffee`
**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "price": "number",
    "category": "string",
    "image": "string",
    "description": "string"
  }
]
```

#### POST /api/menu-items
**Request:** (multipart/form-data)
```
name: string
price: number
category: string
image: File
description: string
```

#### PUT /api/menu-items/:id
#### DELETE /api/menu-items/:id

---

#### GET /api/gallery
**Response:**
```json
[
  {
    "id": "string",
    "image": "string",
    "alt": "string",
    "created_at": "datetime"
  }
]
```

#### POST /api/gallery
**Request:** (multipart/form-data)
```
images: File[]
```

#### DELETE /api/gallery/:id

---

#### GET /api/content/:page_name
**Params:** `page_name = "story" | "about"`
**Response:**
```json
{
  "page_name": "string",
  "content": {
    // Dynamic content based on page
  }
}
```

#### PUT /api/content/:page_name
**Request:**
```json
{
  "content": { ... }
}
```

---

### 2.3 Booking/Reservation APIs

#### POST /api/bookings
**Request:**
```json
{
  "name": "string",
  "phone": "string",
  "guests": "number",
  "date": "date"
}
```
**Response:**
```json
{
  "message": "Booking successful",
  "booking": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "guests": "number",
    "date": "date",
    "status": "pending"
  }
}
```

#### GET /api/bookings (Admin only)
**Response:**
```json
[
  {
    "id": "string",
    "user_id": "string",
    "name": "string",
    "phone": "string",
    "guests": "number",
    "date": "date",
    "status": "pending|confirmed|cancelled",
    "created_at": "datetime"
  }
]
```

#### PUT /api/bookings/:id/status (Admin only)
**Request:**
```json
{
  "status": "confirmed|cancelled"
}
```

---

### 2.4 Settings API (Admin only)

#### GET /api/settings
**Response:**
```json
{
  "instagram": "string",
  "facebook": "string",
  "email": "string",
  "tiktok": "string",
  "phone": "string",
  "address": "string",
  "maps": "string"
}
```

#### PUT /api/settings
**Request:**
```json
{
  "instagram": "string",
  "facebook": "string",
  ...
}
```

---

### 2.5 Contact Form API

#### POST /api/contact
**Request:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```
**Response:**
```json
{
  "message": "Message sent successfully"
}
```

---

## 3. Database Schema

### Collections:

1. **users**
   - id, name, email, password_hash, role (user|admin), created_at

2. **sliders**
   - id, image_url, title, description, order, created_at

3. **menu_items**
   - id, name, price, category, image_url, description, created_at

4. **gallery**
   - id, image_url, alt, created_at

5. **content_pages**
   - id, page_name (story|about), content (JSON), updated_at

6. **settings**
   - id, key, value

7. **bookings**
   - id, user_id, name, phone, guests, date, status, created_at

8. **contact_messages**
   - id, name, email, subject, message, created_at

---

## 4. Frontend-Backend Integration Points

### Files to Update:

1. **mockData.js** → Remove and replace with API calls
2. **Components to update:**
   - `HeroSlider.jsx` → Fetch from `/api/sliders`
   - `MenuSection.jsx` → Fetch from `/api/menu-items`
   - `StorySection.jsx` → Fetch from `/api/content/story`
   - `GallerySection.jsx` → Fetch from `/api/gallery`
   - `ContactSection.jsx` → Fetch from `/api/settings`
   - `AboutPage.jsx` → Fetch from `/api/content/about`
   
3. **Pages to update:**
   - `LoginPage.jsx` → Connect to `/api/auth/login` & `/api/auth/register`
   - `BookingPage.jsx` → Connect to `/api/bookings`
   - `ContactPage.jsx` → Connect to `/api/contact`
   - `AdminDashboard.jsx` → Connect to all admin APIs

---

## 5. Implementation Steps

### Phase 1: Authentication
1. Setup JWT authentication
2. Implement Google OAuth integration
3. Create auth middleware
4. Add protected routes

### Phase 2: Content Management
1. Implement file upload (images)
2. Create CRUD APIs for sliders, menu, gallery
3. Implement content pages API

### Phase 3: Booking System
1. Create booking model and APIs
2. Add email notifications (optional)
3. Admin booking management

### Phase 4: Settings & Contact
1. Settings API for contact info
2. Contact form with email integration

### Phase 5: Frontend Integration
1. Create API service layer (axios)
2. Replace mock data with API calls
3. Add loading states
4. Error handling
5. Add authentication context

---

## 6. Environment Variables Needed

```
# Backend
MONGO_URL=<existing>
DB_NAME=cafe_loreomah
JWT_SECRET=<to_be_generated>
GOOGLE_CLIENT_ID=<from_google_console>
GOOGLE_CLIENT_SECRET=<from_google_console>

# Optional (for email)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## Notes:
- Semua endpoint dengan prefix `/api` sesuai dengan Kubernetes ingress rules
- Admin routes dilindungi dengan JWT middleware dan role check
- File uploads akan disimpan di `/app/backend/uploads` dan served as static files
- Google OAuth akan menggunakan existing Emergent integration untuk simplicity
