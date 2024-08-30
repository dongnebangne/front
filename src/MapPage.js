import React, { useRef, useEffect, useState, useContext } from 'react';
import { AddressContext } from './AddressContext';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat, toLonLat } from 'ol/proj';
import { getAddress } from './AppService';
import CptedSuggest from './CptedSuggest';
import InpaintLeftBar from './InpaintLeftBar';

const MapPage = ({ onMapClick, layers, coordinates }) => {
  const mapRef = useRef(null);
  const mapElement = useRef();
  const apiKey = process.env.REACT_APP_WMTS_MAP_API_KEY;
  const { clickedAddress, setClickedAddress } = useContext(AddressContext);
  const [userCoordinates, setUserCoordinates] = useState(null);

  useEffect(() => {
    if (!coordinates) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoordinates({ x: longitude, y: latitude });
          },
          (error) => {
            console.error('Error getting user location:', error);
            // 에러 발생 시 기본 위치를 서울시청으로 설정
            setUserCoordinates({ x: 126.9780, y: 37.5665 });
          }
        );
      } else {
        // Geolocation을 지원하지 않는 경우 기본 위치를 서울시청으로 설정
        setUserCoordinates({ x: 126.9780, y: 37.5665 });
      }
    }
  }, [coordinates]);

  useEffect(() => {
    if (userCoordinates || coordinates) {
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
          center: fromLonLat([coordinates ? coordinates.x : userCoordinates.x, coordinates ? coordinates.y : userCoordinates.y]),
          zoom: 15 // 적절한 줌 레벨 설정
        })
      });

      mapRef.current = map;

      // 지도 클릭 이벤트 핸들러
      map.on('click', async (event) => {
        const clickedCoordinate = toLonLat(event.coordinate);
        console.log('Map clicked at:', clickedCoordinate);

        // 클릭된 좌표를 이용하여 주소를 가져옴
        try {
          const [lon, lat] = clickedCoordinate;
          const address = await getAddress(lat, lon);
          setClickedAddress(address);
          if (onMapClick) {
            onMapClick(clickedCoordinate); 
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          setClickedAddress('주소를 가져오지 못했습니다.');
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
    }
  }, [onMapClick, layers, apiKey, coordinates, userCoordinates]);

 

  return (
    <div>
      <div ref={mapElement} style={{ width: '100%', height: '100vh' }}></div>
      {clickedAddress && <CptedSuggest clickedAddress={clickedAddress} />}
      {clickedAddress && <InpaintLeftBar clickedAddress={clickedAddress} /> }

    </div>
  );
};

export default MapPage;
