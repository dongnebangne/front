import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // 여기에 전역 스타일이 포함됩니다
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
