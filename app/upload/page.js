'use client';

import { useState } from 'react';
import { Bot, SendHorizonal } from 'lucide-react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I assist you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
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

        // Store the prediction and date in local storage
        const testResult = {
          prediction: data.prediction,
          date: new Date().toISOString(),
        };
        localStorage.setItem('latestTestResult', JSON.stringify(testResult));
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

        {prediction && (
          <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Prediction:</h2>
            <p className="text-lg text-blue-600 font-bold">{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
