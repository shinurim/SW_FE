import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { FaDownload } from 'react-icons/fa';
import { exportToExcel } from '../../utils/excelExporter';
import './CheckboxSearchPage.css'

const STATIC_FILTERS = {
  //데이터 생략
};

// 상세 패널에 보여줄 필드 목록
const DETAIL_FIELDS = [
  //데이터 생략
];

// --- 2. CheckboxSearchPage 컴포넌트 ---
function CheckboxSearchPage() {
  const [filters] = useState(STATIC_FILTERS);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [resultsData, setResultsData] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 체크박스 변경
  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => {
      const currentCategoryValues = prev[category] || [];
      let newCategoryValues;

      if (currentCategoryValues.includes(value)) {
        newCategoryValues = currentCategoryValues.filter(v => v !== value);
      } else {
        newCategoryValues = [...currentCategoryValues, value];
      }

      if (newCategoryValues.length === 0) {
        const { [category]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [category]: newCategoryValues
      };
    });
  };

  // --- 검색 실행 ---
  const handleSearchSubmit = async () => {
    setIsLoading(true);
    setResultsData([]);
    setSelectedPerson(null);

    try {
      console.log("[REAL API] POST /api/v1/panels/search 호출", selectedFilters);
      const response = await axiosInstance.post('/api/v1/panels/search', selectedFilters);
      const data = Array.isArray(response.data) ? response.data : [];

      // loyalty 기준 내림차순 정렬
      const sorted = [...data].sort((a, b) => (b.loyalty || 0) - (a.loyalty || 0));

      setResultsData(sorted);
      if (sorted.length > 0) {
        setSelectedPerson(sorted[0]);
      }
    } catch (err) {
      console.error("Checkbox search failed:", err);
      alert(err.response?.data?.error || "검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    if (resultsData.length === 0) {
      alert("다운로드할 검색 결과가 없습니다.");
      return;
    }
    exportToExcel(resultsData, 'Checkbox_Search_Results');
  };

  // 초기화
  const handleResetFilters = () => {
    setSelectedFilters({});
    setResultsData([]);
    setSelectedPerson(null);
  };

  const totalSelectedCount = Object.values(selectedFilters).reduce(
    (acc, values) => acc + values.length,
    0
  );

  // id 헬퍼
  const getRowId = (row, idx) =>
    row.uid || row.id || row.고유번호 || row.panel_id || idx;

  // 왼쪽 리스트 한 줄 메타 정보: 성별 / birth / region-subregion / job
  const getRowMeta = (row) => {
    const parts = [];
    if (row.gender) parts.push(row.gender);
    if (row.birth) parts.push(String(row.birth));     
    if (row.region || row.subregion) {
      parts.push(`${row.region || ''}${row.subregion ? ' ' + row.subregion : ''}`);
    }
    if (row.job) parts.push(row.job);
    return parts.join(' · ');
  };

  return (
    <div className="content-wrap">
      <header className="page-header">
        <h1 className="page-title">Checkbox Search</h1>
      </header>

      <div className="big-panel">
        {/* --- 1. 필터 카드 --- */}
        <div className="filter-card">
          <div className="checkbox-filters-grid">
            {Object.keys(filters).map(categoryKey => (
              <fieldset key={categoryKey}>
                <legend>{categoryKey}</legend>
                <div className="option-group">
                  {filters[categoryKey].map(option => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={(selectedFilters[categoryKey] || []).includes(option)}
                        onChange={() => handleFilterChange(categoryKey, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="filter-actions">
            <button
              className="btn-run"
              onClick={handleSearchSubmit}
              disabled={totalSelectedCount === 0 || isLoading}
            >
              {isLoading ? 'Searching...' : `Run Search (${totalSelectedCount})`}
            </button>
            <button className="btn-reset" onClick={handleResetFilters}>
              Reset All
            </button>
            <div className="summary-bar">
              {Object.keys(selectedFilters).map(key =>
                selectedFilters[key].map(value => (
                  <span key={key + value} className="summary-chip">
                    {value}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- 2. 결과 카드 --- */}
        {resultsData.length > 0 && (
          <div className="result-card">
            <div className="result-title">
              <span>Found {resultsData.length} panels</span>
              <button className="btn btn-save-excel" onClick={handleExcelDownload}>
                <FaDownload size={12} /> Download Excel
              </button>
            </div>

            <div className="person-results">
            {/* 2-1. 왼쪽: 패널 목록 (loyalty 내림차순) */}
            <div className="person-list">
              {resultsData.map((row, idx) => {
                const rowId = getRowId(row, idx);
                const isActive =
                  selectedPerson &&
                  getRowId(selectedPerson, -1) === rowId;

                return (
                  <div
                    key={rowId}
                    className={`person-row ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedPerson(row)}
                  >
                    <div className="person-row-header">
                      <span className="person-name">{rowId}</span>
                      {row.loyalty != null && (
                        <span className="loyalty-score">Loyalty {row.loyalty}</span>
                      )}
                    </div>

                    <span className="person-meta">
                      {getRowMeta(row)}
                    </span>

                    <div className="loyalty-bar">
                      <span
                        className="loyalty-fill"
                        style={{ width: `${row.loyalty || 0}%` }}
                      ></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedPerson && (
              <div className="person-detail">
                <div className="detail-identity-title">
                  {getRowId(selectedPerson, -1)}
                </div>

                <div className="detail-section-title">Panel Details</div>
                <div className="detail-kv-grid">
                  {DETAIL_FIELDS.map(({ key, label }) => {
                    const value = selectedPerson[key];
                    if (value === undefined || value === null || value === '') {
                      return null;
                    }
                    return (
                      <div className="detail-row" key={key}>
                        <span className="detail-key">{label}</span>
                        <span className="detail-value">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckboxSearchPage;
