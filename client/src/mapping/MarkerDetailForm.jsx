import React, { useState } from 'react';
import PanoramicViewer from './PanoramicViewer';

const MarkerDetailForm = ({ marker, setFormVisible, setMarkers }) => {
  const [title, setTitle] = useState(marker.title);
  const [description, setDescription] = useState(marker.description);
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const [newImageFile, setNewImageFile] = useState(null); // State for new image file
  const [newImagePreview, setNewImagePreview] = useState(null); // State for new image preview

  const handleClick = (event) => {
    event.stopPropagation();
  };

  const handleMarkerFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result); // Set image preview
        setNewImageFile(file); // Keep original image file reference
      };
      reader.readAsDataURL(file);
    }
  };

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
      setMarkers(updatedMarkers);
      setFormVisible(false);
    } catch (error) {
      console.error('Error deleting marker:', error);
    }
  };

  const updateMarker = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    if (newImageFile) { // This is the new image file chosen by the user
      formData.append('image', newImageFile);
    }
  
    try {
      const response = await fetch(`http://localhost:3002/backend/pins/${marker._id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedMarkers = await fetchMarkers();
      setMarkers(updatedMarkers);
      setFormVisible(false);
      setIsEditing(false); // Exit edit mode after successful update
      setNewImagePreview(null); // Reset image preview
      setNewImageFile(null); // Reset image file
    } catch (error) {
      console.error('Error updating marker:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  const cancelEdit = () => {
    setTitle(marker.title); // Reset title to original value
    setDescription(marker.description); // Reset description to original value
    setNewImagePreview(null); // Reset image preview
    setNewImageFile(null); // Reset image file
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="form-container" onClick={handleClick}>
      <div className='input-area name-input-area'>
      <label htmlFor="">Location Name</label>
        <input 
          type="text" 
          placeholder="Location Name" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} // Update local state
          readOnly={!isEditing} // Toggle read-only based on edit mode
        />
        </div>
        <div className='input-area'>
        <label htmlFor="">Description</label>
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} // Update local state
          readOnly={!isEditing} // Toggle read-only based on edit mode
          style={{ resize: 'none' }} 
        />
        </div>      
        <div className="input-area">
          <div className="upload-area">
          {isEditing ? (
          <>
            <input 
              type="file" 
              accept="image/*" 
              id="marker-file-upload" 
              style={{ display: 'none' }} 
              onChange={handleMarkerFileChange} 
            />
            <label htmlFor="marker-file-upload">Upload a file or drag and drop</label>
            {newImagePreview && (
              <PanoramicViewer imageUrl={newImagePreview} />
            )}
          </>
        ) : (
          <>
            {marker.image ? (
              <PanoramicViewer imageUrl={marker.image} /> // Use the full Cloudinary URL here
            ) : (
              <p>No image available</p>
            )}
          </>
        )}

          </div>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <div className='edit-container'>
            <button className='add' onClick={isEditing ? updateMarker : toggleEdit}>
            {isEditing ? 'Confirm' : 'Edit'}
            </button>
          {isEditing && (
            <button className='cancel' onClick={cancelEdit}>Cancel</button>
          )}
          {!isEditing && (
            <>
              <button className='delete' onClick={() => deleteMarker(marker._id)}>Delete</button>
            </>
          )}
          </div>
          <div className='close-container'>
          {!isEditing && (
            <>
              <button className='cancel cancel-button' onClick={() => setFormVisible(false)}>Close</button>
            </>
          )}
          </div>
        </div>
      </div>
  );
};

export default MarkerDetailForm;
