import React, { useState } from 'react';
import PanoramicViewer from './PanoramicViewer';

const MarkerDetailForm = ({ marker, setFormVisible, setMarkers }) => {
  const [title, setTitle] = useState(marker.title);
  const [description, setDescription] = useState(marker.description);
  const [isEditing, setIsEditing] = useState(false); 
  const [newImageFile, setNewImageFile] = useState(null); 
  const [newImagePreview, setNewImagePreview] = useState(null); 

  const handleClick = (event) => {
    event.stopPropagation();
  };

  const handleMarkerFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result); 
        setNewImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

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
  
      setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker._id !== id));
      setFormVisible(false);
    } catch (error) {
      console.error('Error deleting marker:', error);
    }
  };
  

  const updateMarker = async () => {
    console.log("Updating marker with id:", marker._id); 
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('lat', marker.lat);  
    formData.append('lng', marker.lng);  
    if (newImageFile) {
      formData.append('image', newImageFile); 
    }
  
    try {
      const response = await fetch(`https://guideurself.onrender.com/backend/pins/${marker._id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const updatedMarkers = await fetchMarkers();
      setMarkers(updatedMarkers);  
      setFormVisible(false);
      setIsEditing(false);
      setNewImagePreview(null);
      setNewImageFile(null);
    } catch (error) {
      console.error('Error updating marker:', error);
    }
  };
  
  
  const toggleEdit = () => {
    setIsEditing((prev) => !prev); 
  };

  const cancelEdit = () => {
    setTitle(marker.title); 
    setDescription(marker.description); 
    setNewImagePreview(null); 
    setNewImageFile(null); 
    setIsEditing(false); 
  };

  return (
    <div className="form-container" onClick={handleClick}>
      <div className='input-area name-input-area'>
      <label htmlFor="">Location Name</label>
        <input 
          type="text" 
          placeholder="Location Name" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          readOnly={!isEditing}
        />
        </div>
        <div className='input-area'>
        <label htmlFor="">Description</label>
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          readOnly={!isEditing} 
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
              <PanoramicViewer imageUrl={marker.image} />
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
