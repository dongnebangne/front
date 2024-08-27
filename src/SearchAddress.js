import React, { useState, useEffect } from 'react';
import './SearchAddress.css';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CptedSuggest from './CptedSuggest';
import { getSido, getSigungu, getEmdong, getCoordinates } from './AppService';

const SearchAddress = ({ isOpen, toggleRightBar, showCptedSuggest, setCoordinates }) => {
    const [sidoList, setSidoList] = useState([]);
    const [sigunguList, setSigunguList] = useState([]);
    const [emdongList, setEmdongList] = useState([]);
    const [selectedSido, setSelectedSido] = useState(null);
    const [selectedSigungu, setSelectedSigungu] = useState(null);
    const [selectedEmdong, setSelectedEmdong] = useState(null);

    useEffect(() => {
        getSido().then(data => {
            setSidoList(data);
        }).catch(error => {
            console.error("Error fetching sido list:", error);
        });
    }, []);

    useEffect(() => {
        if (selectedSido) {
            getSigungu(selectedSido).then(data => {
                setSigunguList(data);
            }).catch(error => {
                console.error("Error fetching sigungu list:", error);
            });
        }
    }, [selectedSido]);

    useEffect(() => {
        if (selectedSigungu) {
            getEmdong(selectedSido, selectedSigungu).then(data => {
                setEmdongList(data);
            }).catch(error => {
                console.error("Error fetching emdong list:", error);
            });
        }
    }, [selectedSigungu]);

    const handleSidoChange = (city) => {
        setSelectedSido(city);
        setSelectedSigungu(null);
        setSelectedEmdong(null);
        setSigunguList([]);
        setEmdongList([]);
    };

    const handleSigunguChange = (district) => {
        console.log("선택된 시/군/구:", district);
        setSelectedSigungu(district);
        setSelectedEmdong(null);
        setEmdongList([]);
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
            {showCptedSuggest && <CptedSuggest />}
        </div>
    );
};

export default SearchAddress;
