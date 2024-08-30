import React, { useRef, useEffect, useState, useContext } from 'react';
import { AddressContext } from './AddressContext';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill } from 'ol/style';
import { getAddress } from './AppService';
import CptedSuggest from './CptedSuggest';
import { GeoJSON } from 'ol/format';
import InpaintLeftBar from './InpaintLeftBar';

const MapPage = ({ onMapClick, layers, coordinates }) => {
  const mapRef = useRef(null);
  const mapElement = useRef();
  const apiKey = process.env.REACT_APP_WMTS_MAP_API_KEY;
  const [selectedFeature, setSelectedFeature] = useState(null);
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
            setUserCoordinates({ x: 126.9780, y: 37.5665 });
          }
        );
      } else {
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
          zoom: 15
        })
      });

      mapRef.current = map;

      // 지도 클릭 이벤트 핸들러
      map.on('click', async (event) => {
        const clickedCoordinate = toLonLat(event.coordinate);
        const clickedFeature = mapRef.current.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        
        if (clickedFeature) {
            setSelectedFeature(clickedFeature);
            try {
                const [lon, lat] = clickedCoordinate;
                const address = await getAddress(lat, lon);
                setClickedAddress(address);
            } catch (error) {
                console.error('Error fetching address:', error);
                setClickedAddress('주소를 가져오지 못했습니다.');
            }
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

      // 범죄 레이어 추가 부분
      const geojsonLayer = new VectorLayer({
        source: new VectorSource({
          url: '/TestGrid2.geojson', // GeoJSON 경로
          format: new GeoJSON({
            projection: 'EPSG:3857'
          }),
        }),
        style: function (feature) {
          const crallValue = feature.get('CRALL'); // CRALL 컬럼 값 가져오기

          let fillColor;

          switch (crallValue) {
            case 1:
              fillColor = 'rgba(255, 255, 255, 0.0)'; // 흰색, 투명도 100%
              break;
            case 2:
              fillColor = 'rgba(255, 255, 178, 0.4)'; // 투명도 40%
              break;
            case 3:
              fillColor = 'rgba(254, 232, 139, 0.4)'; // 투명도 40%
              break;
            case 4:
              fillColor = 'rgba(254, 209, 101, 0.4)'; // 투명도 40%
              break;
            case 5:
              fillColor = 'rgba(253, 183, 81, 0.4)'; // 투명도 40%
              break;
            case 6:
              fillColor = 'rgba(253, 155, 67, 0.4)'; // 투명도 40%
              break;
            case 7:
              fillColor = 'rgba(250, 122, 53, 0.4)'; // 투명도 40%
              break;
            case 8:
              fillColor = 'rgba(244, 86, 41, 0.4)'; // 투명도 40%
              break;
            case 9:
              fillColor = 'rgba(234, 52, 32, 0.4)'; // 투명도 40%
              break;
            case 10:
              fillColor = 'rgba(211, 26, 35, 0.4)'; // 투명도 40%
              break;
            case 11:
              fillColor = 'rgba(189, 0, 38, 0.4)'; // 투명도 40%
              break;
            default:
              fillColor = 'rgba(0, 0, 0, 0.0)'; // 기본값, 투명도 0%
          }

          return new Style({
            fill: new Fill({
              color: fillColor,
            })
          });
        }
      });

      map.addLayer(geojsonLayer);

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
