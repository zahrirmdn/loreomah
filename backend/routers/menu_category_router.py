# routers/menu_category_router.py
from fastapi import APIRouter, Request, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil, uuid, os

router = APIRouter(prefix="/api/menu-categories", tags=["Menu Categories"])

UPLOAD_DIR = Path("backend/uploads/menu_categories")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

COLLECTION_NAME = "menu_categories"


@router.get("/")
async def get_categories(request: Request):
    db = request.app.state.db
    docs = await db[COLLECTION_NAME].find({}, {"_id": 0}).to_list(1000)
    return docs


@router.get("/{name}/")
async def get_category_by_name(request: Request, name: str):
    db = request.app.state.db
    doc = await db[COLLECTION_NAME].find_one({"name": {"$regex": f"^{name}$", "$options": "i"}}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")
    return doc


@router.post("/")
async def create_category(request: Request,
    title: str = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    image: UploadFile = None,
    menu_link: str = None
):
    filename = None
    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    
    category = {
        "id": str(uuid.uuid4()),
        "title": title,
        "name": name,
        "description": description,
        "image_url": f"/uploads/menu_categories/{filename}" if filename else None,
        "menu_link": menu_link,
    }
    db = request.app.state.db
    await db[COLLECTION_NAME].insert_one(category)
    created = await db[COLLECTION_NAME].find_one({"id": category["id"]}, {"_id": 0})
    return JSONResponse({"message": "Kategori berhasil ditambahkan", "data": created})


@router.put("/{category_id}")
async def update_category(request: Request,
    category_id: str,
    title: str = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    image: UploadFile = None,
    menu_link: str = Form(None)
):
    db = request.app.state.db
    category = await db[COLLECTION_NAME].find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")

    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        category["image_url"] = f"/uploads/menu_categories/{filename}"

    category["title"] = title
    category["name"] = name
    category["description"] = description
    if menu_link is not None:
        category["menu_link"] = menu_link

    await db[COLLECTION_NAME].update_one({"id": category_id}, {"$set": category})
    updated = await db[COLLECTION_NAME].find_one({"id": category_id}, {"_id": 0})
    return JSONResponse({"message": "Kategori berhasil diperbarui", "data": updated})


@router.delete("/{category_id}")
async def delete_category(request: Request, category_id: str):
    db = request.app.state.db
    res = await db[COLLECTION_NAME].delete_one({"id": category_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")
    return JSONResponse({"message": "Kategori berhasil dihapus"})
