import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat, toLonLat } from 'ol/proj';

const MapPage = ({ onMapClick, layers }) => {
  const mapRef = useRef(null);
  const mapElement = useRef();
  const apiKey = process.env.REACT_APP_WMTS_MAP_API_KEY;

  useEffect(() => {
    const baseLayer = new TileLayer({
      source: new XYZ({
        url: `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/{z}/{y}/{x}.png`,
        projection: 'EPSG:3857',
        tileSize: [256, 256],
        wrapX: true,
      })
    });

    const map = new Map({
      target: mapElement.current,
      layers: [baseLayer],
      view: new View({
        center: fromLonLat([126.9780, 37.5665]), // 서울시청 좌표
        zoom: 15 // 적절한 줌 레벨 설정
      })
    });

    mapRef.current = map;

    // 지도 클릭 이벤트 핸들러
    map.on('click', (event) => {
      const clickedCoordinate = toLonLat(event.coordinate);
      console.log('Map clicked at:', clickedCoordinate);
      if (onMapClick) {
        onMapClick(clickedCoordinate); // 부모 컴포넌트로 클릭 위치 전달
      }
    });

    const addWMSLayers = (layers) => {
      layers.forEach(layer => {
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
        map.addLayer(wmsLayer);
      });
    };

    if (layers && layers.length > 0) {
      console.log('Adding layers to the map:', layers);
      addWMSLayers(layers);
    }

    return () => map.setTarget(undefined);
  }, [onMapClick, layers, apiKey]);

  return (
    <div ref={mapElement} style={{ width: '100%', height: '100vh' }}></div>
  );
};

export default MapPage;
