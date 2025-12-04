"""
Railway startup script - ensures PORT is read from environment
"""
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Railway PORT detected: {port}")
    print(f"📍 Starting LoreOmah API server...")
    
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
