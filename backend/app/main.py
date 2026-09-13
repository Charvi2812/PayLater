from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.endpoints import router as api_router

load_dotenv()

app = FastAPI(
    title="AI-Powered Responsible BNPL & Financial Wellness API",
    description="Prototype financial wellness, risk engine, affordability analysis, and AI decision-support platform.",
    version="1.0.0"
)

# CORS setup for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive CORS for local hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root_status():
    return {
        "status": "online",
        "app": "AI-Powered Responsible BNPL & Financial Wellness Platform",
        "version": "1.0.0",
        "disclaimer": "This platform is an educational financial wellness prototype and decision-support tool."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
