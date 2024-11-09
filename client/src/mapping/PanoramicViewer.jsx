// PanoramicViewer.jsx
import React, { useEffect, useRef } from 'react';
import Marzipano from 'marzipano'; // Make sure to install marzipano

const PanoramicViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  
  useEffect(() => {
    if (viewerRef.current) {
      // Initialize the viewer
      const panoElement = viewerRef.current;
      const viewer = new Marzipano.Viewer(panoElement);
      const source = Marzipano.ImageUrlSource.fromString(imageUrl);
      const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
      const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
      const view = new Marzipano.RectilinearView({ yaw: Math.PI }, limiter);
      const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
      }); 
      scene.switchTo();
    }
  }, [imageUrl]);

  return (
    <div id="pano" style={{ position: 'absolute', width: '100%', height: '500px', zIndex: '100' }} ref={viewerRef}></div>
  );
};

export default PanoramicViewer;
