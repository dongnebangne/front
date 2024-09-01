import React from 'react';
import './MapLegend.css';

const MapLegend = ({ legendData }) => {
  console.log('Legend Data:', legendData);

  if (legendData && legendData.data) {
    console.log('legend:', legendData.data.legend);
    if (legendData.data.legend) {
      console.log('DETAIL:', legendData.data.legend.DETAIL);
      if (legendData.data.legend.DETAIL) {
        console.log('item:', legendData.data.legend.DETAIL.item);
      }
    }
  }

  // 예상되는 legendData 구조에 맞게 조건문 수정
  if (!legendData || !legendData.data || !legendData.data.legend || !legendData.data.legend.DETAIL || !legendData.data.legend.DETAIL.item) {
    console.log('No legend data available');
    return (
      <div className="legend-container">
        <h6>범례</h6>
        <svg xmlns="http://www.w3.org/2000/svg" width="123" height="2" viewBox="0 0 123 2" fill="none">
          <path d="M-11 1H135" stroke="#297F50" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <table className="legend-table">
          <tbody>
            <tr>
              <td colSpan="2">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="legend-container">
      <h6>범례</h6>
      <svg xmlns="http://www.w3.org/2000/svg" width="123" height="2" viewBox="0 0 123 2" fill="none">
        <path d="M-11 1H135" stroke="#297F50" stroke-width="2" stroke-linecap="round"/>
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
};

export default MapLegend;
