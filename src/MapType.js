import React from 'react';
import './MapType.css';

const MapType = ({ title, options, onClose, onOptionChange, selectedOption }) => {
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5>{title}</h5>
                    <img src="/close_icon.svg" alt="Close" className="close-icon" onClick={onClose} />
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="146" height="2" viewBox="0 0 146 2" fill="none">
                    <path d="M0 1H146" stroke="#297F50" strokeWidth="2" strokeLinecap="round"/>
                </svg>
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