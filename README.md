<h2>🎬DB Bridge</h2>
자연어 질의를 통한 고품질의 패널 추출

▶️ [GitHub에서 시연 영상 바로 재생하기](https://github.com/shinurim/SW_BE/issues/1#issue-3734958059)

<hr>

<h2>👀Preview</h2>
<p align="center">
  <img src="./assets/판넬.png" width="900" />
</p>
<hr>

<h2>👥 Members</h2>

<table align="center" cellpadding="14">
  <tr>
    <td align="center">
      <img src="./members/yurim.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/shinurim">신유림</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/mint02123.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/mint02123">민재영</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/jonghwa-8620.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/jonghwa-8620">박종화</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/suheon98.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/suheon98">조수헌</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/rokiosm.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/rokiosm">문경록</a>
      </div>
    </td>
  </tr>
</table>
<hr>

<h2>🛠 Tech Stack</h2>

*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Styling:** CSS
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **Linting:** [ESLint](https://eslint.org/)

<hr>

<h2>🧩Project Structure</h2>

```
.
├── public/
├── src/
│   ├── api/             # API 호출 관련 함수 (axios 인스턴스)
│   ├── assets/          # 프로젝트 내부에서 사용하는 에셋
│   │
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   │   ├── InsightFinal.jsx      # 인사이트 최종 결과 표시
│   │   ├── KeywordSelector.jsx   # 키워드 선택 드롭다운
│   │   ├── LoadingSpinner.jsx    # 로딩 스피너
│   │   ├── Sidebar.jsx           # 사이드바 메뉴
│   │   └── Topbar.jsx            # 상단바
│   │
│   ├── contexts/        # React Context (전역 상태 관리)
│   │   └── AuthContext.jsx       # 인증 관련 Context
│   │
│   ├── data/            # 정적 데이터
│   │   └── keywords.js         # 검색용 키워드 목록
│   │
│   ├── pages/           # 라우팅되는 페이지 컴포넌트
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx     # 로그인 페이지
│   │   │   └── SignupPage.jsx    # 회원가입 페이지
│   │   │
│   │   ├── CheckboxSearchPage/
│   │   │   └── CheckboxSearchPage.jsx # 체크박스 기반 검색 페이지
│   │   │
│   │   ├── DashboardPage/
│   │   │   └── DashboardPage.jsx   # 대시보드
│   │   │
│   │   ├── dictionary/
│   │   │   └── Dictionary.jsx      # 용어 사전
│   │   │
│   │   ├── howtouse/
│   │   │   └── Howtouse.jsx        # 서비스 사용법 안내
│   │   │
│   │   ├── mypage/
│   │   │   └── MyPage.jsx          # 마이페이지
│   │   │
│   │   ├── SearchPage/
│   │   │   └── SearchPage.jsx      # 자연어 검색 페이지
│   │   │
│   │   └── SegmentPage/
│   │       └── SegmentPage.jsx     # 세그먼트 분석 페이지
│   │
│   ├── styles/          # 전역 및 공통 스타일
│   └── utils/           # 유틸리티 함수
│       └── excelExporter.js  # Excel 내보내기 기능
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

<hr>

<h2>🚀 Getting Started</h2>

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm

### Installation & Running
  <pre><code>#Clone the repository
    git clone https://github.com/hansung-sw-capstone-2025-2/2025_8_B_FE.git
    cd 2025_8_B_FE
  </pre></code>
  <pre><code>#Install dependencies
    npm install
  </pre></code>
  <pre><code>#Create a `.env.local` file** in the root of the project and add your environment variables.
    VITE_API_BASE_URL=http://your-backend-api-url.com
  </pre></code>
  <pre><code>#Run the development server
    npm run dev
  </pre></code>
<hr>

<h2>🔑 Key Features</h2>

*   **자연어 기반 패널 검색**: "서울에 사는 20대 남성"처럼 일상적인 언어로 원하는 조건의 사용자를 간편하게 검색할 수 있습니다.
*   **상세 조건 필터링**: 다양한 카테고리와 키워드를 체크박스로 선택하여 원하는 사용자 그룹을 정교하게 추출합니다.
*   **데이터 시각화 대시보드**: 검색된 사용자 데이터를 다양한 차트와 그래프로 시각화하여 직관적인 분석을 돕습니다.
*   **세그먼트 분석**: 특정 조건으로 그룹화된 사용자들의 특징과 인사이트를 심층적으로 분석하고 리포트를 제공합니다.
*   **결과 데이터 다운로드**: 분석한 결과를 Excel 파일로 다운로드하여 보고서나 다른 자료에 활용할 수 있습니다.

<hr>
<h2>License</h2>
<p>본 프로젝트는 한성대학교 기업연계 SW캡스톤디자인 수업에서 진행되었습니다.</p>
