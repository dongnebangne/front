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
          <h3>Processed Image:</h3>
          <img src={imageUrl} alt="Processed Result" style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} />
        </div>
      ) : (
        <p>No result yet. Upload an image, select a mask, and click to process.</p>
      )}
    </div>
  );
};

export default ResultDisplay;