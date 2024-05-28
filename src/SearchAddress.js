import React, { useState } from 'react';
import './SearchAddress.css';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CptedSuggest from './CptedSuggest';
import CptedAI from './CptedAI';

const locations = {
    "서울특별시": {
        "강남구": ["개포동", "논현동", "대치동", "도곡동", "삼성동", "세곡동", "수서동", "신사동", "압구정동","역삼동", "율현동","일원동", "자곡동","청담동"],
        "강동구": ["강일동", "고덕동", "길동", "둔촌동","명일동","상일동","성내동", "암사동", "천호동"]
    },
    "부산광역시": {
        "해운대구": ["반송동","반여동","석대동","송정동","우동","재송동", "좌동","중동"],
        "부산진구": ["가야동","개금동","당감동","범전동","범천동","부암동","부전동", "양정동","연지동","전포동","초읍동"]
    }
};

const SearchAddress = ({ isOpen, toggleRightBar, showCptedSuggest }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedTown, setSelectedTown] = useState(null);

    const handleCityClick = (city) => {
        setSelectedCity(city);
        setSelectedDistrict(null);
        setSelectedTown(null);
    };

    const handleDistrictClick = (district) => {
        setSelectedDistrict(district);
        setSelectedTown(null);
    };

    const handleTownClick = (town) => {
        setSelectedTown(town);
        alert(`지도에서 ${town}로 이동합니다.`);
    };

    return (
        <div className={`search-bar ${isOpen ? 'open' : 'closed'}`}>
            <div className="toggle-button" onClick={toggleRightBar}>
                <ArrowBackIosIcon className='handle'/>
            </div>
            <div className='RightBarTitle'>
                <p>주소검색</p>
            </div>
            <div className="content" style={{ display: 'flex' }}>
                <div className="list-container" style={{ flex: 1 }}>
                    <p className="list-name">시/도</p>
                    <List component="nav" aria-label="city-list">
                        {Object.keys(locations).map((city, index) => (
                            <ListItemButton
                                key={index}
                                selected={selectedCity === city}
                                onClick={() => handleCityClick(city)}
                            >
                                <ListItemText primary={city} />
                            </ListItemButton>
                        ))}
                    </List>
                </div>
                <div className="list-container" style={{ flex: 1 }}>
                    <p className="list-name">시/군/구</p>
                    <List component="nav" aria-label="district-list">
                        {selectedCity && Object.keys(locations[selectedCity]).map((district, index) => (
                            <ListItemButton
                                key={index}
                                selected={selectedDistrict === district}
                                onClick={() => handleDistrictClick(district)}
                            >
                                <ListItemText primary={district} />
                            </ListItemButton>
                        ))}
                    </List>
                </div>
                <div className="list-container" style={{ flex: 1 }}>
                    <p className="list-name">읍/면/동</p>
                    <List component="nav" aria-label="town-list">
                        {selectedDistrict && locations[selectedCity][selectedDistrict].map((town, index) => (
                            <ListItemButton
                                key={index}
                                selected={selectedTown === town}
                                onClick={() => handleTownClick(town)}
                            >
                                <ListItemText primary={town} />
                            </ListItemButton>
                        ))}
                    </List>
                </div>
            </div>
            {showCptedSuggest && <CptedSuggest />}
        </div>
    );
};

export default SearchAddress;
