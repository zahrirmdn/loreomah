# routers/message_router.py
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/messages", tags=["Messages"])

COLLECTION_NAME = "messages"


class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class MessageUpdate(BaseModel):
    is_read: bool


@router.post("/")
async def create_message(request: Request, message_data: MessageCreate):
    """User mengirim pesan ke admin"""
    db = request.app.state.db
    
    message = {
        "id": str(uuid.uuid4()),
        "name": message_data.name,
        "email": message_data.email,
        "subject": message_data.subject,
        "message": message_data.message,
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db[COLLECTION_NAME].insert_one(message)
    created = await db[COLLECTION_NAME].find_one({"id": message["id"]}, {"_id": 0})
    
    return JSONResponse({
        "message": "Pesan berhasil dikirim",
        "data": created
    })


@router.get("/")
async def get_all_messages(request: Request, unread_only: bool = False):
    """Admin melihat semua pesan"""
    db = request.app.state.db
    
    query = {}
    if unread_only:
        query["is_read"] = False
    
    messages = await db[COLLECTION_NAME].find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    return {
        "total": len(messages),
        "messages": messages
    }


@router.patch("/{message_id}/read")
async def mark_message_as_read(request: Request, message_id: str):
    """Admin menandai pesan sebagai sudah dibaca"""
    db = request.app.state.db
    
    message = await db[COLLECTION_NAME].find_one({"id": message_id})
    if not message:
        raise HTTPException(status_code=404, detail="Pesan tidak ditemukan")
    
    await db[COLLECTION_NAME].update_one(
        {"id": message_id},
        {"$set": {"is_read": True}}
    )
    
    updated = await db[COLLECTION_NAME].find_one({"id": message_id}, {"_id": 0})
    
    return JSONResponse({
        "message": "Pesan ditandai sebagai dibaca",
        "data": updated
    })


@router.delete("/{message_id}")
async def delete_message(request: Request, message_id: str):
    """Admin menghapus pesan"""
    db = request.app.state.db
    
    result = await db[COLLECTION_NAME].delete_one({"id": message_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pesan tidak ditemukan")
    
    return JSONResponse({"message": "Pesan berhasil dihapus"})
