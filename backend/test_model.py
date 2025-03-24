import tensorflow as tf

# Load the model
model_path = "eye_disease_model.h5"  # Change this to your actual model filename
try:
    model = tf.keras.models.load_model(model_path)
    print("✅ Model loaded successfully!")
    model.summary()  # Print model structure
except Exception as e:
    print("❌ Error loading model:", e)
