import React from 'react';

function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="logo"><span>DBee</span><span>Bridge</span></div>
      
      <div className="nav-block">
        <div 
          className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </div>
        

        <div 
          className={`nav-item ${currentPage === 'search' ? 'active' : ''}`}
          onClick={() => onNavigate('search')}
        >
          Search
        </div>
   

        <div 
          className={`nav-item ${currentPage === 'checkbox' ? 'active' : ''}`}
          onClick={() => onNavigate('checkbox')}
        >
          Checkbox Search
        </div>
        <div 
          className={`nav-item ${currentPage === 'segment' ? 'active' : ''}`}
          onClick={() => onNavigate('segment')}
        >
          Insight
        </div>
        
      </div>
      
      <div className="nav-block">
        <div 
          className={`nav-item ${currentPage === 'mypage' ? 'active' : ''}`}
          onClick={() => onNavigate('mypage')}
        >
          My page
        </div>
        <div 
        className={`nav-item ${currentPage === 'dictionary' ? 'active' : ''}`}
        onClick={() => onNavigate('dictionary')}
      >
        Dictionary
      </div>

      <div 
        className={`nav-item ${currentPage === 'howtouse' ? 'active' : ''}`}
        onClick={() => onNavigate('howtouse')}
      >
        How to use
      </div>

      </div>
    </aside>
  );
}

export default Sidebar;