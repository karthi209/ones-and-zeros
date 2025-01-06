import React, { useEffect, useRef, useState } from "react";
import * as ol from "ol";
import "ol/ol.css";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Form } from "react-bootstrap"; // Added react-bootstrap Form for dropdown

const MapComponent = ({ mapcenter, zoom, gisdataurl, basemap }) => {
  const mapRef = useRef(null);
  const validMapCenter =
    Array.isArray(mapcenter) && mapcenter.length === 2
      ? mapcenter
      : [80.237617, 13.067439]; // Default to Chennai coordinates
  const [currentBaseMap, setCurrentBaseMap] = useState(basemap || "osm"); // Initial base map from markdown

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) return; // Ensure mapRef is not null before initializing the map

    const baseLayer = createBaseLayer(currentBaseMap);

    const map = new ol.Map({
      target: mapRef.current, // Ensure mapRef.current is a valid DOM element
      layers: [baseLayer],
      view: new View({
        center: fromLonLat(validMapCenter),
        zoom: zoom || 12,
      }),
    });

    // If GIS data URL is provided, fetch and add GeoJSON
    if (gisdataurl) {
      fetch(gisdataurl)
        .then((response) => response.json())
        .then((data) => {
          const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(data, {
              featureProjection: "EPSG:3857",
            }),
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource,
          });

          map.addLayer(vectorLayer);
        })
        .catch((error) => {
          console.error("Failed to load GeoJSON:", error);
        });
    }

    // Cleanup function to remove the map instance on component unmount
    return () => map.setTarget(null);
  }, [gisdataurl, validMapCenter, zoom, currentBaseMap]);

  // Function to create base layers based on type
  const createBaseLayer = (type) => {
    switch (type) {
      case "carto":
        return new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          }),
        });
      case "satellite":
        return new TileLayer({
          source: new XYZ({
            url: "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=YOUR_MAPTILER_API_KEY",
          }),
        });
      case "osm":
      default:
        return new TileLayer({
          source: new OSM(),
        });
    }
  };

  // Function to update the base map dynamically
  const updateBaseMap = (newBaseMap) => {
    const mapInstance = mapRef.current;
    const newBaseLayer = createBaseLayer(newBaseMap);

    // Replace the current base layer with the new one
    const layers = mapInstance.getLayers();
    layers.setAt(0, newBaseLayer); // Set the new base layer at the first position
  };

  // Handle UI base map selection
  const handleBaseMapChange = (e) => {
    const selectedBaseMap = e.target.value;
    setCurrentBaseMap(selectedBaseMap);
    updateBaseMap(selectedBaseMap);
  };

  return (
    <div style={styles.container}>
      {/* Dropdown for base map selection */}
      <div style={styles.mapControls}>
        <Form.Group controlId="basemap">
          <Form.Label>Select Base Map</Form.Label>
          <Form.Control
            as="select"
            value={currentBaseMap}
            onChange={handleBaseMapChange}
            style={styles.select}
          >
            <option value="osm">OpenStreetMap</option>
            <option value="carto">Carto Light</option>
            <option value="satellite">Satellite Imagery</option>
          </Form.Control>
        </Form.Group>
      </div>

      {/* Map container */}
      <div
        ref={mapRef} // Ensure this ref is properly set
        style={styles.mapContainer}
      />
    </div>
  );
};

export default MapComponent;

const styles = {
  container: {
    maxWidth: "100%",
    margin: "0 auto", // Centering the map on the page
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  mapContainer: {
    width: "100%",
    height: "500px",
    border: "1px solid #ddd",
    overflow: "hidden", // Ensure the map doesn't spill out of its container
  },
  mapControls: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Spacing out label and dropdown
    gap: "10px"
  },
  select: {
    fontSize: "14px",
    padding: "5px 10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
};
