import React from 'react';

const ResultDisplay = ({ imageUrl, isLoading }) => {
  return (
    <div className="result-display">
      {isLoading ? (
        <p>Processing the image, please wait...</p>  // 로딩 중 메시지 추가
      ) : imageUrl ? (
        <div>
          <h3>Processed Image:</h3>
          <img src={imageUrl} alt="Processed Result" style={{ maxWidth: '100%', marginTop: '20px' }} />
        </div>
      ) : (
        <p>No result yet. Upload an image, select a mask, and click to process.</p>  // 메시지 수정
      )}
    </div>
  );
};

export default ResultDisplay;