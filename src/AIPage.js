import React, { useState } from 'react';
import './AIPage.css';

const AIPage = () => {
    const [generatedImage, setGeneratedImage] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    const handleImageGeneration = async () => {
        alert("지역 개선하는 중...");

        try {
            const response = await fetch('http://localhost:8000/api/generate-image/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (!response.ok) {
                console.error("Error starting prediction:", result);
                setResponseMessage("이미지 생성에 실패했습니다.");
                return;
            }

            console.log('Generated Image URL:', result.image_url);
            if (result.image_url) {
                setGeneratedImage(result.image_url);
                setResponseMessage("이미지 생성이 성공적으로 완료되었습니다.");
            } else {
                setResponseMessage("이미지 생성에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error generating image:", error);
            setResponseMessage("이미지 생성에 실패했습니다.");
        }
    };

    return (
        <div className="aiPage">
            <header className="header">
                <h2>Safe-CID</h2>
            </header>
            <h1>지역 개선하기</h1>
            <div className="AI-content">
                <button onClick={handleImageGeneration} className="arrow-button">
                    <img src="/arrow_icon.png" alt="Generate" className="arrow-icon" />
                </button>
                <div className="placeholder">
                    {responseMessage && <p>{responseMessage}</p>}
                    {generatedImage && <img src={generatedImage} alt="Generated" className="generated-image" />}
                </div>
            </div>
        </div>
    );
};

export default AIPage;