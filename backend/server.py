# === server.py ===
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from datetime import datetime, timezone
from pathlib import Path
import uuid
import os
import logging
from routers import slider_router 
from fastapi.staticfiles import StaticFiles
from routers import menu_category_router
from routers import gallery_router

# === Load environment variables ===
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# === FastAPI App ===
app = FastAPI(title="LoreOmah Backend", version="1.0")

# === Router prefix /api ===
api_router = APIRouter(prefix="/api")

# === MongoDB Connection ===
mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

if not mongo_url or not db_name:
    raise ValueError("⚠️ MONGO_URL dan DB_NAME harus diset di file .env")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]
app.state.db = db

# === Model ===
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Abaikan _id dari MongoDB
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# === Health Check (Railway needs root endpoint) ===
@app.get("/")
async def health_check():
    return {"status": "ok", "message": "LoreOmah API is running"}

# === Routes ===
@api_router.get("/")
async def root():
    return {"message": "LoreOmah Backend API is running 🚀"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(client_name=input.client_name)
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for d in docs:
        if isinstance(d["timestamp"], str):
            d["timestamp"] = datetime.fromisoformat(d["timestamp"])
    return docs

# === Startup & Shutdown Events ===
@app.on_event("startup")
async def startup_db():
    try:
        # Cek koneksi & buat index unik di users.email
        await db.command("ping")
        await db.users.create_index("email", unique=True)
        logging.info("✅ MongoDB connected & 'users.email' index created.")
    except Exception as e:
        logging.error(f"❌ MongoDB connection failed: {e}")

@app.on_event("shutdown")
async def shutdown_db():
    client.close()
    logging.info("🛑 MongoDB connection closed.")

# === Include Routers ===
app.include_router(api_router)

# === Import & include auth routes (jika ada) ===
try:
    from auth import router as auth_router
    app.include_router(auth_router)  # auth.py sudah punya prefix /auth
    logging.info("🔐 Auth routes loaded successfully.")
except ImportError:
    logging.warning("⚠️ Auth module not found, skipping authentication routes.")

# === Middleware CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Logging ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


# === Include Routers ===
app.include_router(api_router)

try:
    from auth import router as auth_router
    app.include_router(auth_router)
except ImportError:
    logging.warning("⚠️ Auth module not found, skipping authentication routes.")

# === Include Slider Router ===
from routers import slider_router
app.include_router(slider_router.router)

# === Static Files ===
app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")


# === Menu Category ===
app.include_router(menu_category_router.router)

# === Gallery ===
app.include_router(gallery_router.router)

# === Reservations ===
from routers import reservation_router
app.include_router(reservation_router.router)

# === Users ===
from routers import user_router
app.include_router(user_router.router)

# === Menu Items ===
from routers import menu_item_router
app.include_router(menu_item_router.router)

# === Messages ===
from routers import message_router
app.include_router(message_router.router)

# === Settings ===
from routers import settings_router
app.include_router(settings_router.router)

# === Optional application factory for uvicorn 'server:start' ===
def start():
    """Return FastAPI app instance (allows 'uvicorn server:start')."""
    return app

# === Run with dynamic PORT for Railway ===
if __name__ == "__main__":
    import uvicorn
    # Railway sets PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)

