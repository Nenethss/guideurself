import { MapContainer, Marker, Popup, useMapEvents, ImageOverlay } from 'react-leaflet';
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import './style.css';
import MarkerDetailForm from './MarkerDetailForm';

const Maps = ({ markers, uploadedMap, setFormVisible, setNewMarker, onMarkerClick }) => {
  const bounds = [[14.481740, 121.184750], [14.488870, 121.195250]];

  useEffect(() => {
    console.log('Uploaded Map URL:', uploadedMap);
  }, [uploadedMap]);
  
  // This component will handle the addition of markers and their click events
  function AddMarkerToClick() {
    useMapEvents({
      click(e) {
        setNewMarker({ lat: e.latlng.lat, lng: e.latlng.lng, title: '', description: '', image: null, imagePreview: null });
        setFormVisible(true);
      }
    });

    return markers.map((marker) => (
      <Marker 
        key={marker.id} // Use the marker ID as the key
        position={[marker.lat, marker.lng]} 
        eventHandlers={{ 
          click: () => onMarkerClick(marker) // Call the onMarkerClick with the marker data
        }}
      >
        <Popup>{marker.title}</Popup> {/* Optional: Display title in the popup */}
      </Marker>
    ));
  }

  return (
    <MapContainer
      className="map"
      center={[14.485300, 121.190000]}
      zoom={18}
      style={{ height: '91vh', width: '80.3%', backgroundColor: 'white' }}
    >
      <ImageOverlay url={uploadedMap} bounds={bounds} />
      <AddMarkerToClick />
    </MapContainer>
  );
};

export default Maps;
