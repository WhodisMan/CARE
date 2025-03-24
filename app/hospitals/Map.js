import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FaHospital } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

// Custom hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(ReactDOMServer.renderToString(<FaHospital size={30} color="red" />)),
  iconSize: [30, 30], // Size of the icon
  iconAnchor: [15, 30], // Anchor point of the icon, where the marker's position should be
  popupAnchor: [0, -30], // Position of the popup relative to the icon
});

// Helper component to zoom the map when a hospital is selected
function SetMapView({ position, zoomLevel }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, zoomLevel); // Smooth zoom to selected hospital
  }
  return null;
}

export default function Map({ userLocation, hospitals, selectedHospital }) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{
        height: "500px", // Increased map height
        width: "100%",
        marginTop: "20px",
        borderRadius: "10px",
      }}
    >
      {/* Map Tile */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User Location Marker */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>📍 You are here</Popup>
      </Marker>

      {/* Hospital Markers */}
      {hospitals.map((hospital, index) => (
        <Marker key={index} position={[hospital.lat, hospital.lng]} icon={hospitalIcon}>
          <Popup>
            <strong>🏥 {hospital.name}</strong> <br />
            📍 {hospital.lat.toFixed(4)}, {hospital.lng.toFixed(4)}
            {hospital.contact ? (
              <>
                <br />
                ☎ Contact: {hospital.contact}
              </>
            ) : (
              ""
            )}
          </Popup>
        </Marker>
      ))}

      {/* When a hospital is selected, zoom in */}
      {selectedHospital && (
        <SetMapView position={[selectedHospital.lat, selectedHospital.lng]} zoomLevel={16} />
      )}
    </MapContainer>
  );
}
