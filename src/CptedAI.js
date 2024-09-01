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
    <div className="cpted-ai-container" style={{ display: 'flex', marginRight: '30px', marginBottom: '100px'}}>
      <InpaintLeftBar setPrompt={setPrompt} clickedAddress={clickedAddress}/> {/* setPrompt 전달 */}
      <div className="cpted-ai-content" style={{ flex: 1, padding: '20px' }}>
        <h2 style={{ textAlign: 'left', paddingLeft: '30px' }}>지역 개선하기</h2>
        <hr style={{marginLeft: '30px', background: 'rgba(41, 127, 80, 0.40)', height: '1px'}}/>
        <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginTop: '10px', textAlign: 'left', paddingLeft: '30px' }}>
        지역 개선하기는 범죄 별로 CPTED 디자인을 제안하고 직접 이미지에 적용할 수 있는 서비스입니다.
        <br/>
        CPTED는 Crime Prevention Through Environmental Design의 약자로 "범죄 예방 환경 설계"를 의미합니다.
        <br/>
        CTED 디자인을 적용하고 싶은 지역의 이미지를 업로드 후 원하는 CPTED 디자인을 작성해주세요!
        </p>
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