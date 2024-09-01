import React, { useState } from 'react';
import './ImageUploader.css';  // 별도의 CSS 파일을 사용하여 스타일링

const ImageUploader = ({ onGenerateMasks }) => {
  const [image, setImage] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [scaleFactors, setScaleFactors] = useState({ scaleX: 1, scaleY: 1 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setSelectedPoint(null); // 이미지 변경 시 이전에 선택된 좌표 초기화
  };

  const handleImageClick = (event) => {
    const imgElement = event.target;
    const rect = imgElement.getBoundingClientRect();

    // 이미지의 실제 크기와 화면에 표시된 크기 간의 비율 계산
    const scaleX = imgElement.naturalWidth / rect.width;
    const scaleY = imgElement.naturalHeight / rect.height;

    // 클릭한 위치를 이미지 좌표로 변환
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setSelectedPoint({ x, y });
    setScaleFactors({ scaleX, scaleY });
  };

  const handleGenerateMasks = () => {
    if (image && selectedPoint) {
      onGenerateMasks(image, selectedPoint);
    }
  };

  return (
    <div className={`image-uploader ${image ? 'image-uploaded' : ''}`} style={{ marginLeft: '30px', marginRight: '30px', marginTop: '80px' }}>
      {!image ? (
        <div className="upload-placeholder">
          <input 
            type="file" 
            accept="image/*" 
            id="file-input" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
          <label htmlFor="file-input" className="upload-label">
            <div className="upload-icon">+</div>
            <p>이미지를 업로드하고 마스크를 선택한 뒤 진행해주세요.</p>
          </label>
        </div>
      ) : (
        <div className="image-container" style={{ position: 'relative', display: 'inline-block', background: 'none', textAlign: 'center' }}>
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded"
            onClick={handleImageClick}
            style={{ cursor: 'crosshair', maxWidth: '100%', marginTop: '20px' }}
          />
          {selectedPoint && (
            <div
              style={{
                position: 'absolute',
                top: selectedPoint.y / scaleFactors.scaleY,
                left: selectedPoint.x / scaleFactors.scaleX,
                width: '10px',
                height: '10px',
                backgroundColor: 'red',
                borderRadius: '50%',
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
          )}
          <button 
            onClick={handleGenerateMasks} 
            style={{ 
              display: 'block', 
              marginTop: '20px', 
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: selectedPoint ? '#f0ad4e' : '#ccc', 
              color: 'white', 
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: selectedPoint ? 'pointer' : 'not-allowed',
            }} 
            disabled={!selectedPoint}
          >
            수정 범위 생성하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;