// components/MapComponent.js
import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";

const MapComponent = ({ mapCenter, zoom, gisDataUrl }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const vectorSource = new VectorSource({
      url: gisDataUrl, // GIS data URL
      format: new GeoJSON(), // Data format
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: {
        // Optional styles
        fill: {
          color: "rgba(255, 0, 0, 0.5)",
        },
        stroke: {
          color: "red",
          width: 2,
        },
      },
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer, // Add the vector layer
      ],
      view: new View({
        center: fromLonLat(mapCenter),
        zoom,
      }),
    });

    return () => map.setTarget(null); // Cleanup on unmount
  }, [mapCenter, zoom, gisDataUrl]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;