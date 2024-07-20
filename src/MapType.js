import React, { useEffect, useState } from 'react';
import './MapType.css';

const MapType = ({ title, options, onClose, onOptionChange, selectedOption }) => {
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5>{title}</h5>
                    <img src="/close_icon.png" alt="Close" className="close-icon" onClick={onClose} />
                </div>
                <hr className="modal-divider"/>
                <div className="checkbox-container">
                    {options.map((option, index) => (
                        <div key={index} className="checkbox-item">
                            <input
                                type="radio"
                                id={option}
                                name="crime-category"
                                value={option}
                                checked={selectedOption === option}
                                onChange={onOptionChange}
                            />
                            <label htmlFor={option}>{option}</label>
                        </div>
                    ))}
                </div> 
            </div>
        </div>
    );
};

export default MapType;