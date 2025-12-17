import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPages.css';

function LoginPage({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);

    if (!success) {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <span>DBee</span><span>Bridge</span>
        </div>
        
        <h2>로그인</h2>

        <div className="auth-form-group">
          <label>아이디</label>
          <input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="auth-form-group">
          <label>비밀번호</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button">로그인</button>

        <div className="auth-links">
          <button type="button" onClick={() => onNavigate('signup')}>회원가입</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
