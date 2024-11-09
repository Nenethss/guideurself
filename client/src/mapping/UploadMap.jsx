export const UploadMap = ({ setUploadedMap }) => {
  const handleMapFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('mapImage', file);

      try {
        const response = await fetch('http://localhost:3002/backend/maps/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUploadedMap(`http://localhost:3002/backend/maps/${data.filename}`);
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