from fastapi import APIRouter, Request, Depends, HTTPException, UploadFile, File
from typing import Optional
from auth import require_admin, get_user_from_token
import os
import base64
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/")
async def list_users(request: Request, q: Optional[str] = None, page: int = 1, per_page: int = 20, admin=Depends(require_admin)):
    db = request.app.state.db
    filter_q = {}
    if q:
        filter_q = {"email": {"$regex": q, "$options": "i"}}

    total = await db["users"].count_documents(filter_q)
    skip = (max(page, 1) - 1) * per_page
    cursor = db["users"].find(filter_q, {"_id": 0, "password": 0}).skip(skip).limit(per_page)
    items = await cursor.to_list(per_page)
    return {"total": total, "page": page, "per_page": per_page, "items": items}


@router.delete("/{email}")
async def delete_user(request: Request, email: str, admin=Depends(require_admin)):
    db = request.app.state.db
    res = await db["users"].delete_one({"email": email})
    if res.deleted_count:
        return {"detail": "User deleted"}
    raise HTTPException(status_code=404, detail="User not found")


@router.get("/me")
async def get_profile(request: Request, current=Depends(get_user_from_token)):
    db = request.app.state.db
    user = await db["users"].find_one({"email": current["email"]}, {"password": 0, "_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # ensure missing profile fields present as empty strings
    for field in ["username", "full_name", "phone", "address", "avatar_url"]:
        user.setdefault(field, "")
    return user


class ProfileUpdatePayload(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


@router.patch("/me")
async def update_profile(request: Request, payload: ProfileUpdatePayload, current=Depends(get_user_from_token)):
    db = request.app.state.db
    update_doc = payload.model_dump(exclude_none=True)
    if not update_doc:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    update_doc["updated_at"] = datetime.utcnow()
    res = await db["users"].update_one({"email": current["email"]}, {"$set": update_doc}, upsert=False)
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    user = await db["users"].find_one({"email": current["email"]}, {"password": 0, "_id": 0})
    for field in ["username", "full_name", "phone", "address", "avatar_url"]:
        user.setdefault(field, "")
    return user


@router.post("/me/avatar")
async def upload_avatar(request: Request, file: UploadFile = File(...), current=Depends(get_user_from_token)):
    try:
        # Validate content type
        content_type = file.content_type or "image/jpeg"
        print(f"Content type: {content_type}")
        print(f"Filename: {file.filename}")
        
        if not content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        print(f"File size: {file_size} bytes ({file_size / 1024 / 1024:.2f}MB)")
        
        # Validate file is not empty
        if not file_content:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Check file size (max 10MB to allow larger images)
        if file_size > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail=f"File size must be less than 10MB (current: {file_size / 1024 / 1024:.2f}MB)")
        
        # Convert to base64
        base64_image = base64.b64encode(file_content).decode('utf-8')
        print(f"Base64 length: {len(base64_image)}")
        
        # Create data URL with mime type
        avatar_url = f"data:{content_type};base64,{base64_image}"
        
        # Update database
        db = request.app.state.db
        result = await db["users"].update_one(
            {"email": current["email"]}, 
            {"$set": {"avatar_url": avatar_url, "updated_at": datetime.utcnow()}}, 
            upsert=False
        )
        print(f"Database update result: matched={result.matched_count}, modified={result.modified_count}")
        
        return {"avatar_url": avatar_url}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading avatar: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error uploading avatar: {str(e)}")

@router.post("/me/avatar/remove")
async def remove_avatar(request: Request, current=Depends(get_user_from_token)):
    db = request.app.state.db
    await db["users"].update_one(
        {"email": current["email"]}, 
        {"$set": {"avatar_url": "", "updated_at": datetime.utcnow()}}, 
        upsert=False
    )
    return {"message": "Avatar removed successfully"}
