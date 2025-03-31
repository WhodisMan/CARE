from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os
from database import get_db
from models import Prediction
import numpy as np

router = APIRouter()

# Check for CUDA
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the model (VGG16 with BatchNorm)
model = models.vgg16_bn(pretrained=False)
model.classifier[-1] = nn.Linear(model.classifier[-1].in_features, 4)  # 4 classes
model_path = "models/vgg16final.pt"
if not os.path.exists(model_path):
    raise RuntimeError(f"Model file not found at {model_path}")
model.load_state_dict(torch.load(model_path, map_location=device))
model = model.to(device).eval()

# Class labels
class_labels = ['CNV', 'DME', 'DRUSEN', 'NORMAL']

# Data transformations
data_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

def preprocess_image(file_path):
    """Loads and preprocesses an image for model prediction."""
    img = Image.open(file_path).convert('RGB')
    img_tensor = data_transforms(img).unsqueeze(0).to(device)
    return img_tensor

@router.post("/predict")
async def predict(file: UploadFile = File(...), db: Session = Depends(get_db)):
    temp_file = "temp_image.jpg"
    
    try:
        # Save uploaded file temporarily
        with open(temp_file, "wb") as buffer:
            buffer.write(await file.read())

        # Process & predict
        img_tensor = preprocess_image(temp_file)
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, class_idx = torch.max(probabilities, 1)
        
        confidence_percent = round(confidence.item() * 100, 2)
        predicted_class = class_labels[class_idx.item()]

        # Store in database
        new_prediction = Prediction(
            filename=file.filename,
            prediction=predicted_class,
            confidence=confidence_percent
        )
        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        return {
            "prediction": predicted_class,
            "confidence": f"{confidence_percent:.2f}%"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

