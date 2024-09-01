import React from 'react';
import './MapInfo.css';

const MapInfo = ({ title, description, onClose }) => {
    return (
        <div className="info-modal-overlay" onClick={onClose}>
            <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="info-modal-header">
                    <h3>{title}</h3>
                    <img src="/close_icon.svg" alt="Close" className="info-close-icon" onClick={onClose} />
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="400" height="2" viewBox="0 0 400 2" fill="none">
                    <path d="M-16 1H416" stroke="#297F50" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
        </div>
    );
};

export default MapInfo;
