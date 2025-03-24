from sqlalchemy import Column, Integer, String, Float
from database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    prediction = Column(String)
    confidence = Column(Float)

class GradCAMResult(Base):
    __tablename__ = "gradcam_results"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    gradcam_image = Column(String)

class HealthInsight(Base):
    __tablename__ = "health_insights"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)  # Type of insight (risk assessment, exercise, etc.)
    content = Column(String)  # The actual insight message