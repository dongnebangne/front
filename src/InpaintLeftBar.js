import React, { useState } from "react";
import "./InpaintLeftBar.css"; // Import a separate CSS file for styling

const InpaintLeftBar = ({ setPrompt }) => {
    const [selectedCrime, setSelectedCrime] = useState('절도'); // 기본 선택은 절도

    const suggestions = {
        '절도': [
            'Paint the utility poles and security lights bright yellow, and install a cube-shaped number display light at the top.',
            'Paint the utility poles and security lights yellow, and use gobo lighting to project SOS signs or CCTV signs on the ground.',
            'Install a reflective mirror.'
        ],
        '성폭력': [
            '공공 장소의 CCTV 설치를 강화하세요.',
            'Install security lights equipped with CCTV, emergency bell buttons, and warning lights.',
            'Install an emergency bell switch at a height of about 1.2m to 1.4m on the utility poles, and mark an SOS sign on the ground in yellow.'
        ],
        '폭력': [
            'Install an emergency bell switch at a height of about 1.2m to 1.4m on the utility poles, and mark an SOS sign on the ground in yellow.',
            'Apply a yellow color to public phone booths.',
            'Install a road convex mirror'
        ]
    };

    const handleCrimeClick = (crime) => {
        setSelectedCrime(crime);
    };

    const handleSuggestionClick = (suggestion) => {
        setPrompt(suggestion); // 클릭한 제안 내용을 프롬프트에 설정
    };

    return (
        <div className="left-bar">
            <div className="CPTEDlogo">
                <img src="/SafecidLogo.svg" style={{ width: '100%', maxWidth: '150px', marginBottom: '20px' }} alt="Safe Sid Logo" />
                <p>서울 도봉구 쌍문 제1동</p>
            </div>
            <div className="crime-rank">
                <h3>많이 일어나는 범죄는 다음과 같습니다:</h3>
                <ul>
                    <li>
                        <button 
                            className={`crime-button ${selectedCrime === '절도' ? 'active' : ''}`}
                            onClick={() => handleCrimeClick('절도')}
                        >
                            1위: 절도
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`crime-button ${selectedCrime === '성폭력' ? 'active' : ''}`}
                            onClick={() => handleCrimeClick('성폭력')}
                        >
                            2위: 성폭력
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`crime-button ${selectedCrime === '폭력' ? 'active' : ''}`}
                            onClick={() => handleCrimeClick('폭력')}
                        >
                            3위: 폭력
                        </button>
                    </li>
                </ul>
            </div>
            <div className="recommendation">
                <h4>CPETED 제안</h4>
                <ul>
                    {suggestions[selectedCrime].map((suggestion, index) => (
                        <li 
                            key={index} 
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)} // 제안을 클릭했을 때 프롬프트 설정
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InpaintLeftBar;