import React from 'react';

const ResultDisplay = ({ imageUrl, isLoading, error }) => {
  return (
    <div className="result-display">
      {isLoading ? (
        <div className="loading-indicator">
          <p>Processing the image, please wait...</p>
          <div className="spinner" />
        </div>
      ) : error ? (
        <p style={{ color: 'red' }}>An error occurred: {error}</p>  // 에러 메시지 표시
      ) : imageUrl ? (
        <div>
          
          <img src={imageUrl} alt="Processed Result" style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} />
          <button
            disabled={true}
            style={{
              display: 'block',
              marginTop: '50px',
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: '#F7CF6B',
              color: 'black',
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '16px',
              boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
              color: '#3E3D3D'
            }}
          >
             이미지 생성 완료
          </button>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default ResultDisplay;