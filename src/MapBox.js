import React, { useState } from 'react';
import './MapBox.css';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import MapType from './MapType';
import MapInfo from './MapInfo';

const descriptions = {
    범죄주의구간: `
        - 최근 1년 전체(5대 범죄) 범죄발생현황을 밀도분석 한 정보입니다.<br/>
        - 경찰청에서 제공받은 밀도분석 정보를 도로상에 등급(10등급)으로 표현하고 있습니다.
    `,
    노인대상범죄주의구간: `
        - 노인(65세 이상)을 대상으로 한 범죄발생현황을 밀도분석 한 정보입니다.<br/>
        - 경찰청에서 제공받은 밀도분석 정보를 도로상에 등급(10등급)으로 표현하고 있습니다.
    `,
    어린이대상범죄주의구간: `
        - 어린이(13세 이하)를 대상으로 한 범죄발생현황을 밀도분석 한 정보입니다.<br/>
        - 경찰청에서 제공받은 밀도분석 정보를 도로상에 등급(10등급)으로 표현하고 있습니다.
    `,
    치안사고통계: `
        - 최근 3년 전체(9대 범죄) 범죄발생건수를 표시한 정보입니다.<br/>
        - 경찰관서(경찰서·지구대·파출소)별 발생건수를 등급(5등급)으로 표현하고 있습니다.<br/>
        - 치안사고통계정보는 발생 건 수가 직접 노출되지 않도록  *등급화* 를 적용하여 표시합니다.<br/><br/>
        <small>* 등급화 : 데이터 값의 자연스러운 그룹화를 위하여 Jenks Natural Breaks Classification 이라는 통계 데이터 분류 방법을 사용
    `,
    여성밤길치안안전: `
        - 밤 시간대(20~24시) 전체(5대 범죄) 범죄발생현황을 밀도분석 한 정보입니다.<br/>
        - 경찰청에서 제공받은 밀도분석 정보를 도로상에 등급(10등급)으로 표현하고 있습니다.<br/><br/>
        <small>* 지도상에 음영처리 된 부분은 치안안전시설(예. CCTV, 가로등, 방범등, 편의점 등)이 위치하지 않는 지역입니다.
    `
};

const MapBox = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalOptions, setModalOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');

    const handleButtonClick = (title, options) => {
        if (options) {
            setModalTitle(title);
            setModalOptions(options);
            setModalVisible(true);
        }
        setInfoTitle(title);
        setInfoDescription(descriptions[title]);
        setInfoModalVisible(true);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCloseInfoModal = () => {
        setInfoModalVisible(false);
    };

    const handleSimpleButtonClick = (title) => {
        setModalVisible(false); // 다른 버튼을 클릭할 때 모달을 닫기
        setInfoTitle(title);
        setInfoDescription(descriptions[title]);
        setInfoModalVisible(true);
    };

    return (
        <div className="mapBox">
            <h2>Safe-Cid</h2>
            <Divider/>
            <div className="button-container">
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                    <Grid item xs={6}>
                        <button className="map-button" onClick={() => handleButtonClick('범죄주의구간', ['전체', '강도', '성폭력', '절도', '폭력'])}>
                            범죄주의구간
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button className="map-button" onClick={() => handleSimpleButtonClick('자취촌범죄주의구간')}>
                            자취촌 범죄주의구간
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button className="map-button" onClick={() => handleSimpleButtonClick('노인대상범죄주의구간')}>
                            노인 대상 <br/>범죄주의구간
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button className="map-button" onClick={() => handleSimpleButtonClick('어린이대상범죄주의구간')}>
                            어린이 대상<br/> 범죄주의구간
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button className="map-button" onClick={() => handleButtonClick('치안사고통계', ['전체', '마약', '살인', '도박', '강도', '성폭력', '절도', '약취/유인', '폭력', '방화'])}>
                            치안사고통계
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button className="map-button" onClick={() => handleButtonClick('여성밤길치안안전', ['전체', '성폭력', '폭력', '절도', '강도'])}>
                            여성 밤길 <br/>치안안전
                        </button>
                    </Grid>
                </Grid>
            </div>
            {modalVisible && (
                <div className="modal-container">
                    <MapType
                        title={modalTitle}
                        options={modalOptions}
                        onClose={() => setModalVisible(false)}
                        onOptionChange={handleOptionChange}
                        selectedOption={selectedOption}
                    />
                </div>
            )}
            {infoModalVisible && (
                <MapInfo
                    title={infoTitle}
                    description={infoDescription}
                    onClose={handleCloseInfoModal}
                />
            )}
        </div>
    );
};

export default MapBox;
