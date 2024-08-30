import React, { useState, useContext } from 'react';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import { API_BASE_URL } from './api-config';
import MaskSelector from './MaskSelector';
import InpaintLeftBar from './InpaintLeftBar';  // Import the sidebar
import { AddressContext } from './AddressContext';

const CptedAI = () => {
  const [masks, setMasks] = useState([]);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(''); // 프롬프트 상태 추가
  const { clickedAddress } = useContext(AddressContext);

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
      setMasks(data.masks);
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
    <div className="cpted-ai-container" style={{ display: 'flex' }}>
      <InpaintLeftBar setPrompt={setPrompt} clickedAddress={clickedAddress}/> {/* setPrompt 전달 */}
      <div className="cpted-ai-content" style={{ flex: 1, padding: '20px' }}>
        <h2>지역 개선하기</h2>
        <hr/>
        {!masks.length && <ImageUploader onGenerateMasks={handleGenerateMasks} />}
        {masks.length > 0 && (
          <MaskSelector masks={masks} onInpaint={handleInpaint} prompt={prompt} setPrompt={setPrompt} />
        )}
        {loading ? <p>Processing...</p> : <ResultDisplay imageUrl={processedImageUrl} isLoading={loading} />}
      </div>
    </div>
  );
};

export default CptedAI;