import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv


def load_env():
    here = os.path.dirname(__file__)
    env_path = os.path.join(here, ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path)


async def main():
    load_env()
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "loreomah")

    print(f"Connecting to MongoDB at: {mongo_url} (db: {db_name})")
    client = AsyncIOMotorClient(mongo_url)
    try:
        res = await client.admin.command("ping")
        print("Ping succeeded:", res)

        dbs = await client.list_database_names()
        print("Databases on server:", dbs)

        if db_name in dbs:
            db = client[db_name]
            cols = await db.list_collection_names()
            print(f"Collections in '{db_name}':", cols)
        else:
            print(f"Database '{db_name}' does not exist yet (will be created on first write)")

    except Exception as e:
        print("Connection failed:", repr(e))
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
