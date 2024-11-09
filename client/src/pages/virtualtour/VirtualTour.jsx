import React from 'react';
import AddCampus from './AddCampus';
import CampusList from './CampusList';
import '@/style.css';

const VirtualTour = () => {
  return (
    <div className='main-container' >
      <div style={{height: '100%', width: '80%'}}></div>
      <div style={{height: '100%',width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
      <AddCampus />
      <CampusList />
    </div>
    </div>
  );
};

export default VirtualTour;
