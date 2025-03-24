'use client';

import React, { useState, useEffect } from "react";
import BackButton from "@/components/BackButton";


const healthTips = [
  "Take a 20-second break every 20 minutes to rest your eyes.",
  "Blink frequently to keep your eyes moist and prevent strain.",
  "Eat leafy greens, carrots, and fish to maintain good eye health.",
  "Avoid staring at screens in dim light to reduce eye fatigue.",
  "Use blue light filters on your devices to protect your eyes.",
];

const eyeCareVideos = [
  { id: "SoafE67JOw0", title: "Cataract Care by Vasan Eye Care" },
  { id: "Uo2ylBfuTWM", title: "Proactive Eye Care by Dr. Agarwal's" },
  { id: "UQB42rcy8q8", title: "Importance of Quality Eye Care by Kanneattan" },
  { id: "Ufa975LbTp0", title: "Selecting Eyeglasses - Dr. MIMS" },
  { id: "wYAWou8fWGg", title: "Laser Eye Surgery Explained" },
];

export default function HealthInsights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [fade, setFade] = useState(true);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('latestTestResult');
    if (savedResult) {
      setTestResult(JSON.parse(savedResult));
    }
  }, []);

  useEffect(() => {
    const videoInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % eyeCareVideos.length);
        setFade(true);
      }, 1000);
    }, 8000);
    return () => clearInterval(videoInterval);
  }, []);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prevTip) => (prevTip + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="p-6">
      <BackButton />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900 p-8 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Health Insights</h1>

          {/* Test Results Section */}
          {testResult ? (
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 text-center mb-6">
              <h2 className="text-lg font-bold text-blue-600">🩺 Latest Eye Test Result</h2>
              <p className="text-gray-800 text-md mt-2">
                <strong>Diagnosis:</strong> {testResult.prediction}
              </p>
              <p className="text-gray-600 text-sm">📅 Date: {new Date(testResult.date).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">No test results found. Please upload an eye scan.</p>
          )}

          {/* Live Health Tips */}
          <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 text-center mb-6">
            <h2 className="text-lg font-bold text-blue-600">💡 Eye Health Tip</h2>
            <p className="text-gray-700 text-md mt-2 transition-opacity duration-700 ease-in-out">
              {healthTips[currentTip]}
            </p>
          </div>

          {/* Video Player */}
          <div className="relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-white mb-6">
            <iframe
              key={eyeCareVideos[currentIndex].id}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${eyeCareVideos[currentIndex].id}`}
              title={eyeCareVideos[currentIndex].title}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`rounded-xl transition-opacity duration-1000 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            ></iframe>
          </div>

          <p className="text-lg font-semibold text-blue-900">{eyeCareVideos[currentIndex].title}</p>

          <div className="flex gap-3 mt-4">
            {eyeCareVideos.map((video, index) => (
              <button
                key={video.id}
                className={`w-4 h-4 rounded-full ${currentIndex === index ? "bg-blue-600" : "bg-gray-400"}`}
                onClick={() => {
                  setFade(false);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setFade(true);
                  }, 500);
                }}
              ></button>
            ))}
          </div>
        </div>
    </div>
  );
}
