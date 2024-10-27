import React, { useRef, useEffect, useState, useContext } from 'react';
import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { AddressContext } from './AddressContext';
import { getAddress } from './AppService';
import CptedSuggest from './CptedSuggest';

const MapPage = ({ layers, coordinates, geojsonVisible, setGeojsonVisible }) => {
  const mapRef = useRef(null);
  const mapElement = useRef();
  const tooltipRef = useRef(null); // Tooltip element
  const overlayRef = useRef(null); // Overlay for tooltip
  const apiKey = process.env.REACT_APP_WMTS_MAP_API_KEY;
  const { clickedAddress, setClickedAddress } = useContext(AddressContext);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const geojsonLayerRef = useRef(null);
  const wmsLayersRef = useRef([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (!coordinates) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoordinates({ x: longitude, y: latitude });
          },
          () => setUserCoordinates({ x: 126.9780, y: 37.5665 })  // 서울 기본 위치
        );
      } else {
        setUserCoordinates({ x: 126.9780, y: 37.5665 });
      }
    }
  }, [coordinates]);

  // 지도 초기화 및 처음 한 번 GeoJSON 데이터를 불러와 저장
  useEffect(() => {
    if (userCoordinates || coordinates) {
      const baseLayer = new TileLayer({
        source: new XYZ({
          url: `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/{z}/{y}/{x}.png`,
          projection: 'EPSG:3857',
          tileSize: [256, 256],
          wrapX: true,
        }),
      });

      const map = new Map({
        target: mapElement.current,
        layers: [baseLayer],
        view: new View({
          center: fromLonLat([coordinates ? coordinates.x : userCoordinates.x, coordinates ? coordinates.y : userCoordinates.y]),
          zoom: 15,
        }),
      });

      mapRef.current = map;

      // GeoJSON 데이터를 처음에 한 번만 불러옴
      if (!geojsonData) {
        fetch('https://smallgeojson.s3.ap-northeast-2.amazonaws.com/TestGrid3.geojson')
          .then((response) => response.json())
          .then((data) => {
            setGeojsonData(data);
          });
      }

      // 지도 클릭 시 Feature 정보 가져오기
      map.on('click', async (event) => {
        const clickedCoordinate = event.coordinate;
        const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);

        if (clickedFeature) {
          const lonLat = toLonLat(clickedCoordinate);
          const address = await getAddress(lonLat[1], lonLat[0]);
          setClickedAddress(address);
          setSelectedFeature(clickedFeature);
        }
      });

      // 툴팁 오버레이 설정
      const overlay = new Overlay({
        element: tooltipRef.current,
        offset: [10, 0],
        positioning: 'bottom-left',
      });
      overlayRef.current = overlay;
      map.addOverlay(overlay);

      return () => map.setTarget(undefined);
    }
  }, [apiKey, coordinates, userCoordinates]);

  // 스타일 변경 로직
  useEffect(() => {
    if (geojsonData && geojsonVisible) {
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonData, { featureProjection: 'EPSG:3857' }),
      });

      const geojsonLayer = new VectorLayer({
        source: source,
        style: function (feature) {
          const value = feature.get(geojsonVisible);

          let fillColor;
          switch (value) {
            case 1: fillColor = 'rgba(255, 255, 255, 0.0)'; break;
            case 2: fillColor = 'rgba(255, 255, 178, 0.4)'; break;
            case 3: fillColor = 'rgba(254, 232, 139, 0.4)'; break;
            case 4: fillColor = 'rgba(254, 209, 101, 0.4)'; break;
            case 5: fillColor = 'rgba(253, 183, 81, 0.4)'; break;
            case 6: fillColor = 'rgba(253, 155, 67, 0.4)'; break;
            case 7: fillColor = 'rgba(250, 122, 53, 0.4)'; break;
            case 8: fillColor = 'rgba(244, 86, 41, 0.4)'; break;
            case 9: fillColor = 'rgba(234, 52, 32, 0.4)'; break;
            case 10: fillColor = 'rgba(211, 26, 35, 0.4)'; break;
            case 11: fillColor = 'rgba(189, 0, 38, 0.4)'; break;
            default: fillColor = 'rgba(0, 0, 0, 0.0)';
          }

          return new Style({
            fill: new Fill({ color: fillColor }),
          });
        },
      });

      if (geojsonLayerRef.current) {
        mapRef.current.removeLayer(geojsonLayerRef.current);
      }
      geojsonLayerRef.current = geojsonLayer;
      mapRef.current.addLayer(geojsonLayer);

      // 툴팁 표시
      mapRef.current.on('pointermove', (event) => {
        const feature = mapRef.current.forEachFeatureAtPixel(event.pixel, (f) => f);
        if (feature) {
          const crall = feature.get('CRALL');
          const crviol = feature.get('CRVIOL');
          const crtheft = feature.get('CRTHEFT');
          const crsex = feature.get('CRSEX');

          // 가장 높은 위험 범죄 유형 결정
          let crimeMessage = '';
          let crimeelement = ''; // crimeelement 변수를 선언합니다.

          const highestCrime = Math.max(crall, crviol, crtheft, crsex);
          switch (highestCrime) {
            case crall: 
              crimeMessage = '전체범죄 발생 위험'; 
              crimeelement = '건물 층수, 건물 연령, 건물 갯수, 건물 면적, 건물 연면적,<br/> 사교육 기관의 갯수, 버스정류장의 갯수,<br/> 지하철역과의 거리, 도로의 통과도, 도로의 전환비'; 
              break;
            case crviol: 
              crimeMessage = '폭력 발생 위험'; 
              crimeelement = '건물 층수, 건물 연령, 건물 갯수, 건물 면적, 건물 연면적,<br/> 휴게음식점의 갯수, 지하철역과의 거리,<br/> 도로의 통과도, 도로의 전환비'; 
              break;
            case crtheft: 
              crimeMessage = '절도 발생 위험'; 
              crimeelement = '건물 층수, 건물 갯수, 건물 면적, 건물 연면적,<br/> 금융보험기관의 갯수, 버스정류장의 갯수,<br/> 도로의 통과도, 도로의 전환비'; 
              break;
            case crsex: 
              crimeMessage = '성폭력 발생 위험'; 
              crimeelement = '숙박기관의 갯수, CCTV의 갯수,<br/> 도로의 통과도'; 
              break;
            default: 
              crimeMessage = '';
          }
          

          tooltipRef.current.innerHTML = `
            <div>
              <strong>${crimeMessage}</strong>
              <p>${crimeelement}가 영향을 미칩니다.</p>
            </div>
          `;
          overlayRef.current.setPosition(event.coordinate);
        } else {
          overlayRef.current.setPosition(undefined);
        }
      });
    } else if (geojsonLayerRef.current) {
      mapRef.current.removeLayer(geojsonLayerRef.current);
    }
  }, [geojsonData, geojsonVisible]);

  return (
    <div>
      <div ref={mapElement} style={{ width: '100%', height: '100vh' }}></div>
      <div ref={tooltipRef} className="tooltip" style={{ background: 'rgba(0, 0, 0, 0.6)', color: '#fff', padding: '5px', borderRadius: '3px' }}></div>
      {clickedAddress && selectedFeature && (
        <CptedSuggest clickedAddress={clickedAddress} selectedFeature={selectedFeature} />
      )}
    </div>
  );
};

export default MapPage;
