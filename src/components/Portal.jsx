// src/components/Portal.js
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const [wrapper, setWrapper] = useState(null);

  useEffect(() => {
    // Create a new div element to serve as the portal's target
    const portalWrapper = document.createElement('div');
    document.body.appendChild(portalWrapper);
    setWrapper(portalWrapper);

    // Clean up the portal wrapper on component unmount
    return () => {
      document.body.removeChild(portalWrapper);
    };
  }, []);

  if (!wrapper) {
    return null;
  }

  return createPortal(children, wrapper);
};

export default Portal;