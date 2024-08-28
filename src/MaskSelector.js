import React, { useState } from 'react';
import { API_BASE_URL } from './api-config';

const MaskSelector = ({ masks, onInpaint }) => {
  const [selectedMaskIdx, setSelectedMaskIdx] = useState(null);
  const [prompt, setPrompt] = useState('');

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
      <div className="mask-images">
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
      <input
        type="text"
        placeholder="Enter a prompt (optional)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ marginTop: '20px', width: '100%' }}
      />
      <button
        onClick={handleInpaint}
        style={{
          display: 'block',
          marginTop: '20px',
          backgroundColor: selectedMaskIdx !== null ? 'blue' : 'gray',
          color: 'white',
          cursor: selectedMaskIdx !== null ? 'pointer' : 'not-allowed',
        }}
        disabled={selectedMaskIdx === null}
      >
        이미지 처리하기
      </button>
    </div>
  );
};

export default MaskSelector;