from fastapi import APIRouter, Request, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil, uuid

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])

UPLOAD_DIR = Path("backend/uploads/gallery")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

COLLECTION_NAME = "gallery"


@router.get("/")
async def get_gallery(request: Request):
    db = request.app.state.db
    docs = await db[COLLECTION_NAME].find({}, {"_id": 0}).to_list(1000)
    return docs


@router.get("/{item_id}")
async def get_gallery_item(request: Request, item_id: str):
    db = request.app.state.db
    item = await db[COLLECTION_NAME].find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@router.post("/")
async def create_gallery_item(request: Request, title: str = Form(None), description: str = Form(None), image: UploadFile = None):
    filename = None
    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    item = {
        "id": str(uuid.uuid4()),
        "title": title,
        "description": description,
        "image_url": f"/uploads/gallery/{filename}" if filename else None,
    }
    db = request.app.state.db
    await db[COLLECTION_NAME].insert_one(item)
    created = await db[COLLECTION_NAME].find_one({"id": item["id"]}, {"_id": 0})
    return JSONResponse({"message": "Gallery item added", "data": created})


@router.put("/{item_id}")
async def update_gallery_item(request: Request, item_id: str, title: str = Form(None), description: str = Form(None), image: UploadFile = None):
    db = request.app.state.db
    item = await db[COLLECTION_NAME].find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")

    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        item["image_url"] = f"/uploads/gallery/{filename}"

    if title is not None:
        item["title"] = title
    if description is not None:
        item["description"] = description

    await db[COLLECTION_NAME].update_one({"id": item_id}, {"$set": item})
    updated = await db[COLLECTION_NAME].find_one({"id": item_id}, {"_id": 0})
    return JSONResponse({"message": "Gallery item updated", "data": updated})


@router.delete("/{item_id}")
async def delete_gallery_item(request: Request, item_id: str):
    db = request.app.state.db
    item = await db[COLLECTION_NAME].find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")

    # delete file if exists
    if item.get("image_url"):
        path = Path("backend") / item["image_url"].lstrip("/")
        if path.exists():
            path.unlink()

    await db[COLLECTION_NAME].delete_one({"id": item_id})
    return JSONResponse({"message": "Gallery item deleted"})
