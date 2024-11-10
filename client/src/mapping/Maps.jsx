import { MapContainer, Marker, Popup, useMapEvents, ImageOverlay } from 'react-leaflet';
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import './style.css';
import MarkerDetailForm from './MarkerDetailForm';
import markerIconUrl from './icon/pin.png';

const Maps = ({ markers, uploadedMap, setFormVisible, setNewMarker, onMarkerClick }) => {
  const bounds = [[14.480740, 121.184750], [14.488870, 121.192500]];

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

    const markerIcon = new L.Icon({
      iconUrl: markerIconUrl,
      iconSize: [35, 35],
      iconAnchor: [16, 32],
      popupAnchor: [1, 1],
  });

    return markers.map((marker) => (
      <Marker 
        key={marker.id} // Use the marker ID as the key
        position={[marker.lat, marker.lng]} 
        icon={markerIcon}
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
      center={[14.484750, 121.189000]}
      zoom={18}
      maxZoom={19}
      minZoom={17}
      style={{ height: '91vh', width: '80.3%', backgroundColor: 'white' }}
    >
      {uploadedMap && <ImageOverlay url={uploadedMap} bounds={bounds} />}
      <AddMarkerToClick />
    </MapContainer>
  );
};

export default Maps;
