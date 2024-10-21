import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './api-config';

const MaskSelector = ({ masks, onInpaint, onRemove, prompt, setPrompt }) => {
  const [selectedMaskIdx, setSelectedMaskIdx] = useState(null);

  // 마스크가 변경되면 선택된 마스크와 프롬프트 초기화
  useEffect(() => {
    setSelectedMaskIdx(null);
    setPrompt('');
  }, [masks, setPrompt]);

  const handleMaskSelect = (idx) => {
    setSelectedMaskIdx(idx);
  };

  const handleInpaint = () => {
    if (selectedMaskIdx !== null && prompt) {
      onInpaint(selectedMaskIdx, prompt);
      setPrompt(''); // 작업 후 프롬프트 초기화
    } else {
      alert('프롬프트를 입력해 주세요.');
    }
  };

  const handleRemove = () => {
    if (selectedMaskIdx !== null) {
      onRemove(selectedMaskIdx); // remove action 수행
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
            src={`${API_BASE_URL}${mask.masked_image_url}`}
            alt={`Masked Image ${idx}`}
            onClick={() => handleMaskSelect(idx)}
            style={{
              cursor: 'pointer',
              margin: '10px',
              maxWidth: selectedMaskIdx === idx ? '60%' : '30%',
              boxShadow: selectedMaskIdx === idx ? '0px 0px 10px rgba(0, 0, 255, 0.5)' : 'none',
              transition: 'transform 0.2s, max-width 0.2s',
              transform: selectedMaskIdx === idx ? 'scale(1.1)' : 'scale(0.9)',
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
            placeholder="추천 프롬프트를 클릭하세요."
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

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button
              onClick={handleInpaint}
              style={{
                backgroundColor: prompt ? '#F7CF6B' : '#ccc',
                color: 'black',
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                cursor: prompt ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
                color: '#3E3D3D',
                marginRight: '10px', // 버튼 사이에 공간 추가
              }}
              disabled={!prompt}
            >
              &gt; 이미지 처리하기
            </button>

            <button
              onClick={handleRemove}
              style={{
                backgroundColor: '#F76B6B',
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
              &gt; 개체 지우기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MaskSelector;