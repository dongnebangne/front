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