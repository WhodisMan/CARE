'use client';

import { useState } from 'react';
import { Bot, SendHorizonal } from 'lucide-react';
import BackButton from "@/components/BackButton";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [shapImageUrl, setShapImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setConfidence(null);
      setShapImageUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setPrediction(data.prediction);
        setConfidence(data.confidence);

        const testResult = {
          prediction: data.prediction,
          confidence: data.confidence,
          date: new Date().toISOString(),
        };
        localStorage.setItem('latestTestResult', JSON.stringify(testResult));

        setShapImageUrl('http://localhost:8000/api/shap-image');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <BackButton />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Eye Disease Prediction
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 w-full cursor-pointer"
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-64 h-64 object-cover mb-4 rounded-lg shadow-md mx-auto"
            />
          )}

          <button
            onClick={handleUpload}
            className={`px-4 py-2 text-white rounded-lg w-full ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Upload & Predict'}
          </button>

          {prediction && confidence && (
            <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Prediction Result:</h2>
              <p className="text-lg text-blue-600 font-bold">{prediction}</p>
              <p className="text-lg text-green-600 font-semibold">
                Confidence: {confidence}
              </p>
            </div>
          )}

          {shapImageUrl && (
            <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow">
              <h2 className="text-xl font-semibold">SHAP Analysis:</h2>
              <img
                src={shapImageUrl}
                alt="SHAP Analysis"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
