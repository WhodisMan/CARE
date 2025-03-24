from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import HealthInsight, Prediction
import random

router = APIRouter()

# Sample health insights
EYE_EXERCISES = [
    "Blink every few seconds to reduce eye strain.",
    "Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
    "Gently massage your temples to relax eye muscles."
]

NUTRITION_TIPS = [
    "Eat more leafy greens like spinach and kale for better eye health.",
    "Omega-3 fatty acids in fish can prevent dry eyes.",
    "Stay hydrated to keep your eyes moist and healthy."
]

DOCTOR_ADVICE = [
    "Regular eye check-ups can help detect diseases early.",
    "Use protective glasses if working long hours on screens.",
    "Avoid rubbing your eyes excessively to prevent infections."
]

@router.get("/health-insights")
async def get_health_insights(db: Session = Depends(get_db)):
    """Fetch real-time health tips and insights."""
    recent_predictions = db.query(Prediction).order_by(Prediction.id.desc()).limit(5).all()
    eye_exercise = random.choice(EYE_EXERCISES)
    nutrition_tip = random.choice(NUTRITION_TIPS)
    doctor_tip = random.choice(DOCTOR_ADVICE)

    return {
        "recent_predictions": [{"filename": p.filename, "disease": p.prediction, "confidence": p.confidence} for p in recent_predictions],
        "eye_exercise": eye_exercise,
        "nutrition_tip": nutrition_tip,
        "doctor_advice": doctor_tip
    }
