import { API_BASE_URL } from './api-config';

export const getWMSLayer = async (category, subcategory) => {
  const url = subcategory
    ? `${API_BASE_URL}/api/get-wms-layer/?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
    : `${API_BASE_URL}/api/get-wms-layer/?category=${encodeURIComponent(category)}`;

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();  // 오류 응답 텍스트를 읽음
    console.error('Error response:', text);
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('API response data:', data);
  return data;
};

export const getSido = async () => {
  const response = await fetch(`${API_BASE_URL}/api/sido/`);
  if (!response.ok) {
      throw new Error('Failed to fetch sido list');
  }
  const data = await response.json();
  if (data.response && data.response.result && data.response.result.featureCollection) {
    return data.response.result.featureCollection.features.map(feature => feature.properties.ctp_kor_nm);
  } else {
      throw new Error('Invalid data structure');
  }
};

export const getSigungu = async (sidoName) => {
  const response = await fetch(`${API_BASE_URL}/api/sigungu/${sidoName}/`);
  if (!response.ok) {
      throw new Error('Failed to fetch sigungu list');
  }
  const data = await response.json();
  if (data.response && data.response.result && data.response.result.featureCollection) {
    return data.response.result.featureCollection.features.map(feature => feature.properties.sig_kor_nm);
  } else {
      throw new Error('Invalid data structure');
  }
};

export const getEmdong = async (sigunguName) => {
  const response = await fetch(`${API_BASE_URL}/api/eupmyeondong/${sigunguName}/`);
  if (!response.ok) {
      throw new Error('Failed to fetch emdong list');
  }
  const data = await response.json();
  if (data.response && data.response.result && data.response.result.featureCollection) {
    return data.response.result.featureCollection.features.map(feature => feature.properties.emd_kor_nm);
  } else {
      throw new Error('Invalid data structure');
  }
};

export const getCoordinates = async (address) => {
  const response = await fetch(`${API_BASE_URL}/api/coordinates/?address=${address}`);
  if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
  }
  const data = await response.json();
  return data;
};