import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import './style.css';
import Maps from './Maps';
import MarkerForm from './MarkerForm';
import MarkerDetailForm from './MarkerDetailForm'; 
import UploadMap from './UploadMap';

function Virtual() {  
  const [markers, setMarkers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false); 
  const [newMarker, setNewMarker] = useState({ lat: null, lng: null, title: '', description: '', image: null, imagePreview: null });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [uploadedMap, setUploadedMap] = useState(null); 

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('https://guideurself.onrender.com/backend/pins');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Markers:', data); 
        setMarkers(data);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
    fetchMarkers();
  }, []);
  

  useEffect(() => {
    const fetchUploadedMap = async () => {
      try {
        const response = await fetch('https://guideurself.onrender.com/backend/maps');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Map Data:', data);
        if (data.length > 0) {
          setUploadedMap(data[0].filename); 
        }
      } catch (error) {
        console.error('Error fetching uploaded map:', error);
      }
    };
    
    
    fetchUploadedMap();
  }, []);
  
  
  const fetchMarkers = async () => {
    try {
      const response = await fetch('https://guideurself.onrender.com/backend/pins');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error fetching markers:', error);
      return []; 
    }
  };

  const deleteMarker = async (id) => {
    try {
      const response = await fetch(`https://guideurself.onrender.com/backend/pins/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const updatedMarkers = await fetchMarkers();
  
      setMarkers(updatedMarkers);
  
      setDetailVisible(false);
    } catch (error) {
      console.error('Error deleting marker:', error);
    }
  };
  
  const onMarkerClick = (marker) => {
    console.log('Clicked Marker:', marker);
    setSelectedMarker(marker); 
    setDetailVisible(true);
  };
  

  return (
    
    <div className="map-upload-container">
      <UploadMap setUploadedMap={setUploadedMap} />
      {uploadedMap && (
        <Maps 
          markers={markers} 
          setMarkers={setMarkers} 
          uploadedMap={uploadedMap} 
          setFormVisible={setFormVisible} 
          setNewMarker={setNewMarker} 
          onMarkerClick={onMarkerClick}
        />
      )}
      {formVisible && (
        <MarkerForm 
          newMarker={newMarker} 
          setNewMarker={setNewMarker} 
          setMarkers={setMarkers} 
          setFormVisible={setFormVisible} 
        />
      )}
      {detailVisible && selectedMarker && (
        <MarkerDetailForm 
          marker={selectedMarker} 
          setFormVisible={setDetailVisible}
          deleteMarker={deleteMarker}
          setMarkers={setMarkers}
        />
      )}

    </div>
  );
}

export default Virtual;
