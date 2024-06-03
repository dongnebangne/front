import React, { useEffect, useRef } from 'react';
import './MapPage.css';


const MapPage = ({onMapClick, layers}) => {
  const mapRef = useRef(null);
  
  useEffect(() => {
    const { naver } = window;

    const initMap = (latitude, longitude) => {
      // 네이버 지도 옵션 선택
      const mapOptions = {
        // 지도의 초기 중심 좌표
        center: new naver.maps.LatLng(latitude, longitude),
        logoControl: false, // 네이버 로고 표시 X
        mapDataControl: false, // 지도 데이터 저작권 컨트롤 표시 X
        scaleControl: true, // 지도 축척 컨트롤의 표시 여부
        tileDuration: 200, // 지도 타일을 전환할 때 페이드 인 효과의 지속 시간(밀리초)
        zoom: 14, // 지도의 초기 줌 레벨
        zoomControl: true, // 줌 컨트롤 표시
        zoomControlOptions: { position: 9 }, // 줌 컨트롤 우하단에 배치
      };
      mapRef.current = new naver.maps.Map('map', mapOptions);

      // 지도 클릭 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, 'click', onMapClick);

      // 지도에 WMS 레이어 추가
      if (layers && layers.length > 0) {
        layers.forEach(layer => {
          const wmsLayer = new naver.maps.ImageMapType({
            name: layer.name,
            maxZoom: 19,
            minZoom: 1,
            tileSize: new naver.maps.Size(256, 256),
            projection: naver.maps.EPSG3857,
            repeatX: true,
            getTileUrl: (x, y, z) => {
              const bbox = getBbox(x, y, z);
              console.log(`Tile URL: ${layer.serverUrl}&layers=${layer.layername}&styles=${layer.styles}&bbox=${bbox}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`);
              return `${layer.serverUrl}&layers=${layer.layername}&styles=${layer.styles}&bbox=${bbox}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`;
            }
          });
          mapRef.current.mapTypes.set(layer.name, wmsLayer);
          mapRef.current.setMapTypeId(layer.name);
        });
      }

      const getBbox = (x, y, z) => {
        const tileSize = 256;
        const minX = x * tileSize;
        const minY = y * tileSize;
        const maxX = minX + tileSize;
        const maxY = minY + tileSize;
        return `${minX},${minY},${maxX},${maxY}`;
      };
    };

    const handleGeoSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      initMap(latitude, longitude);
    };

    const handleGeoError = () => {
      // 위치를 가져오는 데 실패한 경우 기본 좌표(서울 시청)로 초기화
      initMap(37.5666103, 126.9783882);
    };

    // 사용자의 현재 위치를 가져옵니다.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
    } else {
      console.error('Geolocation을 지원하지 않는 브라우저입니다.');
      // Geolocation을 지원하지 않는 경우 기본 좌표(서울 시청)로 초기화
      initMap(37.5666103, 126.9783882);
    }
  }, [onMapClick, layers]);
  
    return <div id="map" style={{ width: '100%', height: '100vh', zIndex:0}}></div>;
  };
  
  export default MapPage;