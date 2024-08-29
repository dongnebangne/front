import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './api-config';

const MaskSelector = ({ masks, onInpaint, prompt, setPrompt }) => {
  const [selectedMaskIdx, setSelectedMaskIdx] = useState(null);

  useEffect(() => {
    // 마스크 선택 시 프롬프트 입력 초기화
    if (selectedMaskIdx === null) {
      setPrompt('');
    }
  }, [selectedMaskIdx, setPrompt]);

  const handleMaskSelect = (idx) => {
    setSelectedMaskIdx(idx);
  };

  const handleInpaint = () => {
    if (selectedMaskIdx !== null) {
      onInpaint(selectedMaskIdx, prompt);
      setPrompt(''); // 작업 후 프롬프트 초기화
    } else {
      alert('마스크를 선택해 주세요.');
    }
  };

  return (
    <div className="mask-selector">
      <div className="mask-images" style={{ textAlign: 'center' }}>
        {selectedMaskIdx === null ? (
          <p style={{ fontSize: '18px', color: '#555' }}>다음 중 원하는 마스크 이미지를 선택하세요.</p>
        ) : null}
        
        {masks.map((mask, idx) => (
          <img
            key={idx}
            src={`${API_BASE_URL}${mask.masked_image_url}`} // 올바른 경로로 수정
            alt={`Masked Image ${idx}`}
            onClick={() => handleMaskSelect(idx)}
            style={{
              cursor: 'pointer',
              border: selectedMaskIdx === idx ? '3px solid blue' : 'none',
              margin: '10px',
              maxWidth: '30%',
              boxShadow: selectedMaskIdx === idx ? '0px 0px 10px rgba(0, 0, 255, 0.5)' : 'none',
              transition: 'transform 0.2s',
              transform: selectedMaskIdx === idx ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ))}
      </div>
      
      {selectedMaskIdx !== null && (
        <>
          <input
            type="text"
            placeholder="프롬프트를 입력하세요."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleInpaint}
            style={{
              display: 'block',
              marginTop: '20px',
              backgroundColor: 'orange',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            이미지 처리하기
          </button>
        </>
      )}
    </div>
  );
};

export default MaskSelector;