import React, { useState } from 'react';

const MaskSelector = ({ masks, onInpaint }) => {
  const [selectedMaskIdx, setSelectedMaskIdx] = useState(null);
  const [prompt, setPrompt] = useState('');

  const handleMaskSelect = (idx) => {
    setSelectedMaskIdx(idx);
  };

  const handleInpaint = () => {
    if (selectedMaskIdx !== null) {
      onInpaint(selectedMaskIdx, prompt);
    }
  };

  return (
    <div className="mask-selector">
      <div className="mask-images">
        {masks.map((mask, idx) => (
          <img
            key={idx}
            src={mask.masked_image_url}  // 마스크된 이미지 경로만 사용
            alt={`Masked Image ${idx}`}
            onClick={() => handleMaskSelect(idx)}
            style={{
              cursor: 'pointer',
              border: selectedMaskIdx === idx ? '3px solid blue' : 'none',
              margin: '10px',
              maxWidth: '30%',
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
      <button onClick={handleInpaint} style={{ display: 'block', marginTop: '20px' }}>
        이미지 처리하기
      </button>
    </div>
  );
};

export default MaskSelector;