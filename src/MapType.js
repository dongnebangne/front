import React, { useEffect, useState } from 'react';
import './MapType.css';

const MapType = ({ title, options, onClose, onOptionChange, selectedOption, legend }) => {
    const [legendData, setLegendData] = useState(null);

    useEffect(() => {
        const fetchLegend = async () => {
            if (legend) {
                try {
                    const response = await fetch(legend);
                    const text = await response.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(text, "application/xml");
                    const items = xmlDoc.getElementsByTagName("item");
                    const parsedLegendData = Array.from(items).map(item => {
                        const color = item.getElementsByTagName("IMG_NM")[0].textContent;
                        const label = item.getElementsByTagName("LGD_NM")[0].textContent;
                        return { color, label };
                    });
                    setLegendData(parsedLegendData);
                } catch (error) {
                    console.error("Failed to fetch legend data:", error);
                }
            }
        };
        fetchLegend();
    }, [legend]);

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
                {legendData && (
                    <div className="legend-container">
                        <h6>범례</h6>
                        <table className="legend-table">
                            <tbody>
                                {legendData.reduce((rows, item, index) => {
                                    if (index % 2 === 0) {
                                        rows.push([item]);
                                    } else {
                                        rows[rows.length - 1].push(item);
                                    }
                                    return rows;
                                }, []).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((item, colIndex) => (
                                            <td key={colIndex} style={{ backgroundColor: item.color, textAlign: 'center', color: 'black' }}>
                                                {item.label}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapType;

