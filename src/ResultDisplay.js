import React from 'react';

const ResultDisplay = ({ imageUrl, isLoading, onRetry }) => {
  return (
    <div className="result-display">
      {isLoading ? (
        <div className="loading-indicator">
          <p>이미지를 처리 중입니다. 잠시만 기다려 주세요...</p>
          <div className="spinner" />
        </div>
      ) : imageUrl ? (
        <div>
          <img src={imageUrl} alt="Processed Result" style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} />
          <button
            onClick={onRetry}
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
              cursor: 'pointer',
            }}
          >
            다시하기
          </button>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default ResultDisplay;