import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import { Select } from 'ol/interaction';
import { Pointer as PointerEvent } from 'ol/interaction';
import { Circle } from 'ol/style';

function About() {

  const mapRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {

    const vectorSource = new VectorSource({});

    const defaultStyle = new Style({
      fill: new Fill({ color: '#d3d3d3' }),
      stroke: new Stroke({ color: '#bebebe', width: 1 }),
    });

    const highlightStyle = new Style({
      fill: new Fill({ color: '#4682b4' }),
      stroke: new Stroke({ color: '#4682b4', width: 2, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 10, shadowOffsetX: 5,  shadowOffsetY: 5 }),
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: '#4682b4' }),
      })
    });

    const selectedStyle = new Style({
      fill: new Fill({ color: '#ff7f50' }),  // Change color to indicate selection
      stroke: new Stroke({ color: '#ff7f50', width: 3 }), // Bold stroke for selected feature
      image: new Circle({
        radius: 12,
        fill: new Fill({ color: '#ff7f50' }),  // Same color for circle when selected
      })
    });

    // Style to apply on hover
    const hoverStyle = new Style({
      fill: new Fill({ color: '#4682b4' }),
      stroke: new Stroke({
        color: '#4682b4',
        width: 2,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 20,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
      }),
      image: new Circle({
        radius: 12,
        fill: new Fill({ color: '#4682b4' }),
      })
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: defaultStyle,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [vectorLayer],
      view: new View({
        center: [0, 0], // Center of the map in EPSG:3857 coordinates
        zoom: 2, // Initial zoom level
      }),
      controls: [],
      interactions: [new PointerEvent()], // Enables basic pointer interaction
    });

    fetch('/data.geojson')
      .then((response) => response.json())
      .then((geojsonData) => {
        const features = new GeoJSON().readFeatures(geojsonData, {
          featureProjection: 'EPSG:3857',
        });
        vectorSource.addFeatures(features);

        const extent = vectorSource.getExtent();
        map.getView().fit(extent, { padding: [50, 50, 50, 50] });
      });

    // Create a popup overlay
    const popupOverlay = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
    });
    map.addOverlay(popupOverlay);

    let highlightedFeature = null;
    let selectedFeature = null;

    // Highlight feature on hover
    map.on('pointermove', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);

      if (feature) {
        // Highlight the feature on hover
        if (highlightedFeature !== feature) {
          if (highlightedFeature) {
            highlightedFeature.setStyle(defaultStyle); // Reset the previous highlighted feature
          }
          feature.setStyle(hoverStyle); // Apply hover style
          highlightedFeature = feature;
        }

        const properties = feature.getProperties();
        popupRef.current.innerHTML = `${properties.dtname || 'No name available'}`;

        const coords = event.coordinate;
        const offset = [10, 10];  // Adjust these values to move the popup further from the cursor
        popupOverlay.setPosition([coords[0] + offset[0], coords[1] + offset[1]]);
      } else {
        // Reset the style and hide popup if no feature is hovered
        if (highlightedFeature) {
          highlightedFeature.setStyle(defaultStyle);
          highlightedFeature = null;
        }
        popupRef.current.innerHTML = '';
        popupOverlay.setPosition(undefined); // Hide the popup if no feature
      }
    });

    // Select interaction
    const select = new Select({
      condition: PointerEvent,
    });
    map.addInteraction(select);

    // Handle select event (when user clicks on a feature)
    select.on('select', (e) => {
      // Get the selected feature
      const feature = e.selected[0]; 
      
      if (feature) {
        // If a feature is selected, apply the selected style
        if (selectedFeature) {
          selectedFeature.setStyle(defaultStyle); // Reset the previous selected feature
        }
        feature.setStyle(selectedStyle); // Apply selected style

        selectedFeature = feature; // Set the current feature as the selected feature

        const properties = feature.getProperties();
        popupRef.current.innerHTML = `<p>${properties.dtname || 'No name available'}</p>`;
        popupOverlay.setPosition(e.mapBrowserEvent.coordinate); // Position the popup near the selected feature
      }
    });

    return () => map.setTarget(null);

  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100vw', height: '90vh' }}></div>
      <div ref={popupRef} style={{
        position: 'absolute',
        backgroundColor: 'whitesmoke',
        borderRadius: '10px',
        border: 'solid 1px whitesmoke',
        padding: '10px',
        zIndex: 1000,
        width: 'auto',
        height: '45px',
        color: '#36454f',
        fontFamily: "Bricolage Grotesque",
      }}></div>
    </div>
  );
}

export default About;
