import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MapPage from './MapPage';
import SearchAddress from './SearchAddress';
import MapBox from './MapBox';
import CptedAI from './CptedAI';

function App() {
  const [isRightBarOpen, setIsRightBarOpen] = useState(true);
  const [showCptedSuggest, setShowCptedSuggest] = useState(false);
  const [layers, setLayers] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [geojsonVisible, setGeojsonVisible] = useState(false);

  const handleMapClick = () => {
    setShowCptedSuggest(true);
    setIsRightBarOpen(true);
  };

  const toggleRightBar = () => {
    setIsRightBarOpen(!isRightBarOpen);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <MapPage 
                onMapClick={handleMapClick} 
                layers={layers} 
                coordinates={coordinates} 
                geojsonVisible={geojsonVisible}
              />
              <SearchAddress 
                isOpen={isRightBarOpen} 
                toggleRightBar={toggleRightBar} 
                setCoordinates={setCoordinates}
              />
              <MapBox 
                setLayers={setLayers}
                setGeojsonVisible={setGeojsonVisible} 
              />
            </>
          } />
          <Route path="/cpted-ai" element={
            <>
              <SearchAddress 
                isOpen={isRightBarOpen} 
                toggleRightBar={toggleRightBar} 
                showCptedSuggest={showCptedSuggest} 
                setCoordinates={setCoordinates}
              />
              <CptedAI />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
