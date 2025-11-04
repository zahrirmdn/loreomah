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
    role: str = "user"  # bisa 'user' atau 'admin'
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Model untuk login/signup (input dari user)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
