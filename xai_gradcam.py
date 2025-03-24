# Import essential libraries
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import matplotlib.pyplot as plt
# Load the VGG16 model
model = load_model('backend/eye_disease_model.h5')

def load_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))  # Resize to match model input
    img = img / 255.0                   # Normalize pixel values
    img = np.expand_dims(img, axis=0)   # Add batch dimension
    return img

image = load_image('images\c.jpeg')

