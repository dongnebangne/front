import { API_BASE_URL } from './api-config';

export const getWMSLayer = async (category, subcategory) => {
  const url = subcategory
    ? `${API_BASE_URL}/get-wms-layer/?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
    : `${API_BASE_URL}/get-wms-layer/?category=${encodeURIComponent(category)}`;

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

export const getLegend = async (layername, styles) => {
  const url = `${API_BASE_URL}/get-legend/?layer=${encodeURIComponent(layername)}&style=${encodeURIComponent(styles)}`;

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();  // 오류 응답 텍스트를 읽음
    console.error('Error response:', text);
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('Legend API response data:', data); // 응답 데이터 구조 확인
  return data;
};


export const getSido = async () => {
  const response = await fetch(`${API_BASE_URL}/sido/`);
  if (!response.ok) {
      throw new Error('Failed to fetch sido list');
  }
  const data = await response.json();
  return data;
};

export const getSigungu = async (sidoName) => {
  const response = await fetch(`${API_BASE_URL}/sigungu/${encodeURIComponent(sidoName)}/`);
    if (!response.ok) {
        throw new Error('Failed to fetch sigungu list');
    }
    const data = await response.json();
    return data.map(item => item.sigungu);
};

export const getEmdong = async (sidoName, sigunguName) => {
  const response = await fetch(`${API_BASE_URL}/eupmyeondong/${encodeURIComponent(sidoName)}/${encodeURIComponent(sigunguName)}/`);
  if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      throw new Error('Failed to fetch emdong list');
  }
  const data = await response.json();
  console.log("읍/면/동 API 응답 데이터:", data);
  return data.map(item => item.eupmyeondong);
};

export const getCoordinates = async (address) => {
  const response = await fetch(`${API_BASE_URL}/coordinates/?emdong=${encodeURIComponent(address)}`);
  if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
  }
  const data = await response.json();
  return data;
};

export const getAddress = async (lat, lon) => {
  const response = await fetch(`${API_BASE_URL}/address/?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error('Failed to fetch address');
  }
  const data = await response.json();
  console.log('Address data:', data);
  if (data.error) {
    throw new Error(data.error);
  }
  return data.address;
};