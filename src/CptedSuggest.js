import React from 'react';
import { useNavigate } from 'react-router-dom';

const CptedSuggest = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/cpted-ai');
    };

    return (
        <div className="cpted-suggest">
            <h3>서울특별시 강남구 삼성동</h3>
            <p>에서 많이 일어나는 범죄</p>
            <div>
                <p>1위: 절도</p>
                <p>2위: 성폭력</p>                    
                <p>3위: 폭력</p>
            </div>
            <h4>[CPTED 제안]</h4>
            <p>범죄를 줄이기 위해 가로등 설치를 제안합니다.</p>
            <button onClick={handleButtonClick}>지역 개선하기</button>
        </div>
    
    );
};

export default CptedSuggest;
