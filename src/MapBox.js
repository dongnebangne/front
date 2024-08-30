import React, { useState } from 'react';
import './MapBox.css';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import MapType from './MapType';
import MapInfo from './MapInfo';
import { getWMSLayer, getLegend } from './AppService';

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


const MapBox = ({ setLayers, setGeojsonVisible }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState([]);
  const [selectedButton, setSelectedButton] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [infoTitle, setInfoTitle] = useState('');
  const [infoDescription, setInfoDescription] = useState('');
  const [legendURL, setLegendURL] = useState('');

  const resetLayers = () => {
      setLayers([]); // 모든 WMS 레이어 제거
      setGeojsonVisible(false); // GeoJSON 레이어 비활성화
  };

  const handleOptionSelect = async (option) => {
      setSelectedOption(option);  // 선택된 옵션을 상태로 저장

      try {
          const layers = await getWMSLayer(modalTitle, option); // 선택된 옵션에 따른 레이어 가져오기
          setLayers(layers); // 새로운 WMS 레이어 설정

          const legendURL = await getLegend(layers[0].layername, layers[0].styles);
          setLegendURL(legendURL); // 범례 URL 설정
      } catch (error) {
          console.error("API 요청 중 오류 발생:", error);
      }
  };

  const handleButtonClick = (title, options) => {
      resetLayers(); // 기존 레이어 초기화

      setSelectedButton(title);
      setModalTitle(title);
      setModalOptions(options);
      setModalVisible(true); // 모달 열기

      setInfoTitle(title);
      setInfoDescription(descriptions[title]);
      setInfoModalVisible(true); // 정보 모달 열기
  };

  const handleSimpleButtonClick = async (title) => {
      resetLayers(); // 기존 레이어 초기화

      setSelectedButton(title);

      setInfoTitle(title);
      setInfoDescription(descriptions[title]);
      setInfoModalVisible(true); // 정보 모달 열기

      if (title === '자취촌범죄주의구간') {
          setGeojsonVisible(true); // GeoJSON 레이어 활성화
      } else {
          try {
              const layers = await getWMSLayer(title);
              setLayers(layers); // 새로운 WMS 레이어 설정

              const legendURL = await getLegend(layers[0].layername, layers[0].styles);
              setLegendURL(legendURL); // 범례 URL 설정
          } catch (error) {
              console.error("API 요청 중 오류 발생:", error);
          }
      }
  };

  return (
      <div className="mapBox">
          <h2>Safe-Cid</h2>
          <Divider />
          <div className="button-container">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                  <Grid item xs={6}>
                      <button
                          className={`map-button ${selectedButton === '범죄주의구간' ? 'selected' : ''}`}
                          onClick={() => handleButtonClick('범죄주의구간', ['전체', '강도', '성폭력', '절도', '폭력'])}>
                          범죄주의구간
                      </button>
                  </Grid>
                  <Grid item xs={6}>
                      <button
                          className={`map-button ${selectedButton === '자취촌범죄주의구간' ? 'selected' : ''}`}
                          onClick={() => handleSimpleButtonClick('자취촌범죄주의구간')}>
                          자취촌 범죄주의구간
                      </button>
                  </Grid>
                  <Grid item xs={6}>
                      <button
                          className={`map-button ${selectedButton === '노인대상범죄주의구간' ? 'selected' : ''}`}
                          onClick={() => handleSimpleButtonClick('노인대상범죄주의구간')}>
                          노인 대상 <br />범죄주의구간
                      </button>
                  </Grid>
                  <Grid item xs={6}>
                      <button
                          className={`map-button ${selectedButton === '어린이대상범죄주의구간' ? 'selected' : ''}`}
                          onClick={() => handleSimpleButtonClick('어린이대상범죄주의구간')}>
                          어린이 대상<br /> 범죄주의구간
                      </button>
                  </Grid>
                  <Grid item xs={6}>
                      <button
                          className={`map-button ${selectedButton === '치안사고통계' ? 'selected' : ''}`}
                          onClick={() => handleButtonClick('치안사고통계', ['전체', '마약', '살인', '도박', '강도', '성폭력', '절도', '약취/유인', '폭력', '방화'])}>
                          치안사고통계
                      </button>
                  </Grid>
                  <Grid item xs={6}>
                      <button
                          className={`map-button ${selectedButton === '여성밤길치안안전' ? 'selected' : ''}`}
                          onClick={() => handleButtonClick('여성밤길치안안전', ['전체', '성폭력', '폭력', '절도', '강도'])}>
                          여성 밤길 <br />치안안전
                      </button>
                  </Grid>
              </Grid>
          </div>
          {modalVisible && (
              <div className="modal-container">
                  <MapType
                      title={modalTitle}
                      options={modalOptions}
                      onSelect={handleOptionSelect} // 선택된 옵션 전달
                      selectedOption={selectedOption} // 선택된 옵션 유지
                      onClose={() => setModalVisible(false)}
                      legend={legendURL}
                  />
              </div>
          )}
          {infoModalVisible && (
              <MapInfo
                  title={infoTitle}
                  description={infoDescription}
                  onClose={() => setInfoModalVisible(false)}
              />
          )}
      </div>
  );
};

export default MapBox;
