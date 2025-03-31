'use client';

import { useState } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';
import BackButton from "@/components/BackButton";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [shapImageUrl, setShapImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shapLoading, setShapLoading] = useState(false);

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Resize image to max 400x400 before displaying (small preview)
      const resizedImage = await resizeImage(file, 400, 400);
      setSelectedFile(file);
      setPreviewUrl(resizedImage);
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
    setShapLoading(true);
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

        // Add timestamp to force fresh image load
        setShapImageUrl(`http://localhost:8000/api/shap-image?${Date.now()}`);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto"> {/* Increased max width */}
        <BackButton className="mb-6" />
        
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Eye Disease Prediction
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <div className="flex flex-col items-center space-y-6">
              {/* File upload section */}
              <label className="w-full max-w-xs">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <SendHorizonal className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {selectedFile ? selectedFile.name : 'Choose an image'}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>

              {/* Preview image (smaller) */}
              {previewUrl && (
                <div className="relative max-w-xs rounded-lg overflow-hidden shadow-md">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center w-full max-w-xs ${
                  loading || !selectedFile
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Upload & Predict'
                )}
              </button>

              {/* Prediction results */}
              {prediction && confidence && (
                <div className="mt-4 p-6 bg-blue-50 rounded-lg shadow w-full max-w-4xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Result</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-gray-700">Diagnosis:</p>
                      <p className="text-2xl font-bold text-blue-600">{prediction}</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">Confidence:</p>
                      <p className="text-2xl font-bold text-green-600">{confidence}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SHAP image (larger) */}
              {shapImageUrl && (
                <div className="mt-6 w-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">SHAP Analysis</h2>
                  <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                    {shapLoading && (
                      <div className="flex justify-center items-center h-[700px]">
                        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
                      </div>
                    )}
                    <div className="flex justify-center">
                      <img
                        src={shapImageUrl}
                        alt="SHAP Analysis"
                        className={`rounded-lg shadow-md ${shapLoading ? 'hidden' : 'block'} max-h-[700px]`}
                        onLoad={() => setShapLoading(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}