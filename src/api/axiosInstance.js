// src/api/axiosInstance.js

import axios from 'axios';

// Django의 CSRF 토큰을 쿠키에서 가져오는 헬퍼 함수
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:8000", 
  baseURL: "http://10.93.76.16:8000",
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 1. 요청 인터셉터 ---

axiosInstance.interceptors.request.use(
  (config) => {
    // Django CSRF 토큰 설정
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    
    // Access Token 설정
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- 2. 응답 인터셉터 ---
// (토큰 갱신 로직 수정)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {

        const refreshResponse = await axios.post('/api/v1/auth/refresh', {
          refresh: refreshToken 
        }, {
          headers: { 'X-CSRFToken': getCookie('csrftoken') }
        });


        // 'access' -> 'accessToken'으로 변경
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        
        // 새 토큰 저장
        localStorage.setItem('accessToken', newAccessToken);
        
        // [추가] API가 새 refreshToken을 주면, 그것도 갱신 (Token Rotation)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // 원래 요청의 헤더를 새 토큰으로 교체
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // 원래 요청 다시 시도
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;