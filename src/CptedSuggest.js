import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./CptedSuggest.css";

const CptedSuggest = ({ clickedAddress }) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/cpted-ai');
    };

    return (
        <div className="cpted-suggest">
            <h3>{clickedAddress}</h3>
            <p>많이 일어나는 범죄는 <br/> 다음과 같습니다</p>
            <div className="cpted-rank">
                <p>1위: 절도</p>
                <p>2위: 성폭력</p>                    
                <p>3위: 폭력</p>
            </div>
            <button className="cpted-button" onClick={handleButtonClick}>지역 개선하기</button>
        </div>
    
    );
};

export default CptedSuggest;
