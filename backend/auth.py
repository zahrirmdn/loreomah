from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import os
from dotenv import load_dotenv

# === Load environment ===
load_dotenv()

router = APIRouter(prefix="/auth", tags=["Auth"])

# === JWT CONFIG ===
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# === Password Hashing ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# === Setup MongoDB ===
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_url)
db_name = os.getenv("DB_NAME", "loreomah")
db = client[db_name]
users_collection = db["users"]

# === Pydantic Models ===
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# === JWT Helper ===
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# === REGISTER ADMIN ===
@router.post("/admin/register")
async def admin_register(payload: RegisterRequest):
    existing_user = await users_collection.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_context.hash(payload.password)
    new_user = {
        "email": payload.email,
        "password": hashed_pw,
        "role": "admin",
        "created_at": datetime.utcnow()
    }

    await users_collection.insert_one(new_user)
    return {"message": "Admin account created successfully", "email": payload.email}

# === LOGIN ADMIN ===
@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Verifikasi password
    if not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Cek role admin
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    # Buat token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user["email"], "role": user["role"]}
    }
