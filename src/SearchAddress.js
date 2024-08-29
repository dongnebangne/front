import React, { useState, useEffect } from 'react';
import './SearchAddress.css';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CptedSuggest from './CptedSuggest';
import { getSido, getSigungu, getEmdong, getCoordinates, getLocations, getUniversities, getUniversityCoordinates } from './AppService';

const SearchAddress = ({ isOpen, toggleRightBar, showCptedSuggest, setCoordinates, selectedButton }) => {
    const [sidoList, setSidoList] = useState([]);
    const [sigunguList, setSigunguList] = useState([]);
    const [emdongList, setEmdongList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [universityList, setUniversityList] = useState([]);
    const [selectedSido, setSelectedSido] = useState('서울특별시'); // 기본 시/도
    const [selectedSigungu, setSelectedSigungu] = useState('종로구'); // 기본 시/군/구
    const [selectedEmdong, setSelectedEmdong] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null); // 기본 시/도
    const [selectedUniversity, setSelectedUniversity] = useState(null);

    useEffect(() => {
        if (selectedButton === '자취촌범죄주의구간') {
            // 자취촌범죄주의구간이 선택된 경우 시/도와 대학명 리스트를 가져옴
            getLocations().then(data => {
                setLocationList(data);
            }).catch(error => {
                console.error("Error fetching locations:", error);
            });

            getUniversities('서울특별시').then(data => {
                setUniversityList(data);
                setSelectedLocation('서울특별시');
            }).catch(error => {
                console.error("Error fetching university list:", error);
            });
        } else {
            // 다른 버튼이 선택된 경우 시/도, 시/군/구, 읍/면/동 리스트를 가져옴
            getSido().then(data => {
                setSidoList(data);
            }).catch(error => {
                console.error("Error fetching sido list:", error);
            });

            getSigungu('서울특별시').then(data => {
                setSigunguList(data);
            }).catch(error => {
                console.error("Error fetching sigungu list:", error);
            });

            getEmdong('서울특별시', '종로구').then(data => {
                setEmdongList(data);
            }).catch(error => {
                console.error("Error fetching emdong list:", error);
            });
        }
    }, [selectedButton]);

    const handleSidoChange = (city) => {
        setSelectedSido(city);
        setSelectedSigungu(null);
        setSelectedEmdong(null);
        getSigungu(city).then(data => {
            setSigunguList(data);
        }).catch(error => {
            console.error("Error fetching sigungu list:", error);
        });
    };

    const handleSigunguChange = (district) => {
        setSelectedSigungu(district);
        setSelectedEmdong(null);
        getEmdong(selectedSido, district).then(data => {
            setEmdongList(data);
        }).catch(error => {
            console.error("Error fetching emdong list:", error);
        });
    };

    const handleEmdongChange = (town) => {
        setSelectedEmdong(town);
        getCoordinates(town).then(data => {
            console.log("Coordinates fetched: ", data);
            setCoordinates(data);
        }).catch(error => {
            console.error("Error fetching coordinates:", error);
        });
    };

    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        setSelectedUniversity(null);
        getUniversities(location).then(data => {
            setUniversityList(data);
        }).catch(error => {
            console.error("Error fetching university list:", error);
        });
    };

    const handleUniversityChange = (university) => {
        setSelectedUniversity(university);
        getUniversityCoordinates(university).then(data => {
            console.log("Coordinates fetched: ", data);
            setCoordinates({ x: data.LON, y: data.LAT }); 
        }).catch(error => {
            console.error("Error fetching university coordinates:", error);
        });
    };

    return (
        <div className={`search-bar ${isOpen ? 'open' : 'closed'}`}>
            <div className="toggle-button" onClick={toggleRightBar}>
                <ArrowBackIosIcon className='handle'/>
            </div>
            <div className='RightBarTitle'>
                <p>주소검색</p>
            </div>
            {selectedButton === '자취촌범죄주의구간' ? (
                <div className="content" style={{ display: 'flex' }}>
                    <div className="list-container" style={{ flex: 1 }}>
                        <p className="list-name">시/도</p>
                        <List component="nav" aria-label="location-list">
                            {locationList.map((location, index) => (
                                <ListItemButton
                                    key={index}
                                    selected={selectedLocation === location}
                                    onClick={() => handleLocationChange(location)}
                                >
                                    <ListItemText primary={location} />
                                </ListItemButton>
                            ))}
                        </List>
                    </div>
                    <div className="list-container" style={{ flex: 1 }}>
                        <p className="list-name">대학명</p>
                        <List component="nav" aria-label="university-list">
                            {universityList.map((university, index) => (
                                <ListItemButton
                                    key={index}
                                    selected={selectedUniversity === university.univ_name}
                                    onClick={() => handleUniversityChange(university.univ_name)}
                                >
                                    <ListItemText primary={university.univ_name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </div>
                </div>
            ) : (
                <div className="content" style={{ display: 'flex' }}>
                    <div className="list-container" style={{ flex: 1 }}>
                        <p className="list-name">시/도</p>
                        <List component="nav" aria-label="city-list">
                            {sidoList.map((city, index) => (
                                <ListItemButton
                                    key={index}
                                    selected={selectedSido === city}
                                    onClick={() => handleSidoChange(city)}
                                >
                                    <ListItemText primary={city} />
                                </ListItemButton>
                            ))}
                        </List>
                    </div>
                    <div className="list-container" style={{ flex: 1 }}>
                        <p className="list-name">시/군/구</p>
                        <List component="nav" aria-label="district-list">
                            {sigunguList.map((district, index) => (
                                <ListItemButton
                                    key={index}
                                    selected={selectedSigungu === district}
                                    onClick={() => handleSigunguChange(district)}
                                >
                                    <ListItemText primary={district} />
                                </ListItemButton>
                            ))}
                        </List>
                    </div>
                    <div className="list-container" style={{ flex: 1 }}>
                        <p className="list-name">읍/면/동</p>
                        <List component="nav" aria-label="town-list">
                            {emdongList.map((town, index) => (
                                <ListItemButton
                                    key={index}
                                    selected={selectedEmdong === town}
                                    onClick={() => handleEmdongChange(town)}
                                >
                                    <ListItemText primary={town} />
                                </ListItemButton>
                            ))}
                        </List>
                    </div>
                </div>
            )}
            {showCptedSuggest && <CptedSuggest />}
        </div>
    );
};

export default SearchAddress;
