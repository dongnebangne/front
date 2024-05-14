import React, { useState } from 'react';
import './RightBar.css'; // RightBar에 대한 스타일 파일
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const RightBar = () => {
    const [isOpen, setIsOpen] = useState(true); // RightBar의 초기 상태는 열린 상태

    const toggleRightBar = () => {
        setIsOpen(!isOpen); // 상태를 토글하여 열림/닫힘 상태 변경
    };

    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <div className={`right-bar ${isOpen ? 'open' : 'closed'}`}>
            <div className="toggle-button" onClick={toggleRightBar}>
                {/* 토글 버튼 */}
                <ArrowBackIosIcon className='handle'/>
            </div>
            <div className='RightBarTitle'>
            {/* 여기에 RightBar 내용 추가 */}
            <p>주소검색</p>
            </div>

            <div className="content" style={{ display: 'flex' }}>
                {/* RightBar 내용 */}
                <div className="list-container" style={{ flex: 1 }}>
                    <p>시/도</p>
                <List component="nav" aria-label="first-city-folder" >
                    <ListItemButton
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemText primary="서울특별시" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 3}
                        onClick={(event) => handleListItemClick(event, 3)}
                    >
                        <ListItemText primary="부산광역시" />
                    </ListItemButton>
                </List>
                </div>
                <div className="list-container" style={{ flex: 1 }}>
                    <p>시/군/구</p>
                <List component="nav" aria-label="second-city-folder" >
                <ListItemButton
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemText primary="강남구" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 3}
                        onClick={(event) => handleListItemClick(event, 3)}
                    >
                        <ListItemText primary="강동구" />
                    </ListItemButton>
                </List>
                </div>
                <div className="list-container" style={{ flex: 1 }}>
                    <p>동</p>
                <List component="nav" aria-label="third-city-folder" >
                <ListItemButton
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemText primary="개포동" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 3}
                        onClick={(event) => handleListItemClick(event, 3)}
                    >
                        <ListItemText primary="논현동" />
                    </ListItemButton>
                </List>
                </div>
            </div>
        </div>
    );
};

export default RightBar;
