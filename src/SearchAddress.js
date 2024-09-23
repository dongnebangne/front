import React, { useState, useEffect } from 'react';
import './SearchAddress.css';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CptedSuggest from './CptedSuggest';
import { getSido, getSigungu, getEmdong, getCoordinates, getLocations, getUniversities, getUniversityCoordinates } from './AppService';

const SearchAddress = ({ isOpen, toggleRightBar, showCptedSuggest, setCoordinates, selectedButton, isMapClicked }) => {
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
                console.log('Sido List:', data);
                setSidoList(data);
            }).catch(error => {
                console.error("Error fetching sido list:", error);
            });

            getSigungu('서울특별시').then(data => {
                console.log('Sigungu List:', data);
                setSigunguList(data);
            }).catch(error => {
                console.error("Error fetching sigungu list:", error);
            });

            getEmdong('서울특별시', '종로구').then(data => {
                console.log('Emdong List:', data);
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

    const renderListItems = (items, selectedItem, onSelectItem, itemKey = null) => {
        return items.map((item, index) => (
            <ListItemButton
                key={index}
                selected={selectedItem === (itemKey ? item[itemKey] : item)}
                onClick={() => onSelectItem(itemKey ? item[itemKey] : item)}
            >
                <ListItemText primary={itemKey ? (item[itemKey] ? String(item[itemKey]) : "Unknown") : (item ? String(item) : "Unknown")} className="custom-text" />
            </ListItemButton>
        ));
    };
    

    return (
        <div className={`search-bar ${isOpen ? 'open' : 'closed'}`}>
            <div className='RightBarTitle'>
                <h3>주소검색</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="297" height="3" viewBox="0 0 297 3" fill="none">
                    <path d="M-4.5 1.5H299.5" stroke="#297F50" strokeWidth="2"/>
                </svg>
            </div>
            <div className="content" style={{ display: 'flex', flexDirection: 'column', height: isMapClicked ? '60%' : '100%' }}>
                {selectedButton === '자취촌범죄주의구간' ? (
                    <div className="content" style={{ display: 'flex' }}>
                        <div className="list-container left-list"> {/* 왼쪽 리스트에 선 추가 */}
                            <p className="list-name">시/도</p>
                            <List component="nav" aria-label="location-list">
                                {renderListItems(locationList, selectedLocation, handleLocationChange)}
                            </List>
                        </div>
                        <div className="list-container">
                            <p className="list-name">대학명</p>
                            <List component="nav" aria-label="university-list">
                                {renderListItems(universityList, selectedUniversity, handleUniversityChange, 'univ_name')}
                            </List>
                        </div>
                    </div>
                ) : (
                    <div className="content" style={{ display: 'flex' }}>
                        <div className="list-container left-list"> {/* 왼쪽 리스트에 선 추가 */}
                            <p className="list-name">시/도</p>
                            <List component="nav" aria-label="city-list">
                                {renderListItems(sidoList, selectedSido, handleSidoChange, 'sido')} 
                            </List>
                        </div>
                        <div className="list-container">
                            <p className="list-name">시/군/구</p>
                            <List component="nav" aria-label="district-list">
                                {renderListItems(sigunguList, selectedSigungu, handleSigunguChange)}
                            </List>
                        </div>
                        <div className="list-container">
                            <p className="list-name">읍/면/동</p>
                            <List component="nav" aria-label="town-list">
                                {renderListItems(emdongList, selectedEmdong, handleEmdongChange)}
                            </List>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchAddress;