import React from 'react';
import loadingGif from '../assets/loading.gif'; 

const LoadingSpinner = ({ message = "데이터를 분석 중입니다..." }) => {
  return (
    <div className="loading-container">
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;