import React from 'react';
import './MapType.css';

const MapType = ({ title, options, onSelect, selectedOption, legend }) => {
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

    const handleOptionChange = (event) => {
        onSelect(event.target.value);  // 선택된 옵션을 부모 컴포넌트로 전달
    };

    return (
        <div className="modal-content">
            <div className="modal-header">
                <h5>{title}</h5>
                <img src="/close_icon.png" alt="Close" className="close-icon" onClick={onSelect.bind(null, selectedOption)} />
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
                            onChange={handleOptionChange} 
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
    );
};

export default MapType;
