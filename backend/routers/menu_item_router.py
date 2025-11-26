from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
import uuid
from auth import require_admin

router = APIRouter(prefix="/api/menu-items", tags=["Menu Items"])

COLLECTION = "menu_items"


@router.get("/{category}/")
async def get_items_by_category(request: Request, category: str):
    db = request.app.state.db
    # match category case-insensitively
    docs = await db[COLLECTION].find({"category": {"$regex": f"^{category}$", "$options": "i"}}, {"_id": 0}).to_list(1000)
    return docs


@router.post("/")
async def create_item(request: Request, payload: dict, admin=Depends(require_admin)):
    db = request.app.state.db
    name = payload.get("name")
    description = payload.get("description")
    price = payload.get("price")
    category = payload.get("category")

    if not name or not category:
        raise HTTPException(status_code=400, detail="name and category are required")

    item = {
        "id": str(uuid.uuid4()),
        "name": name,
        "description": description,
        "price": float(price) if price is not None else None,
        "category": category,
    }

    await db[COLLECTION].insert_one(item)
    created = await db[COLLECTION].find_one({"id": item["id"]}, {"_id": 0})
    return JSONResponse({"message": "Menu item created", "data": created})


@router.put("/{item_id}")
async def update_item(request: Request, item_id: str, payload: dict, admin=Depends(require_admin)):
    db = request.app.state.db
    existing = await db[COLLECTION].find_one({"id": item_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Item not found")

    update = {}
    for k in ("name", "description", "price", "category"):
        if k in payload:
            update[k] = payload[k]
    if "price" in update and update["price"] is not None:
        update["price"] = float(update["price"])

    await db[COLLECTION].update_one({"id": item_id}, {"$set": update})
    updated = await db[COLLECTION].find_one({"id": item_id}, {"_id": 0})
    return JSONResponse({"message": "Menu item updated", "data": updated})


@router.delete("/{item_id}")
async def delete_item(request: Request, item_id: str, admin=Depends(require_admin)):
    db = request.app.state.db
    res = await db[COLLECTION].delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return JSONResponse({"message": "Menu item deleted"})
