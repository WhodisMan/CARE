"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch test results from backend
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/profile-history");
        const data = await response.json();
        setMedicalHistory(data.medical_history);
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error("Error fetching medical history:", error);
      }
    };
    fetchMedicalHistory();
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-6 py-10 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      {/* Profile Card */}
      <motion.div
        className={`p-6 rounded-lg shadow-md w-full max-w-lg transition-all ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full border border-gray-300 shadow-sm"
            />
          )}

          {/* User Name & Email */}
          <h1 className="text-xl font-semibold mt-4">
            {session?.user?.name || "User"}
          </h1>
          <p className="text-gray-500">{session?.user?.email || "Email"}</p>

          {/* Medical History Section */}
          <div className="mt-6 w-full text-left">
            <h2 className="text-lg font-semibold">Medical History</h2>
            {medicalHistory.length > 0 ? (
              <ul className="text-sm text-gray-500 list-disc pl-4">
                {medicalHistory.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No records available</p>
            )}
          </div>

          {/* Personalized Suggestions Section */}
          <div className="mt-4 w-full text-left">
            <h2 className="text-lg font-semibold">Personalized Suggestions</h2>
            <ul className="text-sm text-gray-500 list-disc pl-4">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Logout & Account Deletion */}
          <div className="mt-6 flex w-full justify-between">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => signOut()}
            >
              Logout
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => alert("Account deletion feature coming soon")}
            >
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
