import React, { useEffect, useRef } from "react";
import * as ol from "ol";
import "ol/ol.css";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

const MapComponent = ({ mapcenter, zoom, gisdataurl }) => {
  // Validate mapcenter and provide default value if necessary
  const validMapCenter =
    Array.isArray(mapcenter) && mapcenter.length === 2
      ? mapcenter
      : [0, 0]; // Default to [0, 0] if mapcenter is invalid

  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize OpenLayers map
    const map = new ol.Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap layer
        }),
      ],
      view: new View({
        center: fromLonLat(validMapCenter), // Convert lon/lat to Web Mercator
        zoom: zoom || 12, // Default zoom level
      }),
    });

    // If GIS data URL is provided, fetch and add GeoJSON
    if (gisdataurl) {
      fetch(gisdataurl)
        .then((response) => response.json())
        .then((data) => {
          const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(data, {
              featureProjection: "EPSG:3857", // Ensure features are in the correct projection
            }),
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource,
          });

          // Add vector layer with GeoJSON data to the map
          map.addLayer(vectorLayer);
        })
        .catch((error) => {
          console.error("Failed to load GeoJSON:", error);
        });
    }

    // Cleanup map on unmount
    return () => {
      map.setTarget(null);
    };
  }, [gisdataurl, validMapCenter, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "450px", border: "1px solid black" }}
    />
  );
};

export default MapComponent;
