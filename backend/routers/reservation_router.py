from fastapi import APIRouter, Request, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
import uuid
from auth import get_user_from_token, require_admin
from email_service import send_reservation_confirmation_email

router = APIRouter(prefix="/api/reservations", tags=["reservations"])

# Mongo-backed reservations collection (uses app.state.db)
COLLECTION_NAME = "reservations"


class ReservationCreate(BaseModel):
    name: str
    phone: str
    guests: int
    date: str  # ISO date string (datetime ISO)


class Reservation(ReservationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"  # could be pending|confirmed|cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    user_email: str | None = None
    is_read: bool = False  # Track if user has read the status update
    is_read_by_admin: bool = False  # Track if admin has read the reservation


@router.get("/")
async def list_reservations(request: Request):
    db = request.app.state.db
    docs = await db[COLLECTION_NAME].find({}, {"_id": 0}).to_list(1000)
    return docs


@router.post("/")
async def create_reservation(request: Request, payload: ReservationCreate, user: dict = Depends(get_user_from_token)):
    db = request.app.state.db
    # When user creates their own reservation, mark as read (they know about it)
    item = Reservation(**payload.model_dump(), user_email=user.get("email"), is_read=True)
    doc = item.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db[COLLECTION_NAME].insert_one(doc)
    created = await db[COLLECTION_NAME].find_one({"id": doc["id"]}, {"_id": 0})
    return created

@router.get("/mine")
async def list_my_reservations(
    request: Request,
    user: dict = Depends(get_user_from_token),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: str | None = Query(None, description="Filter status: pending|confirmed|cancelled")
):
    db = request.app.state.db
    filter_query = {"user_email": user.get("email")}
    if status:
        filter_query["status"] = status
    skip = (page - 1) * size
    cursor = db[COLLECTION_NAME].find(filter_query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(size)
    items = await cursor.to_list(size)
    total = await db[COLLECTION_NAME].count_documents(filter_query)
    return {"items": items, "page": page, "size": size, "total": total}

@router.put("/{reservation_id}/cancel")
async def cancel_my_reservation(request: Request, reservation_id: str, user: dict = Depends(get_user_from_token)):
    db = request.app.state.db
    existing = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if existing.get("user_email") != user.get("email"):
        raise HTTPException(status_code=403, detail="Not your reservation")
    if existing.get("status") == "cancelled":
        return existing
    await db[COLLECTION_NAME].update_one({"id": reservation_id}, {"$set": {"status": "cancelled"}})
    updated = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    return updated

@router.put("/{reservation_id}/confirm")
async def confirm_reservation_admin(request: Request, reservation_id: str, admin: dict = Depends(require_admin)):
    db = request.app.state.db
    existing = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    await db[COLLECTION_NAME].update_one({"id": reservation_id}, {"$set": {"status": "confirmed", "is_read": False}})
    updated = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    
    # Send confirmation email to user
    user_email = existing.get("user_email")
    if user_email:
        try:
            send_reservation_confirmation_email(user_email, updated)
        except Exception as e:
            print(f"Warning: Failed to send confirmation email: {str(e)}")
            # Don't fail the request if email fails
    
    return updated

@router.put("/{reservation_id}/decline")
async def decline_reservation_admin(request: Request, reservation_id: str, admin: dict = Depends(require_admin)):
    db = request.app.state.db
    existing = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Reservation not found")
    await db[COLLECTION_NAME].update_one({"id": reservation_id}, {"$set": {"status": "declined", "is_read": False}})
    updated = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    return updated


@router.put("/mark-all-read")
async def mark_all_reservations_as_read(request: Request, user: dict = Depends(get_user_from_token)):
    db = request.app.state.db
    # First, set is_read: true for all existing reservations that don't have this field
    await db[COLLECTION_NAME].update_many(
        {"user_email": user.get("email"), "is_read": {"$exists": False}},
        {"$set": {"is_read": True}}
    )
    # Then update all unread reservations to read
    result = await db[COLLECTION_NAME].update_many(
        {"user_email": user.get("email"), "is_read": False},
        {"$set": {"is_read": True}}
    )
    return {"updated_count": result.modified_count}

@router.put("/admin/mark-all-read")
async def mark_all_reservations_as_read_by_admin(request: Request, admin: dict = Depends(require_admin)):
    db = request.app.state.db
    # Set is_read_by_admin: true for all existing reservations that don't have this field
    await db[COLLECTION_NAME].update_many(
        {"is_read_by_admin": {"$exists": False}},
        {"$set": {"is_read_by_admin": True}}
    )
    # Then update all unread by admin to read
    result = await db[COLLECTION_NAME].update_many(
        {"is_read_by_admin": False},
        {"$set": {"is_read_by_admin": True}}
    )
    return {"updated_count": result.modified_count}

@router.put("/{reservation_id}/mark-read")
async def mark_reservation_as_read(request: Request, reservation_id: str, user: dict = Depends(get_user_from_token)):
    db = request.app.state.db
    existing = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if existing.get("user_email") != user.get("email"):
        raise HTTPException(status_code=403, detail="Not your reservation")
    await db[COLLECTION_NAME].update_one({"id": reservation_id}, {"$set": {"is_read": True}})
    updated = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    return updated

@router.put("/{reservation_id}")
async def update_reservation(request: Request, reservation_id: str, payload: dict):
    db = request.app.state.db
    existing = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Reservation not found")
    updated = {**existing, **payload}
    # ensure created_at stays a string
    if isinstance(updated.get("created_at"), datetime):
        updated["created_at"] = updated["created_at"].isoformat()
    await db[COLLECTION_NAME].update_one({"id": reservation_id}, {"$set": updated})
    updated_doc = await db[COLLECTION_NAME].find_one({"id": reservation_id}, {"_id": 0})
    return updated_doc

@router.delete("/{reservation_id}")
async def delete_reservation(request: Request, reservation_id: str):
    db = request.app.state.db
    res = await db[COLLECTION_NAME].delete_one({"id": reservation_id})
    if res.deleted_count:
        return {"detail": "Deleted"}
    raise HTTPException(status_code=404, detail="Reservation not found")
