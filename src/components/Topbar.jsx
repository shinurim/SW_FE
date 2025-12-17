import React from 'react';
import { useAuth } from '../contexts/AuthContext';


import userAvatar from '../assets/user.png'; 

function Topbar({ user }) {
  const { logout } = useAuth();

  return (
    <header className="topbar">

      <div style={{ width: '140px' }}></div>

      <div className="topbar-right">
        <div className="profile-box">

          <img 
            src={userAvatar} 
            alt="Profile" 
            className="profile-avatar" 
          />

          <div className="profile-meta">
            <span className="profile-name">{user?.name || '사용자'}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          LogOut
        </button>
      </div>
    </header>
  );
}

export default Topbar;