import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPages.css';
import KeywordSelector from '../../components/KeywordSelector';

function SignupPage({ onNavigate }) {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [keywords, setKeywords] = useState([]); // 선택된 키워드 (최대 3개)
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    
    const keywordsString = keywords.join(',');

    // username, password, email, keywordsString 순서로 넘김
    const success = await signup(
      formData.username,
      formData.password,
      formData.email,
      keywordsString
    );

    if (success) {
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      onNavigate('login');
    } else {
      setError('회원가입에 실패했습니다. (아이디/이메일 중복 등)');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <span>DBee</span><span>Bridge</span>
        </div>
        <h2>회원가입</h2>

        <div className="auth-form-group">
          <label htmlFor="username">아이디</label>
          <input type="text" id="username" name="username" onChange={handleChange} required />
        </div>

        <div className="auth-form-group">
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" name="email" onChange={handleChange} required />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" onChange={handleChange} required />
        </div>

        <div className="auth-form-group">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input type="password" id="passwordConfirm" name="passwordConfirm" onChange={handleChange} required />
        </div>

        <div className="auth-form-group">
          <label>관심 키워드</label>
          <KeywordSelector
            selectedKeywords={keywords}
            onKeywordsChange={setKeywords}
            maxCount={3}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button">회원가입 완료</button>

        <div className="auth-links">
          <button type="button" onClick={() => onNavigate('login')}>
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
