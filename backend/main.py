from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from upload import router as upload_router
from insight import router as insight_router
from upload import router as predictions_router  # Added predictions router
from app_profile import router as profile_router
from database import engine, Base
from chat import router as chatbot_router 

# Initialize FastAPI
app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(upload_router, prefix="/api")
app.include_router(insight_router, prefix="/api")
app.include_router(predictions_router, prefix="/api")  # Ensure predictions router is added
app.include_router(profile_router, prefix="/api")  # ✅ Add profile API
app.include_router(chatbot_router, prefix="/api", tags=["Chatbot"])

@app.get("/")
async def root():
    return {"message": "Backend is running successfully!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)


