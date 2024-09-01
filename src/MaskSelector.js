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
    <div className="mask-selector" style={{ marginTop: '80px' }}>
      <div className="mask-images" style={{ textAlign: 'center' }}>
        
        
        {masks.map((mask, idx) => (
          <img
            key={idx}
            src={`${API_BASE_URL}${mask.masked_image_url}`} // 올바른 경로로 수정
            alt={`Masked Image ${idx}`}
            onClick={() => handleMaskSelect(idx)}
            style={{
              cursor: 'pointer',
              margin: '10px',
              maxWidth: selectedMaskIdx === idx ? '60%' : '30%', // 선택된 이미지는 더 크게, 선택되지 않은 이미지는 작게 표시
              boxShadow: selectedMaskIdx === idx ? '0px 0px 10px rgba(0, 0, 255, 0.5)' : 'none',
              transition: 'transform 0.2s, max-width 0.2s', // 크기 변경 시 부드러운 전환을 위해 transform과 max-width에 트랜지션 추가
              transform: selectedMaskIdx === idx ? 'scale(1.1)' : 'scale(0.9)', // 선택된 이미지는 약간 확대, 선택되지 않은 이미지는 축소
            }}
          />
        ))}
        {selectedMaskIdx === null ? (
          <p style={{ fontSize: '18px', color: '#555' }}>다음 중 원하는 마스크 이미지를 선택하세요.</p>
        ) : null}
      </div>

      {selectedMaskIdx !== null && (
        <>
          <input
            type="text"
            placeholder="프롬프트를 입력하세요."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              backgroundColor: '#E6E6E6',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25) inset',
              marginTop: '20px',
              marginLeft: '30px',
              marginRight: '30px',
              width: '100%',
              padding: '10px',
              paddingLeft: '20px',
              fontSize: '16px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleInpaint}
            style={{
              display: 'block',
              marginTop: '20px',
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: '#F7CF6B',
              color: 'black',
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
              color: '#3E3D3D',
            }}
          >
             &gt; 이미지 처리하기
          </button>
        </>
      )}
    </div>
  );
};

export default MaskSelector;