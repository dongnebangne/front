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
<<<<<<< HEAD
  const [geojsonVisible, setGeojsonVisible] = useState(false);
=======
  const [selectedButton, setSelectedButton] = useState('');
  const [clickedAddress, setClickedAddress] = useState('');
>>>>>>> 348d1f7dae29dad0199031499f4d53174e817a1a

  const handleMapClick = (address) => {
    setIsMapClicked(true);
    setIsRightBarOpen(true);
    setClickedAddress(address);
  };

  const toggleRightBar = () => {
    setIsRightBarOpen(!isRightBarOpen);
  };

  return (
<<<<<<< HEAD
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
=======
    <AddressProvider>
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
                
                <CptedAI />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AddressProvider>
>>>>>>> 348d1f7dae29dad0199031499f4d53174e817a1a
  );
}

export default App;
