from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Prediction

router = APIRouter()

# Personalized health suggestions based on detected diseases
SUGGESTIONS = {
    "DME": "Maintain stable blood sugar levels and schedule regular eye exams.",
    "CNV": "Avoid smoking, protect your eyes from UV light, and visit an ophthalmologist.",
    "Drusen": "Follow an antioxidant-rich diet, exercise regularly, and monitor vision changes.",
}

@router.get("/profile-history")
async def get_medical_history(db: Session = Depends(get_db)):
    """Fetch medical history and generate suggestions."""
    recent_results = db.query(Prediction).order_by(Prediction.id.desc()).limit(5).all()

    if not recent_results:
        return {"medical_history": [], "suggestions": ["No records available"]}

    detected_diseases = list(set([result.prediction for result in recent_results]))

    # Generate suggestions based on detected diseases
    suggestions = [SUGGESTIONS[d] for d in detected_diseases if d in SUGGESTIONS]

    return {
        "medical_history": detected_diseases,
        "suggestions": suggestions if suggestions else ["No specific suggestions available."]
    }
