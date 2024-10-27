import React from 'react';
import './MapLegend.css';

const MapLegend = ({ legendData, selectedLayer }) => {

  const customLegendItems = [
    { color: '#ffffb2', label: '1등급' },
    { color: '#fee88b', label: '2등급' },
    { color: '#fed165', label: '3등급' },
    { color: '#fdb751', label: '4등급' },
    { color: '#fd9b43', label: '5등급' },
    { color: '#fa7a35', label: '6등급' },
    { color: '#f45629', label: '7등급' },
    { color: '#ea3420', label: '8등급' },
    { color: '#d31a23', label: '9등급' },
    { color: '#bd0026', label: '10등급' },
  ];

  // 자취촌 범죄주의구간일 경우
  if (selectedLayer === '자취촌범죄주의구간') {
    return (
      <div className="legend-container">
        <h6>범례</h6>
        <svg xmlns="http://www.w3.org/2000/svg" width="123" height="2" viewBox="0 0 123 2" fill="none">
          <path d="M-11 1H135" stroke="#297F50" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <table className="legend-table">
          <tbody>
            {customLegendItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="color-block" style={{ backgroundColor: item.color }}></div>
                </td>
                <td>{item.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (legendData && legendData.data && legendData.data.legend && legendData.data.legend.DETAIL && legendData.data.legend.DETAIL.item) {
    return (
      <div className="legend-container">
        <h6>범례</h6>
        <svg xmlns="http://www.w3.org/2000/svg" width="123" height="2" viewBox="0 0 123 2" fill="none">
          <path d="M-11 1H135" stroke="#297F50" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <table className="legend-table">
          <tbody>
            {legendData.data.legend.DETAIL.item.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.IMG_NM.startsWith('#') ? (
                    <div className="color-block" style={{ backgroundColor: item.IMG_NM }}></div>
                  ) : (
                    <img src={`https://www.safemap.go.kr/images/legend/${item.IMG_NM}`} alt={item.LGD_NM} className="icon" />
                  )}
                </td>
                <td>{item.LGD_NM}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default MapLegend;
