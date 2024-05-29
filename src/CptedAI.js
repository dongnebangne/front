import React, { useState } from 'react';
import './CptedAI.css'; 

const CptedAI = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setSelectedImage(URL.createObjectURL(img));
        }
    };

    const handleImageGeneration = () => {
        // 새로운 이미지를 생성하는 로직
        alert("지역 개선하는 중..");
    };

    return (
        <div className="cptedAI">
            <header className="header">
                <h2>Safe-CID</h2>
            </header>
            <h1>지역 개선하기</h1>
            <div className="AI-content">
                <div className="upload-section">
                    <label htmlFor="upload-button" className="upload-label">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Selected" className="uploaded-image" />
                        ) : (
                            '사진 불러오기'
                        )}
                    </label>
                    <input
                        type="file"
                        id="upload-button"
                        className="upload-input"
                        onChange={handleImageUpload}
                    />
                    <div className="suggestion-box">
                        <p>CPTED 제안을 선택해주세요.</p>
                    </div>
                </div>
                <button onClick={handleImageGeneration} className="arrow-button">
                    <img src="/arrow_icon.png" alt="Generate" className="arrow-icon" />
                </button>
                <div className="placeholder">
                    {/* 생성된 이미지의 자리 */}
                </div>
            </div>
        </div>
    );
};

export default CptedAI;
