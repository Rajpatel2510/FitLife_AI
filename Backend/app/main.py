from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.route.onboarding_router import router as onboarding_router
from app.api.route.workout_router import router as workout_router
from app.api.route.nutrition_router import router as nutrition_router
from app.api.route.daily_progress import router as daily_progress_router 
from app.db.database import Base, engine
from app.schemas.workout_schema import WorkoutGenerateRequest


app = FastAPI()

Base.metadata.create_all(bind=engine)
print(Base.metadata.tables.keys())

app.add_middleware(
    CORSMiddleware, 
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    # allow_headers=["*"],
    allow_headers=["Authorization", "Content-Type"],
)



app.include_router(onboarding_router)
app.include_router(workout_router)
app.include_router(nutrition_router)
app.include_router(daily_progress_router)    

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

