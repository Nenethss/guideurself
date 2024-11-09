import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, ImageOverlay, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '@/style.css';
import "leaflet/dist/leaflet.css";
import markerIconUrl from './icon/pin.png';
import PanoramicViewer from './PanoramicViewer';

const UploadMap = () => {
    const { campusId } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [mapUrl, setMapUrl] = useState(null);
    const bounds = [[14.482910, 121.186400], [14.487680, 121.193650]];
    const [campusName, setCampusName] = useState('');
    const [hasMap, setHasMap] = useState(false);
    const [markers, setMarkers] = useState([]);

    // New marker details
    const [markerTitle, setMarkerTitle] = useState('');
    const [markerDescription, setMarkerDescription] = useState('');
    const [markerImage, setMarkerImage] = useState(null); 
    const [markerPosition, setMarkerPosition] = useState(null); 
    const [isMarkerFormVisible, setMarkerFormVisible] = useState(false); 
    const [markerImagePreview, setMarkerImagePreview] = useState(null);
    
    // Fetch campus details
    useEffect(() => {
        const fetchCampusData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/campus/${campusId}`);
                if (response.ok) {
                    const campus = await response.json();
                    setCampusName(campus.name);
                } else {
                    console.error('Failed to fetch campus details');
                }
            } catch (error) {
                console.error('Error fetching campus details:', error);
            }
        };

        fetchCampusData();
    }, [campusId]);

    useEffect(() => {
        const fetchMap = async () => {
            // Reset the map states before fetching a new map
            setHasMap(false);
            setMapUrl(null);
            
            try {
                const response = await fetch(`http://localhost:5000/api/maps/${campusId}`);
                if (response.ok) {
                    const maps = await response.json();
                    if (maps.length > 0) {
                        const imageUrl = `http://localhost:5000${maps[0].imageUrl}`;
                        setMapUrl(imageUrl);
                        setHasMap(true);
                    } else {
                        console.log('No maps found for this campus.');
                    }
                } else {
                    console.error('Failed to fetch map details');
                }
            } catch (error) {
                console.error('Error fetching map:', error);
            }
        };
    
        fetchMap();
    }, [campusId]);
    

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/markers/campus/${campusId}`);
                if (response.ok) {
                    const markerData = await response.json();
                    setMarkers(markerData);
                } else {
                    console.error('Failed to fetch markers');
                }
            } catch (error) {
                console.error('Error fetching markers:', error);
            }
        };

        fetchMarkers();
    }, [campusId]);

    // Handle map image file change
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setMessage(''); 
    };

    // Handle map upload
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('mapImage', selectedFile);
        formData.append('campusId', campusId);

        try {
            const response = await fetch(`http://localhost:5000/api/maps`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload map');
            }

            const data = await response.json();
            const uploadedImageUrl = `http://localhost:5000${data.imageUrl}`;
            setMapUrl(uploadedImageUrl);
            setHasMap(true);

        } catch (error) {
            console.error('Error uploading map:', error);
        }
    };

    // Function to add marker to the map on click
    const AddMarkerOnClick = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setMarkerPosition({ lat, lng });
                setMarkerFormVisible(true); 
            },
        });

        return null;
    };

    const handleMarkerImageChange = (e) => {
        const file = e.target.files[0];
        setMarkerImage(file)
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setMarkerImagePreview(previewUrl);
        } else {
            setMarkerImagePreview(null); 
        }
    };

    // Handle marker form submission
    const handleMarkerSubmit = async (event) => {
        event.preventDefault();

        if (!markerImage) {
            setMessage('Please select an image for the marker.');
            return;
        }

        const formData = new FormData();
        formData.append('campusId', campusId);
        formData.append('latitude', markerPosition.lat);
        formData.append('longitude', markerPosition.lng);
        formData.append('title', markerTitle);
        formData.append('description', markerDescription);
        formData.append('image', markerImage); 

        try {
            const response = await fetch('http://localhost:5000/api/markers', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to save marker');
            }

            const newMarker = await response.json();
            setMarkers((prevMarkers) => [...prevMarkers, newMarker]); 
            setMarkerTitle(''); 
            setMarkerDescription(''); 
            setMarkerImage(null); 
            setMarkerPosition(null); 
            setMarkerImagePreview(null); 
            setMarkerFormVisible(false); 
        } catch (error) {
            console.error('Error saving marker:', error);
            setMessage(`Error saving marker: ${error.message}`);
        }
    };

    // Marker icon
    const markerIcon = new L.Icon({
        iconUrl: markerIconUrl,
        iconSize: [35, 35],
        iconAnchor: [16, 32],
        popupAnchor: [1, 1],
    });

    return (
        <div className="campus-details">
    {/* <h2 style={{ margin: '0px', color: 'black', textAlign: 'center' }}>{campusName}</h2> */}

    {hasMap ? (  // Change the condition here to check if hasMap is true
        <div className="campus-details-container">
            <MapContainer
                center={[14.485300, 121.190000]} 
                zoom={17}   
                crs={L.CRS.Simple}
                scrollWheelZoom={false}
                
            >
                <ImageOverlay url={mapUrl} bounds={bounds} />
                <AddMarkerOnClick />
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={[marker.latitude, marker.longitude]}
                    />
                ))}
            </MapContainer>
        </div>
    ) : (
        <div className="upload-container">
            <form onSubmit={handleSubmit} className="upload-form">
                <input type="file" onChange={handleFileChange} accept="image/*" required />
                <button type="submit" disabled={!selectedFile}>Upload Map</button>
            </form>
        </div>
    )}

    {/* Marker input form */}
    {isMarkerFormVisible && (
        <div className="marker-form">
            <form onSubmit={handleMarkerSubmit}>
                <input
                    className='title'
                    type="text"
                    placeholder="Marker Title"
                    value={markerTitle}
                    onChange={(e) => setMarkerTitle(e.target.value)}
                    required
                />
                <textarea
                    className='description'
                    placeholder="Marker Description"
                    value={markerDescription}
                    onChange={(e) => setMarkerDescription(e.target.value)}
                    required
                /> 

                <label className="file-upload-label">
                    {markerImagePreview ? ( 
                        <>
                            {markerImagePreview && (
                                <PanoramicViewer imageUrl={markerImagePreview} width="100%" height="300px" />
                            )}
                        </>
                    ) : (
                        <>
                            <input
                                type="file"
                                onChange={handleMarkerImageChange}
                                accept="image/*"
                                required
                                style={{ display: 'none' }} 
                            />
                            <span>Upload 360 Image</span> 
                        </>
                    )}
                </label>
                <div>
                    <button type="submit">Add Marker</button>
                    <button type="button" onClick={() => {
                        setMarkerFormVisible(false);
                        setMarkerImagePreview(null); 
                        setMarkerTitle(''); 
                        setMarkerDescription(''); 
                    }}>Cancel</button>      
                </div>
            </form>
        </div>
    )}

    {message && <p className="message">{message}</p>} 
</div>

    );
};

export default UploadMap;






