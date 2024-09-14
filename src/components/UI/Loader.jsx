import React from 'react';
import ReactDOM from 'react-dom';
import './Loader.css';

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="overlay">
      <div className="spinner"></div>
    </div>,
    document.getElementById('loader-root')
  );
};

export default Loader;
