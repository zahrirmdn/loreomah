# backend/models.py
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
import uuid

# Model untuk User
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password: str
    phone_number: str = ""  # Nomor telepon user
    role: str = "user"  # bisa 'user' atau 'admin'
    email_verified: bool = False  # Status verifikasi email
    otp_code: str = ""  # Kode OTP untuk verifikasi
    otp_expires_at: datetime | None = None  # Waktu kadaluarsa OTP
    avatar_url: str = ""  # URL foto profil user
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Model untuk login/signup (input dari user)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone_number: str = ""
