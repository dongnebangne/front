import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import { API_BASE_URL } from './api-config';
import MaskSelector from './MaskSelector';  // 새로 추가된 컴포넌트

const CptedAI = () => {
  const [masks, setMasks] = useState([]);  // 마스크 정보를 저장할 상태
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateMasks = async (image, point) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('point_coords', `${point.x},${point.y}`);
    formData.append('point_labels', '1');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-masks/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setMasks(data.masks);  // 마스크 정보를 상태에 저장
    } catch (error) {
      console.error('Error generating masks:', error);
      alert('An error occurred while generating masks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInpaint = async (selectedMaskIdx, prompt) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('selected_mask_idx', selectedMaskIdx);
    formData.append('text_prompt', prompt);

    try {
      const response = await fetch(`${API_BASE_URL}/inpaint-image/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setProcessedImageUrl(`${API_BASE_URL}${data.inpainted_image_url}`);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('An error occurred while processing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cpted-ai">
      <h2>Inpaint Image using CptedAI</h2>
      {!masks.length && <ImageUploader onGenerateMasks={handleGenerateMasks} />}
      {masks.length > 0 && (
        <MaskSelector masks={masks} onInpaint={handleInpaint} />  // 마스크 선택 화면 추가
      )}
      {loading ? <p>Processing...</p> : <ResultDisplay imageUrl={processedImageUrl} isLoading={loading} />}
    </div>
  );
};

export default CptedAI;