import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import './MyPage.css';
import '../../pages/auth/AuthPages.css';
import KeywordSelector from '../../components/KeywordSelector';

function MyPage() {
  const { user, updateUser } = useAuth();   

  const [profileData, setProfileData] = useState({
    email: '',
    name: '',
    team: '',
  });
  const [keywords, setKeywords] = useState([]);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // =========================
  // 1) 프로필 조회 
  // =========================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get('/api/v1/mypage', {
          params: { user_id: user?.user_id },
        });


        setProfileData({
          email: res.data.email || '',
          team: res.data.team || '',
        });

        const kw = res.data.keywords;
        if (Array.isArray(kw)) {
          setKeywords(kw);
        } else if (typeof kw === 'string' && kw.trim() !== '') {
          setKeywords(
            kw
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          );
        } else {
          setKeywords([]);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setProfileMessage({
          type: 'error',
          text:
            error.response?.data?.error ||
            '정보를 불러오는데 실패했습니다.',
        });
      }
    };

    fetchUserData();
  }, []);

  // =========================
  // 2) 프로필 수정
  // =========================
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });

    try {
        const res = await axiosInstance.patch('/api/v1/user/profile', {
          user_id: user?.user_id,
          email: profileData.email,
          keywords: keywords,
        });
        
      if (res.data?.user && typeof updateUser === 'function') {
        updateUser(res.data.user);
      }

      setProfileMessage({
        type: 'success',
        text: res.data?.message || '프로필이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      console.error('Profile update failed', error);
      setProfileMessage({
        type: 'error',
        text:
          error.response?.data?.error ||
          '프로필 저장에 실패했습니다.',
      });
    }
  };

  // =========================
  // 3) 비밀번호 변경
  // =========================
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
      setPasswordMessage({
        type: 'error',
        text: '새 비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    try {
        const res = await axiosInstance.patch('/api/v1/mypage/password', {
          user_id: user?.user_id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });

      setPasswordMessage({
        type: 'success',
        text: res.data?.message || '비밀번호가 성공적으로 변경되었습니다.',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
    } catch (error) {
      console.error('Password change failed', error);
      setPasswordMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          '비밀번호 변경에 실패했습니다.',
      });
    }
  };

  return (
    <div className="content">
      <header className="page-header">
        <h1 className="page-title">My Page</h1>
      </header>

      <div className="mypage-grid">
        {/* --- 1. 프로필 수정 카드 --- */}
        <div className="card">
          <h2 className="card-title">프로필 수정</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>아이디 (수정 불가)</label>
              <input
                type="text"
                value={user?.user_id || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="form-input"
              />
            </div>

            <div className="auth-form-group">
              <label>관심 키워드</label>
              <KeywordSelector
                selectedKeywords={keywords}
                onKeywordsChange={setKeywords}
                maxCount={3}
              />
            </div>

            {profileMessage.text && (
              <p
                className={
                  profileMessage.type === 'success'
                    ? 'auth-message'
                    : 'auth-error'
                }
              >
                {profileMessage.text}
              </p>
            )}

            <button type="submit" className="btn btn-primary">
              프로필 저장
            </button>
          </form>
        </div>

        {/* --- 2. 비밀번호 변경 카드 --- */}
        <div className="card">
          <h2 className="card-title">비밀번호 변경</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPasswordConfirm">새 비밀번호 확인</label>
              <input
                type="password"
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                value={passwordData.newPasswordConfirm}
                onChange={handlePasswordChange}
                className="form-input"
                required
              />
            </div>

            {passwordMessage.text && (
              <p
                className={
                  passwordMessage.type === 'success'
                    ? 'auth-message'
                    : 'auth-error'
                }
              >
                {passwordMessage.text}
              </p>
            )}

            <button type="submit" className="btn btn-primary">
              비밀번호 변경
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
