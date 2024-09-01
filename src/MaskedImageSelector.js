import React, { useState } from 'react';
import { API_BASE_URL } from './api-config';

const MaskedImageSelector = ({ onMaskSelect }) => {
  const [maskedImages, setMaskedImages] = useState([]);
  const [selectedMaskIndex, setSelectedMaskIndex] = useState(null);

  const handleGenerateMasks = async (image, point) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('point_coords', `${point.x},${point.y}`);
    formData.append('point_labels', '1');
    formData.append('dilate_kernel_size', '15');
    formData.append('sam_model_type', 'vit_h');
    formData.append('sam_ckpt', './pretrained_models/sam_vit_h_4b8939.pth');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-masks/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate masks');
      }

      const data = await response.json();
      setMaskedImages(data.masks);
    } catch (error) {
      console.error('Error generating masks:', error);
    }
  };

  const handleMaskClick = (index) => {
    setSelectedMaskIndex(index);
    onMaskSelect(index); // 선택된 마스크 인덱스를 상위 컴포넌트로 전달
  };

  return (
    <div className="masked-image-selector">
      <button onClick={() => handleGenerateMasks()}>영역 나누기</button>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        {maskedImages.map((mask, index) => (
          <img
            key={index}
            src={mask.masked_image_url}
            alt={`Masked Image ${index}`}
            style={{
              border: selectedMaskIndex === index ? '2px solid blue' : '2px solid transparent',
              cursor: 'pointer',
            }}
            onClick={() => handleMaskClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MaskedImageSelector;