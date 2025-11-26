# routers/slider_router.py
from fastapi import APIRouter, Request, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import os, shutil, uuid

router = APIRouter(prefix="/api/sliders", tags=["Sliders"])

UPLOAD_DIR = Path("backend/uploads/sliders")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

COLLECTION_NAME = "sliders"


@router.get("/")
async def get_sliders(request: Request):
    db = request.app.state.db
    docs = await db[COLLECTION_NAME].find({}, {"_id": 0}).to_list(1000)
    # Keep compatibility with frontend expecting 'image' key
    for d in docs:
        if "image_url" in d and "image" not in d:
            d["image"] = d["image_url"]
    return docs


@router.get("/{slider_id}")
async def get_slider(request: Request, slider_id: str):
    db = request.app.state.db
    doc = await db[COLLECTION_NAME].find_one({"id": slider_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Slider not found")
    # Keep compatibility with frontend expecting 'image' key
    if "image_url" in doc and "image" not in doc:
        doc["image"] = doc["image_url"]
    return doc


@router.post("/")
async def create_slider(request: Request,
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = None,
):
    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/sliders/{filename}"
    else:
        image_url = None

    new_slider = {
        "id": str(uuid.uuid4()),
        "title": title,
        "description": description,
        "image_url": image_url,
    }
    db = request.app.state.db
    await db[COLLECTION_NAME].insert_one(new_slider)
    created = await db[COLLECTION_NAME].find_one({"id": new_slider["id"]}, {"_id": 0})
    # ensure frontend compatibility: include 'image' key
    if created and "image_url" in created and "image" not in created:
        created["image"] = created.get("image_url")
    return JSONResponse({"message": "Slider added", "data": created})


@router.delete("/{slider_id}")
async def delete_slider(request: Request, slider_id: str):
    db = request.app.state.db
    doc = await db[COLLECTION_NAME].find_one({"id": slider_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Slider not found")
    if doc.get("image_url"):
        image_path = Path("backend") / doc["image_url"].lstrip("/")
        if image_path.exists():
            image_path.unlink()
    await db[COLLECTION_NAME].delete_one({"id": slider_id})
    return {"message": "Slider deleted"}


@router.put("/{slider_id}")
async def update_slider(request: Request,
    slider_id: str,
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = None,
):
    db = request.app.state.db
    doc = await db[COLLECTION_NAME].find_one({"id": slider_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Slider not found")
    
    update_data = {
        "title": title,
        "description": description,
    }
    
    # If new image uploaded, delete old and save new
    if image:
        # Delete old image
        if doc.get("image_url"):
            old_image_path = Path("backend") / doc["image_url"].lstrip("/")
            if old_image_path.exists():
                old_image_path.unlink()
        
        # Save new image
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        update_data["image_url"] = f"/uploads/sliders/{filename}"
    
    await db[COLLECTION_NAME].update_one({"id": slider_id}, {"$set": update_data})
    updated = await db[COLLECTION_NAME].find_one({"id": slider_id}, {"_id": 0})
    
    # Keep compatibility with frontend expecting 'image' key
    if updated and "image_url" in updated and "image" not in updated:
        updated["image"] = updated["image_url"]
    
    return JSONResponse({"message": "Slider updated", "data": updated})
