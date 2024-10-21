import React, { useState, useContext } from 'react';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import { API_BASE_URL } from './api-config';
import MaskSelector from './MaskSelector';
import InpaintLeftBar from './InpaintLeftBar'; 
import { AddressContext } from './AddressContext';
import { PulseLoader } from 'react-spinners';

const CptedAI = () => {
  const [image, setImage] = useState(null); // 이미지 상태 추가
  const [masks, setMasks] = useState([]);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(''); 
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
  
      // 각 마스크 이미지 URL에 timestamp 쿼리 파라미터 추가하여 캐시 방지
      const masksWithTimestamp = data.masks.map(mask => ({
        ...mask,
        masked_image_url: `${mask.masked_image_url}?timestamp=${new Date().getTime()}`
      }));
      
      setMasks(masksWithTimestamp);
    } catch (error) {
      console.error('Error generating masks:', error);
      alert('마스크 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
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
      alert('이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (selectedMaskIdx) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('selected_mask_idx', selectedMaskIdx);

    try {
      const response = await fetch(`${API_BASE_URL}/remove-object/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setProcessedImageUrl(`${API_BASE_URL}${data.removed_image_url}`);
    } catch (error) {
      console.error('Error removing object:', error);
      alert('객체 제거 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 추가: 다시하기 핸들러
  const handleRetry = () => {
    setImage(null); // 이미지 상태 초기화
    setMasks([]);
    setProcessedImageUrl(null);
    setPrompt('');
  };

  return (
    <div className="cpted-ai-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '85vh', marginRight: '30px', marginBottom: '100px'}}>
      <InpaintLeftBar setPrompt={setPrompt} clickedAddress={clickedAddress}/> 
      <div className="cpted-ai-content" style={{ flex: 1, padding: '20px' }}>
        <h2 style={{ textAlign: 'left', paddingLeft: '30px' }}>지역 개선하기</h2>
        <hr style={{marginLeft: '30px', background: 'rgba(41, 127, 80, 0.40)', height: '1px'}}/>
        <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginTop: '10px', textAlign: 'left', paddingLeft: '30px' }}>
          지역 개선하기는 범죄 별로 CPTED 디자인을 제안하고 직접 이미지에 적용할 수 있는 서비스입니다.
          <br/>
          CPTED는 Crime Prevention Through Environmental Design의 약자로 "범죄 예방 환경 설계"를 의미합니다.
          <br/>
          CPTED 디자인을 적용하고 싶은 지역의 이미지를 업로드 후 원하는 CPTED 디자인을 작성해주세요!
        </p>
        {!masks.length && (
          <ImageUploader 
            image={image} 
            setImage={setImage} 
            onGenerateMasks={handleGenerateMasks} 
          />
        )}
        {masks.length > 0 && !processedImageUrl && (
          <MaskSelector 
            masks={masks} 
            onInpaint={handleInpaint} 
            onRemove={handleRemove} 
            prompt={prompt} 
            setPrompt={setPrompt} 
          />
        )}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <PulseLoader color={"#36D7B7"} loading={loading} size={15} />
          </div>
        ) : (
          processedImageUrl && <ResultDisplay imageUrl={processedImageUrl} isLoading={loading} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
};

export default CptedAI;