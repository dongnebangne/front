import React from 'react';
import './MapBox.css'; // MapBox에 대한 스타일 파일
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const MapBox = () => {
    return (
        <div className="mapBox">
            <h2>Safe-Cid</h2>
            <Divider/>
            <div className="button-container">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                <Grid item xs={6}>
                <button className="map-button">범죄주의구간</button>
                </Grid>
                <Grid item xs={6}>
                <button className="map-button">자취촌 범죄주의구간</button>
                </Grid>
                <Grid item xs={6}>
                <button className="map-button">노인 대상 <br/>범죄주의구간</button>
                </Grid>
                <Grid item xs={6}>
                <button className="map-button">어린이 대상<br/> 범죄주의구간</button>
                </Grid>
                <Grid item xs={6}>
                <button className="map-button">치안사고통계</button>
                </Grid>
                <Grid item xs={6}>
                <button className="map-button">여성 밤길 <br/>치안안전</button>
                </Grid>
                {/* 필요에 따라 추가적인 버튼들을 여기에 추가하세요 */}
            
            </Grid>
            </div>
        </div>
    );
};

export default MapBox;
