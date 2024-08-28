import React, { useState } from 'react';

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
    <div className="image-uploader">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
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
        </div>
      )}
      <button onClick={handleGenerateMasks} style={{ display: 'block', marginTop: '20px' }}>
        영역 분할하기
      </button>
    </div>
  );
};

export default ImageUploader;