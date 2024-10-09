import React, { useRef, useEffect, useState, useContext } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj'; // toLonLat 추가
import { Style, Fill } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { AddressContext } from './AddressContext';
import { getAddress } from './AppService';
import CptedSuggest from './CptedSuggest';

const MapPage = ({ layers, coordinates, geojsonVisible, setGeojsonVisible }) => {
  const mapRef = useRef(null);
  const mapElement = useRef();
  const apiKey = process.env.REACT_APP_WMTS_MAP_API_KEY;
  const { clickedAddress, setClickedAddress } = useContext(AddressContext);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null); // 처음 로드한 데이터를 저장
  const geojsonLayerRef = useRef(null);  // 자취촌 레이어 참조
  const wmsLayersRef = useRef([]);  // WMS 레이어들을 저장

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
            setGeojsonData(data);  // 데이터를 상태에 저장
          });
      }

      // 지도 클릭 시 Feature 정보 가져오기
      map.on('click', async (event) => {
        const clickedCoordinate = event.coordinate;
        const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);

        if (clickedFeature) {
          const lonLat = toLonLat(clickedCoordinate);  // toLonLat 함수 사용
          const address = await getAddress(lonLat[1], lonLat[0]);
          setClickedAddress(address);
        }
      });

      return () => map.setTarget(undefined);
    }
  }, [apiKey, coordinates, userCoordinates]);

  // 스타일 변경 로직 (옵션에 따라 GeoJSON 레이어의 스타일 업데이트)
  useEffect(() => {
    if (geojsonData && geojsonVisible) {
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonData, { featureProjection: 'EPSG:3857' }),
      });

      // GeoJSON 레이어 추가
      const geojsonLayer = new VectorLayer({
        source: source,
        style: function (feature) {
          const value = feature.get(geojsonVisible);

          let fillColor;
          switch (value) {
            case 1:
              fillColor = 'rgba(255, 255, 255, 0.0)';
              break;
            case 2:
              fillColor = 'rgba(255, 255, 178, 0.4)';
              break;
            case 3:
              fillColor = 'rgba(254, 232, 139, 0.4)';
              break;
            case 4:
              fillColor = 'rgba(254, 209, 101, 0.4)';
              break;
            case 5:
              fillColor = 'rgba(253, 183, 81, 0.4)';
              break;
            case 6:
              fillColor = 'rgba(253, 155, 67, 0.4)';
              break;
            case 7:
              fillColor = 'rgba(250, 122, 53, 0.4)';
              break;
            case 8:
              fillColor = 'rgba(244, 86, 41, 0.4)';
              break;
            case 9:
              fillColor = 'rgba(234, 52, 32, 0.4)';
              break;
            case 10:
              fillColor = 'rgba(211, 26, 35, 0.4)';
              break;
            case 11:
              fillColor = 'rgba(189, 0, 38, 0.4)';
              break;
            default:
              fillColor = 'rgba(0, 0, 0, 0.0)';
          }

          return new Style({
            fill: new Fill({
              color: fillColor,
            }),
          });
        },
      });

      // API 레이어가 추가된 경우 기존 WMS 레이어 제거
      wmsLayersRef.current.forEach((layer) => {
        mapRef.current.removeLayer(layer);
      });
      wmsLayersRef.current = [];

      // 자취촌 레이어를 관리하고 업데이트
      if (geojsonLayerRef.current) {
        mapRef.current.removeLayer(geojsonLayerRef.current);
      }
      geojsonLayerRef.current = geojsonLayer;  // 자취촌 레이어를 참조로 저장
      mapRef.current.addLayer(geojsonLayer);
    } else {
      // 자취촌 레이어 숨기기
      if (geojsonLayerRef.current) {
        mapRef.current.removeLayer(geojsonLayerRef.current);
      }
    }
  }, [geojsonData, geojsonVisible]);

  // WMS 레이어 추가 로직 (API 요청에 따라 레이어를 추가)
  useEffect(() => {
    const addWMSLayers = (layers) => {
      // 자취촌 레이어가 활성화되어 있다면 제거
      if (geojsonLayerRef.current) {
        mapRef.current.removeLayer(geojsonLayerRef.current);
      }

      // 이전에 추가된 WMS 레이어가 있으면 제거
      wmsLayersRef.current.forEach((layer) => {
        mapRef.current.removeLayer(layer);
      });
      wmsLayersRef.current = [];  // WMS 레이어 배열 초기화

      layers.forEach((layer) => {
        const wmsLayer = new TileLayer({
          source: new TileWMS({
            url: layer.serverUrl,
            params: {
              'LAYERS': layer.layername,
              'STYLES': layer.styles,
              'FORMAT': 'image/png',
              'TRANSPARENT': true,
            },
            serverType: 'geoserver',
            transition: 0,
          }),
          opacity: 0.7,
        });
        mapRef.current.addLayer(wmsLayer);
        wmsLayersRef.current.push(wmsLayer);  // 추가된 레이어를 배열에 저장
      });
    };

    if (layers && layers.length > 0) {
      addWMSLayers(layers);
    }
  }, [layers]);

  return (
    <div>
      <div ref={mapElement} style={{ width: '100%', height: '100vh' }}></div>
      {clickedAddress && <CptedSuggest clickedAddress={clickedAddress} />}
    </div>
  );
};

export default MapPage;
