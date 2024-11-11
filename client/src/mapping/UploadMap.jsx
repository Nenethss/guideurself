export const UploadMap = ({ setUploadedMap }) => {
  const handleMapFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('mapImage', file);

      try {
        const response = await fetch('https://guideurself.onrender.com/backend/maps/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Set the Cloudinary URL returned from the backend
        setUploadedMap(data.url);
      } catch (error) {
        console.error('Error uploading map image:', error);
      }
    }
  };

  return (
    <div className="upload-container">
      <input 
        type="file" 
        accept="image/*" 
        id="map-upload" 
        style={{ display: 'none' }} 
        onChange={handleMapFileChange} 
      />
      <label htmlFor="map-upload" className="upload-button">Upload Map Image</label>
    </div>
  );
};

export default UploadMap;
