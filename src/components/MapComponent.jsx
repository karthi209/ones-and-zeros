import React, { useEffect, useRef } from "react";
import L from "leaflet";

const MapComponent = ({ mapcenter, zoom, gisdataurl }) => {
  const mapRef = useRef(null);

  // Validate mapcenter and provide default value if necessary
  const validMapCenter =
    Array.isArray(mapcenter) && mapcenter.length === 2
      ? mapcenter
      : [0, 0]; // Default to [0, 0] if mapcenter is invalid

  useEffect(() => {
    // Initialize Leaflet map when component mounts
    const map = L.map(mapRef.current).setView(validMapCenter, zoom || 12);

    // Add OpenStreetMap layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // You can add GeoJSON here if gisdataurl is provided
    if (gisdataurl) {
      fetch(gisdataurl)
        .then((response) => response.json())
        .then((data) => {
          L.geoJSON(data).addTo(map);
        })
        .catch((error) => {
          console.error("Failed to load GeoJSON:", error);
        });
    }

    // Cleanup on component unmount
    return () => {
      map.remove();
    };
  }, [gisdataurl, validMapCenter, zoom]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "450px", border: "1px solid black" }}
      ></div>
      {gisdataurl && (
        <div style={{ marginTop: "10px" }}>
          <a href={gisdataurl} target="_blank" rel="noopener noreferrer">
            View GIS Data
          </a>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
