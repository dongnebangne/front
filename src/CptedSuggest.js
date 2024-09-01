import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CptedSuggest.css";

const CptedSuggest = ({ clickedAddress, selectedFeature }) => {
    const navigate = useNavigate();
    const [crimeRanks, setCrimeRanks] = useState([]);

    useEffect(() => {
        if (selectedFeature) {
            const crviol = selectedFeature.get('CRVIOL');
            const crtheft = selectedFeature.get('CRTHEFT');
            const crsex = selectedFeature.get('CRSEX');

            // 범죄 유형과 값을 쌍으로 배열로 만듦
            const crimes = [
                { type: '폭력', value: crviol },
                { type: '절도', value: crtheft },
                { type: '성폭력', value: crsex }
            ];

            // 값을 기준으로 정렬, 값이 같을 경우 CRVIOL > CRTHEFT > CRSEX 우선 순위 적용
            crimes.sort((a, b) => b.value - a.value || (a.type === '폭력' ? -1 : (a.type === '절도' ? -1 : 1)));

            setCrimeRanks(crimes);
        }
    }, [selectedFeature]);

    const handleButtonClick = () => {
        navigate('/cpted-ai');
    };

    return (
        <div className="cpted-suggest">
            <h3>{clickedAddress}</h3>
            <p>많이 일어나는 범죄는 <br/> 다음과 같습니다</p>
            <div>
                {crimeRanks.map((crime, index) => (
                    <p key={index}>{index + 1}위: {crime.type}</p>
                ))}
            </div>
            <button className="cpted-button" onClick={handleButtonClick}>지역 개선하기</button>
        </div>
    );
};

export default CptedSuggest;