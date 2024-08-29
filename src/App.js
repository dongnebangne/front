import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MapPage from './MapPage';
import SearchAddress from './SearchAddress';
import MapBox from './MapBox';
import CptedAI from './CptedAI';

function App() {
  const [isRightBarOpen, setIsRightBarOpen] = useState(true);
  const [isMapClicked, setIsMapClicked] = useState(false);
  const [showCptedSuggest, setShowCptedSuggest] = useState(false);
  const [layers, setLayers] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [selectedButton, setSelectedButton] = useState('');

  const handleMapClick = () => {
    setIsMapClicked(true);
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
              <MapPage onMapClick={handleMapClick} layers={layers} coordinates={coordinates} />
              <SearchAddress 
                isOpen={isRightBarOpen} 
                toggleRightBar={toggleRightBar} 
                setCoordinates={setCoordinates}
                selectedButton={selectedButton}
                isMapClicked={isMapClicked}
              />
              <MapBox 
                setLayers={setLayers}
                selectedButton={selectedButton}
                setSelectedButton={setSelectedButton}/>
            </>
          } />
          <Route path="/cpted-ai" element={
            <>
              <SearchAddress 
                isOpen={isRightBarOpen} 
                toggleRightBar={toggleRightBar} 
                setCoordinates={setCoordinates}
                selectedButton={selectedButton}
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