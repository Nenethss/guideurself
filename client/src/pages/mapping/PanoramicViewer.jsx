import React, { useEffect, useRef } from 'react';
import Marzipano from 'marzipano'; 

const PanoramicViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  
  useEffect(() => {
    if (viewerRef.current) {
      const panoElement = viewerRef.current;
      const viewer = new Marzipano.Viewer(panoElement);
      const source = Marzipano.ImageUrlSource.fromString(imageUrl);
      const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
      const limiter = Marzipano.RectilinearView.limit.pitch(-0.300, 0.300);
      const view = new Marzipano.RectilinearView({ yaw: Math.PI, pitch: 0 }, limiter);
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
