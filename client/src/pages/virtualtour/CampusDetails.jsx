import React, { useState } from 'react';
import UploadMap from './UploadMap';

const CampusDetails = ({ campus }) => {
    const [uploadedMap, setUploadedMap] = useState(null); // State for uploaded map URL

    return (
        <div>
            <h2>{campus.name}</h2>
            <UploadMap campusId={campus._id} setUploadedMap={setUploadedMap} />
            {uploadedMap && <img src={uploadedMap} alt="Uploaded Map" style={{ marginTop: '20px', maxWidth: '100%' }} />}
        </div>
    );
};

export default CampusDetails;
