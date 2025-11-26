# === auth.py ===
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import os
import random
import string
from dotenv import load_dotenv
from fastapi import Request
from email_service import send_otp_email

# === Load environment variables ===
load_dotenv()

# === Setup Router ===
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

# === OAuth2 Scheme ===
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_user_from_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await users_collection.find_one({"email": email}, {"password": 0, "_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def require_admin(user: dict = Depends(get_user_from_token)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user

# === Pydantic Models ===
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    phone_number: str = ""

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# === Helper: Generate OTP ===
def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

# === Helper: JWT Token Generator ===
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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
    return {"message": "✅ Admin account created successfully", "email": payload.email}

# === LOGIN ADMIN ===
@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user:
        logging.warning(f"Admin login failed: User not found - {form_data.username}")
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not pwd_context.verify(form_data.password, user["password"]):
        logging.warning(f"Admin login failed: Wrong password - {form_data.username}")
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if user.get("role") != "admin":
        logging.warning(f"Admin login failed: User is not admin - {form_data.username}")
        raise HTTPException(status_code=403, detail="Unauthorized access")

    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"], 
            "role": user["role"],
            "avatar_url": user.get("avatar_url", "")
        }
    }

# === REGISTER USER ===
@router.post("/user/register")
async def user_register(payload: RegisterRequest):
    existing_user = await users_collection.find_one({"email": payload.email})
    
    # If user exists and already verified, reject registration
    if existing_user and existing_user.get("email_verified", False):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar dan terverifikasi")
    
    # Generate OTP
    otp_code = generate_otp()
    otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # If user exists but not verified, update their data and resend OTP
    if existing_user:
        hashed_pw = pwd_context.hash(payload.password)
        await users_collection.update_one(
            {"email": payload.email},
            {"$set": {
                "password": hashed_pw,
                "phone_number": payload.phone_number or "",
                "otp_code": otp_code,
                "otp_expires_at": otp_expires_at,
                "updated_at": datetime.utcnow()
            }}
        )
        send_otp_email(payload.email, otp_code, payload.email.split('@')[0])
        return {
            "message": "✅ Kode OTP baru telah dikirim ke email Anda.",
            "email": payload.email
        }
    
    # Create new user if doesn't exist
    hashed_pw = pwd_context.hash(payload.password)
    new_user = {
        "email": payload.email,
        "password": hashed_pw,
        "phone_number": payload.phone_number or "",
        "role": "user",
        "email_verified": False,
        "otp_code": otp_code,
        "otp_expires_at": otp_expires_at,
        "created_at": datetime.utcnow()
    }

    await users_collection.insert_one(new_user)
    
    # Send OTP via email
    send_otp_email(payload.email, otp_code, payload.email.split('@')[0])
    
    return {
        "message": "✅ Pendaftaran berhasil! Silakan cek email Anda untuk kode verifikasi OTP.",
        "email": payload.email
    }

# === VERIFY OTP ===
@router.post("/verify-otp")
async def verify_otp(payload: VerifyOTPRequest):
    user = await users_collection.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("email_verified"):
        raise HTTPException(status_code=400, detail="Email sudah terverifikasi")
    
    # Check OTP expiration
    if user.get("otp_expires_at") and user["otp_expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Kode OTP sudah kadaluarsa. Silakan minta kode baru.")
    
    # Verify OTP
    if user.get("otp_code") != payload.otp_code:
        raise HTTPException(status_code=400, detail="Kode OTP salah")
    
    # Mark email as verified
    await users_collection.update_one(
        {"email": payload.email},
        {"$set": {"email_verified": True, "otp_code": "", "otp_expires_at": None}}
    )
    
    return {"message": "✅ Email berhasil diverifikasi! Silakan login."}

# === RESEND OTP ===
@router.post("/resend-otp")
async def resend_otp(payload: ResendOTPRequest):
    user = await users_collection.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("email_verified"):
        raise HTTPException(status_code=400, detail="Email sudah terverifikasi")
    
    # Generate new OTP
    otp_code = generate_otp()
    otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    await users_collection.update_one(
        {"email": payload.email},
        {"$set": {"otp_code": otp_code, "otp_expires_at": otp_expires_at}}
    )
    
    # Send new OTP via email
    send_otp_email(payload.email, otp_code, user.get("email", "").split('@')[0])
    
    return {"message": "✅ Kode OTP baru telah dikirim ke email Anda."}

# === LOGIN USER ===
@router.post("/user/login", response_model=TokenResponse)
async def user_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Check if email is verified
    if not user.get("email_verified", False):
        raise HTTPException(status_code=403, detail="Email belum diverifikasi. Silakan cek email Anda untuk kode OTP.")

    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"], 
            "role": user["role"],
            "avatar_url": user.get("avatar_url", "")
        }
    }

# === UNIVERSAL LOGIN (tanpa pilih role di frontend) ===
@router.post("/login", response_model=TokenResponse)
async def universal_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"], 
            "role": user["role"],
            "avatar_url": user.get("avatar_url", "")
        },
    }

# === GET CURRENT USER (/auth/me) ===
@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"email": user["email"], "role": user["role"]}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
