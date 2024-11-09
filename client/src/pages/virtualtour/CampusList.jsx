import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import urslogo from './urslogo.png';

const CampusList = () => {
    const [campuses, setCampuses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/campus');
                if (!response.ok) throw new Error('Failed to fetch campuses');
                
                const data = await response.json();
                setCampuses(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCampuses();
    }, []);

    const handleCampusClick = (campusId) => {
        navigate(`/virtual-tour/${campusId}/upload`);
    };

    return (
        <div className='campus-container'>
            {campuses.map((campus) => (
                <button
                    className='campuses'
                    key={campus._id}
                    onClick={() => handleCampusClick(campus._id)}
                >
                    <img style={{width: '40px', height: '50px'}} src={urslogo} alt="University Logo" />
                    <div className='urs-details'>
                        <p className='urs'>University Of Rizal System</p>
                        <p className='ursname'>{campus.name}</p>        
                    </div>
                </button>
            ))}
        </div>
    );  
};

export default CampusList;
