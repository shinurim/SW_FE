import React, { useState } from 'react';
import './HowToUse.css';

function HowToUse() {
  const [openSections, setOpenSections] = useState({
    search: false,
    checkbox: false,
    opinion: false,
    segment: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="content">
      <header className="page-header">
        <h1 className="page-title">How to use</h1>
      </header>

      {/* 1. Search 가이드 */}
      <div className="card">
        <h2 className="card-title" onClick={() => toggleSection('search')}>
          1. Search (자연어 검색) 가이드
        </h2>
        {openSections.search && (
          <p>
            자연어 검색창에 "경기도에 사는 30대..."와 같이 
            찾고 싶은 조건을 입력하고 'Run Query' 버튼을 누르세요.
          </p>
        )}
      </div>

      {/* 2. Checkbox Search 가이드 */}
      <div className="card">
        <h2 className="card-title" onClick={() => toggleSection('checkbox')}>
          2. Checkbox Search 가이드
        </h2>
        {openSections.checkbox && (
          <p>
            이 화면은 기존의 RDB(관계형 데이터베이스)를 잘 활용하는 사용자에게 적합한 검색 방식이에요.<br/><br/>
            필드 단위로 조건을 직접 선택해 필터링하므로, 데이터가 어떤 구조인지 이해하고 계신 분들이 사용하면 훨씬 빠르게 원하는 조건을 찾을 수 있습니다.
            <br/><br/>
            초급자이거나, “정확한 결과를 자연어처럼 간단하게 찾고 싶다!”라면
            👉 Search(자연어 검색) 기능을 먼저 사용하는 것을 추천드려요.
            <br /><br/>
            원하는 필터 조건을 체크박스로 선택한 후 'Run Search' 버튼을 누르세요.
          </p>
        )}
      </div>

      {/* 3. Opinion 가이드 */}
      <div className="card">
        <h2 className="card-title" onClick={() => toggleSection('opinion')}>
          3. Opinion 가이드
        </h2>
        {openSections.opinion && (
          <p>
            예를 들면:<br/>
            “30대 남성 중 담배 구매 경험이 있는 사용자”<br/>
            “1인 가구이며 월 소득 200만 원 이하인 그룹”<br/>
            “매월 술을 5회 이상 마시는 사용자 세트”<br/>
            이런 식으로 공통된 특성을 가진 사용자들을 하나의 Segment로 만들고 비교하거나 분석할 수 있어요.
          </p>
        )}
      </div>

      {/* 4. Segment 가이드 */}
      <div className="card">
        <h2 className="card-title" onClick={() => toggleSection('segment')}>
          4. Segment 가이드
        </h2>
        {openSections.segment && (
          <p>
            <b>✔ 1) 핵심 지표 요약</b><br/>
            선택된 조건에 따라: 몇 명이 해당 조건에 포함되는지, 어떤 연령대·성별이 가장 많은지, 소비 패턴이나 행동의 특징은 무엇인지
            이런 요약된 통계를 보여줘요.<br/><br/>

            <b>✔ 2) 행동 패턴 분석</b><br/>
            예를 들어:<br/>
            “흡연자 중 주 1~2회 이상 술을 마시는 비율이 높은가?”<br/>
            “30대 1인 가구가 어떤 브랜드 선호 경향을 보이는가?”<br/>
            “특정 조건에서 소비 비용이 증가하는 이유는 무엇인가?”<br/>
            이런 연결 관계를 도표나 문장으로 알려줘요.<br/><br/>

            <b>✔ 3) 추천 Insight 제공</b><br/><br/>
            데이터를 기반으로 의미 있는 패턴이나 이상치를 발견하면
            자동으로 “읽기 쉬운 요약 문장”으로 전달해줘요.<br/><br/>
            예시:<br/>
            “A 그룹은 B 그룹보다 외식비가 27% 더 높습니다.”<br/>
            “세그먼트 내 사용자 중 45%가 최근 3개월간 소비가 증가했습니다.”<br/>
            “이 사용자군은 특정 브랜드에 대한 충성도가 높습니다.”<br/><br/>

            <b>✔ 4) 비즈니스 활용 포인트 제안</b><br/>
            Insight는 단순 통계가 아니라 해석까지 해줘요.<br/><br/>
            예시:<br/>
            “이 집단은 특정 브랜드 프로모션에 반응할 가능성이 높습니다.”<br/>
            “구매 빈도가 낮아진 집단이므로 유지 전략이 필요합니다.”<br/>
            “광고 타겟팅 시 이 세그먼트를 분리하는 것이 효율적입니다.”<br/>
          </p>
        )}
      </div>
    </div>
  );
}

export default HowToUse;
