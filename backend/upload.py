from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os
from database import get_db
from models import Prediction

router = APIRouter()

# Load the ML Model
model_path = "models/eye_disease_model.h5"
if not os.path.exists(model_path):
    raise RuntimeError(f"Model file not found at {model_path}")

model = load_model(model_path)

# Class labels
class_labels = ['CNV', 'DME', 'DRUSEN', 'NORMAL']

def preprocess_image(file_path):
    """Loads and preprocesses an image for model prediction."""
    img = image.load_img(file_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

@router.post("/predict")
async def predict(file: UploadFile = File(...), db: Session = Depends(get_db)):
    temp_file = "temp_image.jpg"

    try:
        # Save uploaded file temporarily
        with open(temp_file, "wb") as buffer:
            buffer.write(await file.read())

        # Process & predict
        img_array = preprocess_image(temp_file)
        prediction = model.predict(img_array)
        class_idx = np.argmax(prediction[0])
        
        # Calculate confidence percentage
        confidence = float(prediction[0][class_idx])
        confidence_percent = round(confidence * 100, 2)  # Convert to percentage with 2 decimal places

        predicted_class = class_labels[class_idx]

        # Store in database
        new_prediction = Prediction(
            filename=file.filename,
            prediction=predicted_class,
            confidence=confidence_percent  # Store percentage in database
        )
        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        return {
            "prediction": predicted_class,
            "confidence": "{:.3f}%".format(confidence_percent)  # 3 decimal places
        }

    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)