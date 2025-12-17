import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { FaUsers, FaPoll, FaMousePointer, FaPercent } from 'react-icons/fa';
import { FaRegMessage } from "react-icons/fa6";
import './DashboardPage.css';

const mockData = {
  cards: [
    { id: 1, title: "Total User", value: "36,094", iconColor: "purple" },
    { id: 2, title: "Total Surveys", value: "67", iconColor: "yellow" },
    { id: 3, title: "Participants in a recent survey", value: "4,543", iconColor: "green" },
    { id: 4, title: "Frequency of recent user responses", value: "12.58%", iconColor: "orange" }
  ],
  howtouse: [ 
    { "type": "설문", "text": " " },
    { "type": "질의", "text": "" }
  ],
  chartData: [
    { week: "5k", "응답자 수":  1},
    { week: "10k", "응답자 수": 1},
    { week: "15k", "응답자 수": 1 },
    { week: "20k", "응답자 수": 1 },
    { week: "22k", "응답자 수": 1},
    { week: "25k", "응답자 수": 1 },
    { week: "30k", "응답자 수": 1 },
    { week: "35k", "응답자 수": 1 },
    { week: "40k", "응답자 수": 1 },
    { week: "45k", "응답자 수": 1 },
    { week: "50k", "응답자 수": 1 }
  ]
};

const iconMap = {
  purple: <FaUsers size={24} />,
  yellow: <FaPoll size={24} />,
  green: <FaMousePointer size={24} />,
  orange: <FaPercent size={24} />
};


// --- 2. DashboardPage 컴포넌트 ---
function DashboardPage({ onNavigate }) {
  // [가짜 데이터] (유지)
  const [dashboardData, setDashboardData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const [recentQueries, setRecentQueries] = useState([]);

  //헨들러
  const handleQueryClick = (queryText) => {
    localStorage.setItem('fromInsightQuery', queryText);
    onNavigate('search');
  };


  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem('recentQueries') || '[]';
      setRecentQueries(JSON.parse(rawHistory));
    } catch (error) {
      console.error("Failed to load query history:", error);
      setRecentQueries([]);
    }
  }, []); // 페이지 로드 시 1회 실행

  if (isLoading) {
    return <div className="content"><p>Loading dashboard...</p></div>;
  }
  if (error) {

    return <div className="content"><p style={{ color: '#EF4444' }}>{error}</p></div>;
  }
  if (!dashboardData) {
    return <div className="content"><p>No data available.</p></div>;
  }
  

  return (
    <div className="content-wrap">
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </header>

      {/* --- 1. 상단 4개 카드 그리드 --- */}
      <div className="dashboard-cards-grid">
        {dashboardData.cards.map((card) => (
          <div className="summary-card" key={card.id}>
            <div className="summary-card-content">
              <span className="summary-card-title">{card.title}</span>
              <span className="summary-card-value">{card.value}</span>
              <span className={`summary-card-change ${card.changeType}`}>
                {card.change}
              </span>
            </div>
            <div className={`summary-card-icon ${card.iconColor}`}>
              {iconMap[card.iconColor] || <FaUsers size={24} />}
            </div>
          </div>
        ))}
      </div>


      <div className="example-card">
        <h2 className="example-card-title">
          <FaRegMessage style={{ marginRight: '8px' }} />
          Recent Survey
        </h2>
        

        {dashboardData.howtouse
          .filter(example => example.type === '설문') // 설문만 표시
          .map((example, index) => (
            <div className="example-item" key={index}>
              <span className="example-item-tag example-tag-survey">
                {example.type}
              </span>
              <span>{example.text}</span>
            </div>
          ))}


      </div>


      <div className="example-card">
        <h2 className="example-card-title">
          <FaRegMessage style={{ marginRight: '8px' }} />
          Recent Query
        </h2>

        {recentQueries.length > 0 ? (
          recentQueries.map((query, index) => (
            
            <button 
              className="example-item as-button"
              key={index}
              onClick={() => handleQueryClick(query)}
              title="이 질의로 Search 페이지 열기"
            >
              <span className="example-item-tag example-tag-query">
                Query
              </span>
              <span>{query}</span>
            </button>

          ))
        ) : (
          <div className="example-item">
            <span className="example-item-tag example-tag-query">
              질의
            </span>
            <span>최근 질의 내역이 없습니다. Search 페이지에서 검색해 보세요.</span>
          </div>
        )}
      </div>
  


      {/* --- 3. 메인 차트 카드 --- */}
      <div className="chart-card">
        <h2 className="chart-card-title">Recent Survey Responses</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={dashboardData.chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="응답자 수"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;