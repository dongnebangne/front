import React, { useState } from 'react';
import './CptedAI.css';

const CptedAI = () => {
    const [generatedImage, setGeneratedImage] = useState(null);

    const handleImageGeneration = async () => {
        alert("지역 개선하는 중...");

        try {
            const response = await fetch('http://localhost:8000/generate-image/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Error starting prediction:", error);
                alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
                return;
            }

            const result = await response.json();
            setGeneratedImage(result.image_url);
        } catch (error) {
            console.error("Error generating image:", error);
            alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="cptedAI">
            <header className="header">
                <h2>Safe-CID</h2>
            </header>
            <h1>지역 개선하기</h1>
            <div className="AI-content">
                <button onClick={handleImageGeneration} className="arrow-button">
                    <img src="/arrow_icon.png" alt="Generate" className="arrow-icon" />
                </button>
                <div className="placeholder">
                    {generatedImage && <img src={generatedImage} alt="Generated" className="generated-image" />}
                </div>
            </div>
        </div>
    );
};

export default CptedAI;