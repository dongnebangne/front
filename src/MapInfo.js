import React from 'react';
import './MapInfo.css';

const MapInfo = ({ title, description, onClose }) => {
    return (
        <div className="info-modal-overlay" onClick={onClose}>
            <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="info-modal-header">
                    <h3>{title}</h3>
                    <img src="/close_icon.png" alt="Close" className="info-close-icon" onClick={onClose} />
                </div>
                <hr className="info-modal-divider"/>
                <p dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
        </div>
    );
};

export default MapInfo;
