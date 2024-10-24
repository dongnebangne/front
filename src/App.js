import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MapPage from './MapPage';
import SearchAddress from './SearchAddress';
import MapBox from './MapBox';
import CptedAI from './CptedAI';
import { AddressProvider } from './AddressContext';

function App() {
  const [isRightBarOpen, setIsRightBarOpen] = useState(true);
  const [isMapClicked, setIsMapClicked] = useState(false);
  const [showCptedSuggest, setShowCptedSuggest] = useState(false);
  const [layers, setLayers] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [selectedButton, setSelectedButton] = useState('');
  const [clickedAddress, setClickedAddress] = useState('');
  const [geojsonVisible, setGeojsonVisible] = useState(false);

  const handleMapClick = (address) => {
    setIsMapClicked(true);
    setIsRightBarOpen(true);
    setClickedAddress(address);
  };

  const toggleRightBar = () => {
    setIsRightBarOpen(!isRightBarOpen);
  };

  return (
    <AddressProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <>
                <MapPage onMapClick={handleMapClick} 
                layers={layers} coordinates={coordinates} 
                geojsonVisible={geojsonVisible}
                />
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
                  setGeojsonVisible={setGeojsonVisible}
                  setSelectedButton={setSelectedButton}/>
              </>
            } />
            <Route path="/cpted-ai" element={
              <>
                <CptedAI />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AddressProvider>
  );
}

export default App;