import React, { useRef } from 'react';
import './Dictionary.css';

function Dictionary() {
  const refs = {
    search: useRef(null),
    runQuery: useRef(null),
    checkboxSearch: useRef(null),
    runSearch: useRef(null),
    opinion: useRef(null),
    dashboard: useRef(null),
    checkbox: useRef(null),
    segment: useRef(null),
    segmentContent: useRef(null),
    insight: useRef(null),
    rdb: useRef(null),
    json: useRef(null),
    combobox: useRef(null),
  };

  const scrollTo = (key) => {
    refs[key].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="content">
      <header className="page-header">
        <h1 className="page-title">Dictionary</h1>
      </header>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 좌측 카드 내용 */}
        <div style={{ flex: 1 }}>
          <div className="card" ref={refs.search}>
            <h2 className="card-title">주요 용어 정의</h2>
            <p>
              <b>Search (자연어 검색):</b><br />
              사용자가 자연어(자연어 문장 형태)로 쿼리를 입력하면 시스템이 이를 해석해 데이터베이스나 인덱스에서 관련 결과를 찾아주는 검색 방식. 복잡한 필터나 정확한 컬럼명을 몰라도 사람 말로 검색할 수 있다는 장점이 있다.
            </p>
          </div>

          <div className="card" ref={refs.runQuery}>
            <p>
              <b>Run Query :</b><br />
              자연어 검색 또는 쿼리 실행을 트리거하는 UI 액션(버튼)을 지칭. 입력된 질의를 해석해 백엔드에 전달하고 결과를 반환받는 일련의 동작 전체를 포함한다.
            </p>
          </div>

          <div className="card" ref={refs.checkboxSearch}>
            <p>
              <b>Checkbox Search :</b><br />
              사용자가 미리 정의된 여러 필터 항목(예: 연령대, 지역, 관심사 등)을 체크하여 정확한 조건을 구성한 뒤 검색을 실행하는 방식. RDB 기반 컬럼과 매핑하기 쉬운 구조적 검색에 적합하다.
            </p>
          </div>

          <div className="card" ref={refs.runSearch}>
            <p>
              <b>Run Search :</b><br />
              체크박스 기반의 필터 선택 후 실제 검색을 시작하는 UI 트리거. 선택된 필터들을 조합해 서버에 요청을 보낸 뒤 결과를 수신하고 표시한다.
            </p>
          </div>

          <div className="card" ref={refs.opinion}>
            <p>
              <b>Opinion :</b><br />
              주로 사용자의 주관적 의견, 또는 설문/의견 데이터를 나타내는 항목. 서비스 문맥에 따라 사용자 리포트, 텍스트 의견요약, 감성 분석 결과 등으로 활용될 수 있다.
            </p>
          </div>

          <div className="card" ref={refs.dashboard}>
            <p>
              <b>Dashboard :</b><br />
              데이터 요약, 지표, 시각화 차트, 주요 알림 등을 한 화면에 모아 보여주는 UI 구성. 의사결정용으로 핵심 KPI나 실시간 지표를 집계·표시하는 역할을 한다.
            </p>
          </div>

          <div className="card" ref={refs.checkbox}>
            <p>
              <b>Checkbox (UI 요소):</b><br />
              하나 이상의 선택 항목을 독립적으로 켜고 끌 수 있는 입력 위젯. 여러 조건을 동시에 조합할 때 유용하며, 체크 상태는 불리언 값(true/false)으로 처리된다.
            </p>
          </div>

          <div className="card" ref={refs.segment}>
            <p>
              <b>Segment (세그먼트):</b>
              <br />
              사용자 또는 데이터 집합을 특정 기준으로 분할한 그룹을 의미. 예: 연령대별, 지역별, 구매빈도별 등. 세그먼트는 타깃 분석, 캠페인 집행, 퍼스널라이제이션 등에 사용된다.
            </p>
          </div>

          <div className="card" ref={refs.segmentContent}>
            <p>
              <b>Segment 콘텐츠 :</b><br />
              세그먼트별로 보여주는 요약 정보·시각화·표·설명 등을 통칭. 각 세그먼트의 특성, 크기, 분포, 주요 지표 등을 포함할 수 있다.
            </p>
          </div>

          <div className="card" ref={refs.insight}>
            <p>
              <b>Insight :</b><br />
              데이터 분석을 통해 도출된 의미 있는 발견이나 해석. 단순한 수치 나열이 아닌, '왜 그런 결과가 나왔는지', '어떤 행동이 필요한지'를 설명하는 해석적 결과물로서, 의사결정에 직접적인 가치를 제공한다.
            </p>
          </div>

          <div className="card" ref={refs.rdb}>
            <p>
              <b>RDB (관계형 데이터베이스): </b><br />
             테이블(행/열)로 데이터를 구조화하여 저장하는 데이터베이스 시스템. 스키마(테이블 구조), 정규화, SQL 쿼리를 통해 복잡한 관계형 데이터를 일관성 있게 관리·조회·갱신하는 데 최적화되어 있다.
            </p>
          </div>

          <div className="card" ref={refs.json}>
            <p>
              <b>JSON :</b><br />
              키-값 쌍으로 구조화된 텍스트 데이터 포맷. 설정, 매핑, 응답 데이터 등에서 널리 사용된다. 가독성과 프로그래밍 언어 간 호환성이 좋아 API와 구성 파일에 자주 활용된다.
            </p>
          </div>

          <div className="card" ref={refs.combobox}>
            <p>
              <b>Combobox :</b><br />
              드롭다운 목록과 입력 필드를 결합한 UI 요소. 사용자는 목록에서 선택하거나 직접 입력할 수 있으며, 파일 목록·플랫폼 목록 등 동적 선택 UI에 자주 쓰인다.
            </p>
          </div>
        </div>

        {/* 우측 태그 메뉴 */}
        <aside className="tags" style={{ width: '250px' }}>
          <h3>Tags</h3>
          <ul>
            <li onClick={() => scrollTo("search")}>Search</li>
            <li onClick={() => scrollTo("runQuery")}>Run Query</li>
            <li onClick={() => scrollTo("checkboxSearch")}>Checkbox Search</li>
            <li onClick={() => scrollTo("runSearch")}>Run Search</li>
            <li onClick={() => scrollTo("opinion")}>Opinion</li>
            <li onClick={() => scrollTo("dashboard")}>Dashboard</li>
            <li onClick={() => scrollTo("checkbox")}>Checkbox</li>
            <li onClick={() => scrollTo("segment")}>Segment</li>
            <li onClick={() => scrollTo("segmentContent")}>Segment 콘텐츠</li>
            <li onClick={() => scrollTo("insight")}>Insight</li>
            <li onClick={() => scrollTo("rdb")}>RDB</li>
            <li onClick={() => scrollTo("json")}>JSON</li>
            <li onClick={() => scrollTo("combobox")}>Combobox</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default Dictionary;
