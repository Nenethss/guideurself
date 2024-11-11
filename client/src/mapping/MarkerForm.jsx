import { useEffect } from "react";
import PanoramicViewer from './PanoramicViewer';

export const MarkerForm = ({ newMarker, setNewMarker, setMarkers, setFormVisible }) => {
  const handleFormSubmit = async () => {
    const { lat, lng, title, description, image } = newMarker;

    // Log newMarker to check its values
    console.log('New Marker:', newMarker);

    if (!title || !description || !image) {
      alert("Please fill out all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await fetch('https://guideurself.onrender.com/backend/pins', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMarkers((prev) => [...prev, { ...data, lat, lng, title, description }]);
      setFormVisible(false);
    } catch (error) {
      console.error('Error saving marker:', error);
    }
  };

  const handleMarkerFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the marker with image preview here
        setNewMarker({
          ...newMarker,
          imagePreview: reader.result, // Set image preview correctly
          image: file // Keep original image file reference
        });
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <div className="form-container">
        <div className="input-area name-input-area">
        <label htmlFor="">New Location</label>
        <input 
          type="text" 
          placeholder="Enter name of the location" 
          value={newMarker.title} 
          onChange={(e) => setNewMarker({ ...newMarker, title: e.target.value })} 
        />
        </div>
        
        <div className="input-area">
        <label htmlFor="">Description</label>
        <textarea 
          placeholder="Enter the location description" 
          value={newMarker.description} 
          onChange={(e) => setNewMarker({ ...newMarker, description: e.target.value })} 
        />
        </div>
        
        <div className="input-area"> 
        <label htmlFor="">Upload 360 image</label>
          <div className="upload-area  success-upload-area">
            <input 
              type="file" 
              accept="image/*" 
              id="marker-file-upload" 
              style={{ display: 'none' }} 
              onChange={handleMarkerFileChange} 
            />
            <label htmlFor="marker-file-upload">Upload a file or drag and drop</label>
            {newMarker.imagePreview && (
              <PanoramicViewer imageUrl={newMarker.imagePreview} />
            )}
          </div>
        </div>

        <div className="input-area buttons">
          <button className="cancel" onClick={() => setFormVisible(false)}>Cancel</button>
          <button className="add markerform-add" onClick={handleFormSubmit}>Add</button>
        </div>
    </div>
  );
};

export default MarkerForm;
