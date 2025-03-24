"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import BackButton from "@/components/BackButton";

// Import Haversine formula for distance calculation
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2); // Distance in km
};

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function NearbyHospitals() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null); // Track selected hospital

  const getLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          setError(null);
          await fetchNearbyHospitals(userLocation);
          setLoading(false);
        },
        (error) => {
          setError("Location access denied. Please enable GPS.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Fetch hospitals and calculate distances
  const fetchNearbyHospitals = async (userLocation) => {
    const { lat, lng } = userLocation;
    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=hospital](around:10000,${lat},${lng});out body;`
      );
      const data = await response.json();

      if (data.elements.length > 0) {
        let hospitalList = data.elements
          .filter((hospital) => hospital.lat && hospital.lon)
          .map((hospital) => ({
            name: hospital.tags?.name || "Unknown Hospital",
            lat: hospital.lat,
            lng: hospital.lon,
            contact: hospital.tags?.phone || "N/A",
            distance: getDistance(lat, lng, hospital.lat, hospital.lon), // Calculate distance
            isEyeHospital:
              hospital.tags?.["healthcare:speciality"]?.includes("ophthalmology") ||
              hospital.tags?.["name"]?.toLowerCase().includes("eye"),
          }));

        // Sort hospitals: Eye hospitals first, then nearest
        hospitalList.sort((a, b) => {
          if (a.isEyeHospital !== b.isEyeHospital) {
            return a.isEyeHospital ? -1 : 1;
          }
          return parseFloat(a.distance) - parseFloat(b.distance);
        });

        setHospitals(hospitalList);
      } else {
        setError("No hospitals found nearby.");
      }
    } catch (error) {
      setError("Failed to fetch hospital data.");
    }
  };

  return (
        <div className="p-6">
          <BackButton />
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">🏥 Nearby Hospitals</h1>

      {/* Button to Fetch Location */}
      <button
        onClick={getLocation}
        disabled={loading}
        className={`px-4 py-2 rounded-lg transition-all ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {loading ? "Fetching..." : "📍 Get My Location"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Hospital List (Moved Above Map) */}
      {hospitals.length > 0 && (
        <div className="mt-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-2">🏥 Nearby Hospitals:</h2>
          <ul className="bg-white shadow-md rounded-lg p-4 max-h-60 overflow-y-auto">
            {hospitals.map((hospital, index) => (
              <li
                key={index}
                className="p-3 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer flex flex-col"
                onClick={() => setSelectedHospital(hospital)} // Update selected hospital
              >
                <strong>🏥 {hospital.name}</strong>
                <p>📏 {hospital.distance} km away</p>
                {hospital.contact !== "N/A" && <p>☎ {hospital.contact}</p>}
                {hospital.isEyeHospital && (
                  <span className="text-green-600">👁 Specializes in Eye Care</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Map (Now Below List) */}
      {location && (
        <Map
          userLocation={location}
          hospitals={hospitals}
          selectedHospital={selectedHospital} // Pass selected hospital to the map
        />
      )}
    </div>
    </div>
  );
}

