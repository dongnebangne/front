import React, { useState } from "react";
import "./InpaintLeftBar.css"; // Import a separate CSS file for styling

const InpaintLeftBar = ({ setPrompt, clickedAddress }) => {
    const [selectedCrime, setSelectedCrime] = useState('절도'); // 기본 선택은 절도

    const suggestions = {
        '절도': [
            { 
                korean: '전신주와 보안등을 밝은 노랑색으로 도색하고, 상단에 정육면체 형태의 번호 표시등을 설치한다.',
                english: 'Paint the utility poles and security lights bright yellow, and install a cube-shaped number display light at the top.'
            },
            { 
                korean: '전신주의 1.2m~1.4m 정도 위치에 비상벨 스위치를 설치하고 바닥에 노란색으로 SOS 사인을 표시한다.',
                english: 'Install an emergency bell switch at a height of about 1.2m to 1.4m on the utility poles, and mark an SOS sign on the ground in yellow.'
            },
            { 
                korean: '전신주와 보안등은 노란색으로 도색하고 고보조명을 이용하여 SOS 사인 또는 CCTV 사인을 바닥에 표시한다.',
                english: 'Paint the utility poles and security lights yellow, and use gobo lighting to project SOS signs or CCTV signs on the ground.'
            }
        ],
        '성폭력': [
            { 
                korean: '전신주와 보안등을 밝은 노랑색으로 도색하고, 상단에 정육면체 형태의 번호 표시등을 설치한다.',
                english: 'Paint the utility poles and security lights bright yellow, and install a cube-shaped number display light at the top.'
            },
            { 
                korean: 'CCTV와 비상벨 버튼, 경광등이 탑재된 보안등을 설치한다.',
                english: 'Install security lights equipped with CCTV, emergency bell buttons, and warning lights.'
            },
            { 
                korean: '전신주와 보안등은 노란색으로 도색하고 고보조명을 이용하여 SOS 사인 또는 CCTV 사인을 바닥에 표시한다.',
                english: 'Paint the utility poles and security lights yellow, and use gobo lighting to project SOS signs or CCTV signs on the ground.'
            }
        ],
        '폭력': [
            { 
                korean: 'CCTV와 비상벨 버튼, 경광등이 탑재된 보안등을 설치한다.',
                english: 'Install security lights equipped with CCTV, emergency bell buttons, and warning lights.'
            },
            { 
                korean: '공중전화 부스에 노란 색상을 적용한다.',
                english: 'Apply a yellow color to public phone booths.'
            },
            { 
                korean: '반사경을 설치한다.',
                english: 'Install a reflective mirror.'
            }
        ]
    };

    const handleCrimeClick = (crime) => {
        setSelectedCrime(crime);
    };

    const handleSuggestionClick = (suggestion) => {
        setPrompt(suggestion.english); // 클릭한 제안의 영어 내용을 프롬프트에 설정
    };

    return (
        <div className="left-bar">
            <img src="/safecid_logo.svg" style={{ width: '100%', maxWidth: '150px', marginBottom: '20px' }} alt="Safe Sid Logo" />
            <div className="address-box">
                <p>{clickedAddress}</p>
            </div>
            <div className="crime-rank">
                <p>많이 일어나는 범죄는 다음과 같습니다:</p>
                <ul>
                    <li>
                        <button 
                            className={`crime-button ${selectedCrime === '절도' ? 'active' : ''}`}
                            onClick={() => handleCrimeClick('절도')}
                        >
                            <span>1위:</span> 절도
                            <input
                                type="radio"
                                name="crime"
                                checked={selectedCrime === '절도'}
                                onChange={() => handleCrimeClick('절도')}
                            />
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`crime-button ${selectedCrime === '성폭력' ? 'active' : ''}`}
                            onClick={() => handleCrimeClick('성폭력')}
                        >
                            <span>2위:</span> 성폭력
                            <input
                                type="radio"
                                name="crime"
                                checked={selectedCrime === '성폭력'}
                                onChange={() => handleCrimeClick('성폭력')}
                            />
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`crime-button ${selectedCrime === '폭력' ? 'active' : ''}`}
                            onClick={() => handleCrimeClick('폭력')}
                        >
                            <span>3위:</span> 폭력
                            <input
                                type="radio"
                                name="crime"
                                checked={selectedCrime === '폭력'}
                                onChange={() => handleCrimeClick('폭력')}
                            />
                        </button>
                    </li>
                </ul>
                <p className="instruction-text">
                개선을 원하는 범죄를 선택하면 <br/>
                해당 범죄를 예방하기 위한 CPTED 디자인을 <br/>
                제안해 드립니다.
                </p>
            </div>
            <div className="recommendation">
                <h4>CPTED 제안</h4>
                <ul>
                    {suggestions[selectedCrime].map((suggestion, index) => (
                        <li 
                            key={index} 
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)} // 제안을 클릭했을 때 영어로 번역된 프롬프트 설정
                            style={{boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25) inset',}}
                        >
                            {suggestion.korean} {/* UI에는 한글로 출력 */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InpaintLeftBar;