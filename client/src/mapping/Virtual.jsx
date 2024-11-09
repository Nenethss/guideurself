import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import './style.css';
import Maps from './Maps';
import MarkerForm from './MarkerForm';
import MarkerDetailForm from './MarkerDetailForm'; // Import MarkerDetailForm
import UploadMap from './UploadMap';

function Virtual() {  
  const [markers, setMarkers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false); // State for marker detail visibility
  const [newMarker, setNewMarker] = useState({ lat: null, lng: null, title: '', description: '', image: null, imagePreview: null });
  const [selectedMarker, setSelectedMarker] = useState(null); // State for selected marker
  const [uploadedMap, setUploadedMap] = useState(null); // State for the uploaded map

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('http://localhost:3002/backend/pins');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
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
        const response = await fetch('http://localhost:3002/backend/maps');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.length > 0) {
          setUploadedMap(`http://localhost:3002/backend/maps/${data[0].filename}`); // Use backticks for string interpolation
        }
      } catch (error) {
        console.error('Error fetching uploaded map:', error);
      }
    };
    fetchUploadedMap();
  }, []);

  const fetchMarkers = async () => {
    try {
      const response = await fetch('http://localhost:3002/backend/pins');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching markers:', error);
      return []; // Return an empty array on error
    }
  };

  const deleteMarker = async (id) => {
    try {
      const response = await fetch(`http://localhost:3002/backend/pins/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Fetch the updated list of markers from the server
      const updatedMarkers = await fetchMarkers();
  
      // Update state with the new list of markers
      setMarkers(updatedMarkers);
  
      // Optionally, close the detail view
      setDetailVisible(false);
    } catch (error) {
      console.error('Error deleting marker:', error);
    }
  };
  
  const onMarkerClick = (marker) => {
    setSelectedMarker(marker); // This should set the selected marker correctly
    setDetailVisible(true); // Show the detail form
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
      {detailVisible && selectedMarker && ( // Show MarkerDetailForm if detail is visible and a marker is selected
        <MarkerDetailForm 
          marker={selectedMarker} 
          setFormVisible={setDetailVisible} // Use the same function to close the detail form
          deleteMarker={deleteMarker} // Pass the delete function
          setMarkers={setMarkers}
        />
      )}

    </div>
  );
}

export default Virtual;
