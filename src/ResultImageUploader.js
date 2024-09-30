// import React, { useState } from 'react';

// const ResultImageUploader = ({ resultImage, onGenerateMasks }) => {
//   const [selectedPoint, setSelectedPoint] = useState(null);
//   const [scaleFactors, setScaleFactors] = useState({ scaleX: 1, scaleY: 1 });

//   const handleImageClick = (event) => {
//     const imgElement = event.target;
//     const rect = imgElement.getBoundingClientRect();

//     // 이미지의 실제 크기와 화면에 표시된 크기 간의 비율 계산
//     const scaleX = imgElement.naturalWidth / rect.width;
//     const scaleY = imgElement.naturalHeight / rect.height;

//     // 클릭한 위치를 이미지 좌표로 변환
//     const x = (event.clientX - rect.left) * scaleX;
//     const y = (event.clientY - rect.top) * scaleY;

//     setSelectedPoint({ x, y });
//     setScaleFactors({ scaleX, scaleY });
//   };

//   const handleGenerateMasks = () => {
//     if (resultImage && selectedPoint) {
//       // resultImage를 클릭하고, 마스크 생성을 위한 좌표를 전달
//       onGenerateMasks(resultImage, selectedPoint);
//     }
//   };

//   return (
//     <div className="result-image-uploader" style={{ textAlign: 'center', marginTop: '20px' }}>
//       <div style={{ position: 'relative', display: 'inline-block' }}>
//         <img
//           src={resultImage}
//           alt="Processed Result"
//           onClick={handleImageClick}
//           style={{ cursor: 'crosshair', maxWidth: '100%', marginTop: '20px' }}
//         />
//         {selectedPoint && (
//           <div
//             style={{
//               position: 'absolute',
//               top: selectedPoint.y / scaleFactors.scaleY,
//               left: selectedPoint.x / scaleFactors.scaleX,
//               width: '10px',
//               height: '10px',
//               backgroundColor: 'red',
//               borderRadius: '50%',
//               pointerEvents: 'none',
//               transform: 'translate(-50%, -50%)',
//             }}
//           ></div>
//         )}
//       </div>
//       <button
//         onClick={handleGenerateMasks}
//         style={{
//           display: 'block',
//           marginTop: '20px',
//           marginLeft: 'auto',
//           marginRight: 'auto',
//           backgroundColor: selectedPoint ? '#f0ad4e' : '#ccc',
//           color: 'white',
//           padding: '10px 20px',
//           borderRadius: '5px',
//           border: 'none',
//           cursor: selectedPoint ? 'pointer' : 'not-allowed',
//         }}
//         disabled={!selectedPoint}
//       >
//         수정 범위 생성하기
//       </button>
//     </div>
//   );
// };

// export default ResultImageUploader;

import React, { useState } from 'react';

const ResultImageUploader = ({ resultImage, onGenerateMasks, masks, setMasks }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [scaleFactors, setScaleFactors] = useState({ scaleX: 1, scaleY: 1 });

  // 이미지 클릭 시 좌표 처리
  const handleImageClick = (event) => {
    const imgElement = event.target;
    const rect = imgElement.getBoundingClientRect();

    // 이미지 실제 크기와 화면에 표시된 크기 차이를 계산하여 클릭 좌표 변환
    const scaleX = imgElement.naturalWidth / rect.width;
    const scaleY = imgElement.naturalHeight / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setSelectedPoint({ x, y });
    setScaleFactors({ scaleX, scaleY });
  };

  // 마스크 생성 처리
  const handleGenerateMasks = async () => {
    if (resultImage && selectedPoint) {
      try {
        const generatedMasks = await onGenerateMasks(resultImage, selectedPoint);
        if (generatedMasks) {
          // 성공적으로 마스크가 생성된 경우, 기존 마스크에 추가
          setMasks([...masks, ...generatedMasks]);
        }
      } catch (error) {
        console.error('Error generating masks:', error);
      }
    }
  };

  return (
    <div className="result-image-uploader" style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* 이미지 위에 클릭 가능한 인터페이스 */}
        <img
          src={resultImage}
          alt="Processed Result"
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
  );
};

export default ResultImageUploader;

