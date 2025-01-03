import React from "react";

const MapComponent = ({ mapcenter, zoom, gisdataurl }) => {
  // Validate mapcenter and provide default value if necessary
  const validMapCenter =
    Array.isArray(mapcenter) && mapcenter.length === 2
      ? mapcenter
      : [0, 0]; // Default to [0, 0] if mapcenter is invalid

  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${validMapCenter[1] - 0.01}%2C${validMapCenter[0] - 0.01}%2C${validMapCenter[1] + 0.01}%2C${validMapCenter[0] + 0.01}&layer=mapnik`;

  return (
    <div style={{ marginBottom: "20px" }}>
      <iframe
        src={iframeSrc}
        width="100%"
        height="450"
        style={{ border: "1px solid black" }}
        title="Embedded Map"
      ></iframe>
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
