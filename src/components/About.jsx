import React from "react";
import "./css/Pages.css";
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

function About() {
  
  const geoUrl = "/data.json"

  return (
    <div className="map-style">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4800, // Increase scale to enlarge the map
          center: [78.07, 10.95], // Replace with your GeoJSON's central coordinates
        }}
        style={{ width: "100%", height: "100%" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export default About;
