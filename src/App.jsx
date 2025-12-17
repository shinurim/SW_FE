import React, { useState } from 'react';
import './index.css'; 

// Auth 관련
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import './pages/auth/AuthPages.css';
import './components/KeywordSelector.css';

// 부품
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';

// 페이지
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';
import SearchPage from './pages/SearchPage/SearchPage.jsx';
import CheckboxSearchPage from './pages/CheckboxSearchPage/CheckboxSearchPage.jsx';
import SegmentPage from './pages/SegmentPage/SegmentPage.jsx';

// InsightPage 제거
import MyPage from './pages/mypage/MyPage.jsx';

// 새 페이지
import HowToUsePage from './pages/howtouse/Howtouse.jsx';
import DictionaryPage from './pages/dictionary/Dictionary.jsx';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  const [authPage, setAuthPage] = useState('login'); 

  // 메인 페이지 라우팅 상태
  const [mainPage, setMainPage] = useState('dashboard');

  //  - SearchPage에서 rdb_gateway 응답을 받아 세팅
  //  - SegmentPage(그리고 필요하면 다른 페이지)에서 재사용
  const [analysisContext, setAnalysisContext] = useState(null);
  const [insightBootstrap, setInsightBootstrap] = useState(null);

  // --- 1. 로그인하지 않은 사용자 ---
  if (!user) {
    if (authPage === 'login')   return <LoginPage onNavigate={setAuthPage} />;
    if (authPage === 'signup')  return <SignupPage onNavigate={setAuthPage} />;
    return <LoginPage onNavigate={setAuthPage} />;
  }

  // --- 2. 로그인한 사용자 ---
  return (
    <div className="app">
      <Sidebar 
        currentPage={mainPage} 
        onNavigate={setMainPage} 
      />
      
      <div className="main">
        <Topbar user={user} />
        
        {mainPage === 'dashboard' && (
          <DashboardPage 
            onNavigate={setMainPage}
            analysisContext={analysisContext}
            insightBootstrap={insightBootstrap}
          />
        )}
        
        {/* ✅ SearchPage: rdb_gateway 결과를 받아 상위(App)에 올려줌 */}
        {mainPage === 'search' && (
          <SearchPage 
            onNavigate={setMainPage}
            setAnalysisContext={setAnalysisContext}
            setInsightBootstrap={setInsightBootstrap}
          />
        )}

        {mainPage === 'checkbox' && <CheckboxSearchPage />}

        {/* ✅ SegmentPage: Search에서 만든 컨텍스트를 받아 사용 */}
        {mainPage === 'segment' && (
          <SegmentPage 
            onNavigate={setMainPage}
            analysisContext={analysisContext}
            insightBootstrap={insightBootstrap}
          />
        )}

        {mainPage === 'mypage' && <MyPage />}
        {mainPage === 'howtouse' && <HowToUsePage />}
        {mainPage === 'dictionary' && <DictionaryPage />}
      </div>
    </div>
  );
}

export default App;
