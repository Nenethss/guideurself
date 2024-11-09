import React from 'react';
import PanelLayout from "../pages/layouts/PanelLayout";
import Virtual from './Virtual';
import { Outlet } from 'react-router-dom'; 

const Campus = () => {
  return (
    <PanelLayout>
      <div style={{ height: '100%' }}> 
        <Virtual />
      </div>
      <Outlet />
    </PanelLayout>
  );
};

export default Campus;
