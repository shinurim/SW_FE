import React, { useState, useMemo, useRef, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { FaDatabase, FaChartPie, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';
import './SearchPage.css';

import InsightFinal from '../../components/InsightFinal';
import loadingGif from '../../assets/loading.gif';

import { exportToExcel } from '../../utils/excelExporter';

// --- 컬럼 ID 매핑 테이블 ---
const QID_MAP = {
  //데이터 생략
};

const MAX_HISTORY = 1;
const saveQueryToHistory = (query) => {
  try {
    const rawHistory = localStorage.getItem('recentQueries') || '[]';
    let history = JSON.parse(rawHistory);
    history = history.filter((item) => item !== query);
    history.unshift(query);
    const slicedHistory = history.slice(0, MAX_HISTORY);
    localStorage.setItem('recentQueries', JSON.stringify(slicedHistory));
  } catch (error) {
    console.error('Failed to save query history:', error);
  }
};

// --- SearchPage 컴포넌트 ---
function SearchPage({ onNavigate, analysisContext, setAnalysisContext, setInsightBootstrap }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sqlQuery, setSqlQuery] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');

  const [opinion, setOpinion] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const [recommendations, setRecommendations] = useState([]);

  const [sqlViewActive, setSqlViewActive] = useState(false);
  const [lastSearchContext, setLastSearchContext] = useState(null);

  const [insightContext, setInsightContext] = useState(null);
  const [stage3, setStage3] = useState(null); 

  // 인사이트 / 검색 섹션 위치 참조용
  const insightSectionRef = useRef(null);
  const querySectionRef = useRef(null); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;// 한페이지 10 명씩

  // 🔹 유사 질의 클릭 시: 검색창에 세팅 + 검색 영역으로 스크롤
  const handleSimilarQueryFromInsight = (text) => {
    setQuery(text);

    if (querySectionRef.current) {
      querySectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // 혹시 ref가 없을 때는 window 기준으로라도 올리기
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    try {
      const pending = localStorage.getItem('fromInsightQuery');
      if (pending) {
        setQuery(pending);
        localStorage.removeItem('fromInsightQuery');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      console.error('Failed to load query from insight:', e);
    }
  }, []);

  // --- [API 1] 자연어 검색 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setCurrentPage(1);
    setInsightContext(null);

    try {
      const response = await axiosInstance.post('/api/v1/search/text', { query });
      const data = response.data;

      setSummary(`총 ${data.count}명의 사용자를 찾았습니다. (${data.sql_executed_time})`);
      setSqlQuery(data.sql || '');
      setResults(Array.isArray(data.data) ? data.data : []);
      setLastSearchContext({ type: 'text', value: query });

      setOpinion(data.opinion || '');
      setMainCategory(data.main || '');
      setSubCategory(data.sub || '');

      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);

      setStage3({
        sql: data.sql || '',
        opinion: data.opinion || '',
        main: data.main || '',
        sub: data.sub || '',
        count: data.count || 0,
        sql_executed_time: data.sql_executed_time || '',
        data: data.data || [],
        retrieved_block: data.retrieved_block || null,
      });

      if (setAnalysisContext) {
        setAnalysisContext({
          id: null,
          query,
          sql: data.sql,
          opinion: data.opinion,
          main: data.main,
          sub: data.sub,
          count: data.count,
          sql_executed_time: data.sql_executed_time,
          data: data.data,
          retrieved_block: data.retrieved_block,
        });
      }

      saveQueryToHistory(query);
    } catch (err) {
      console.error('Search query failed:', err);
      const msg = err?.response?.data?.error || '검색 중 오류가 발생했습니다.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- [API 2] 수정된 SQL 실행 ---
  const handleRunModifiedSql = async () => {
    if (!sqlQuery) return;

    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    setInsightContext(null);

    try {
      const payload = {
        sql: sqlQuery,
        opinion: opinion,
        main: mainCategory,
        sub: subCategory,
      };

      const response = await axiosInstance.post('/api/v1/search/sql', payload);
      const data = response.data;

      setSummary(`총 ${data.count}명의 사용자를 찾았습니다. (${data.sql_executed_time})`);
      setResults(Array.isArray(data.data) ? data.data : []);
      setLastSearchContext({ type: 'sql', value: sqlQuery });

      setOpinion(data.opinion || 'N/A (User-provided SQL)');
      setMainCategory(data.main || 'N/A');
      setSubCategory(data.sub || 'N/A');

      setRecommendations([]);

      setStage3({
        sql: data.sql || sqlQuery,
        opinion: data.opinion || opinion,
        main: data.main || mainCategory,
        sub: data.sub || subCategory,
        count: data.count || 0,
        sql_executed_time: data.sql_executed_time || '',
        data: data.data || [],
        retrieved_block: data.retrieved_block || null,
      });

      if (setAnalysisContext) {
        setAnalysisContext({
          id: null,
          query,
          sql: data.sql,
          opinion: data.opinion,
          main: data.main,
          sub: data.sub,
          count: data.count,
          sql_executed_time: data.sql_executed_time,
          data: data.data,
          retrieved_block: data.retrieved_block,
        });
      }
    } catch (err) {
      console.error('Modified SQL run failed:', err);
      const msg = err?.response?.data?.error || 'SQL 실행 중 오류가 발생했습니다.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 엑셀 다운로드 ---
  const handleExcelDownload = () => {
    if (!results || results.length === 0) {
      alert('다운로드할 검색 결과가 없습니다.');
      return;
    }
    exportToExcel(results, 'Search_Results_Full');
  };

  // --- 인사이트 생성 ---
  const handleGenerateInsight = () => {
    if (!results || results.length === 0) {
      alert('먼저 검색을 실행해 주세요.');
      return;
    }
    if (!stage3 || !stage3.sql) {
      alert('stage3에 sql이 없습니다. 검색을 다시 실행해 주세요.');
      return;
    }

    const currentQuery =
      lastSearchContext?.type === 'text' ? lastSearchContext.value : query;

    setInsightContext({
      type: 'text',
      value: currentQuery,
      stage3: stage3,
    });

    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (insightSectionRef.current) {
          insightSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    }, 150);
  };

  // --- 결과 테이블 컬럼 정렬 ---

  const orderedColumns = useMemo(() => {
    if (!results || results.length === 0) return [];

    // 1. 현재 모드 파악 (AI 모드인지, 일반 모드인지)
    const isAiMode = opinion && !opinion.startsWith('N/A');
    const executedSql = stage3?.sql || '';

    const sample = results[0] || {};
    const hidden = ['sim', 'loyalty', 'answers', 'qids_used'];

    // 2. 전체 컬럼 키 가져오기
    let cols = Object.keys(sample).filter((col) => {
      if (hidden.includes(col)) return false;
      const v = sample[col];
      return v === null || typeof v !== 'object';
    });

    // 3. [Safety Net] 데이터가 아예 없는(Empty) 컬럼은 기본적으로 제거
    // (어떤 모드든 값이 없는 빈 컬럼을 보여줄 필요는 없으므로)
    const validCols = cols.filter(col => {
      if (col === 'id') return true; 
      return results.some(row => {
        const val = row[col];
        if (val === null || val === undefined) return false;
        if (typeof val === 'string' && val.trim() === '') return false;
        return true;
      });
    });

    // 4. [핵심 분기 로직] 표시할 컬럼 최종 선별
    const finalCols = validCols.filter(col => {
      // (A) ID와 질문(Q)은 무조건 통과 (모든 케이스 공통)
      if (col === 'id') return true;
      if (/^q\d+$/i.test(col)) return true;

      // (B) 메타 정보 처리
      if (!isAiMode) {
        // Case 1: 메타 있고 Q 없는 경우 (오피니언 N/A) -> 메타 정보 다 보여줌
        return true;
      } else {
        // AI 모드인 경우 (오피니언 존재)
        // SQL 문자열 안에 해당 컬럼명이 포함되어 있는지 검사
        // Case 2: SQL에 WHERE절 없음 -> 컬럼명 없음 -> 숨김 (Q만 나옴)
        // Case 3: SQL에 'region' 등 조건 있음 -> 포함됨 -> 표시 (메타+Q 나옴)
        return executedSql.toLowerCase().includes(col.toLowerCase());
      }
    });

    // 5. 정렬 (ID -> 메타 -> Q문항 순서)
    return finalCols.sort((a, b) => {
      if (a === 'id') return -1;
      if (b === 'id') return 1;

      const isAQ = /^q\d+$/i.test(a);
      const isBQ = /^q\d+$/i.test(b);

      // Q문항끼리는 숫자 정렬
      if (isAQ && isBQ) return parseInt(a.slice(1)) - parseInt(b.slice(1));
      
      // 메타 정보를 Q보다 앞에 배치
      if (!isAQ && isBQ) return -1;
      if (isAQ && !isBQ) return 1;

      return a.localeCompare(b);
    });

  }, [results, opinion, stage3]);

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="content-wrap">
      <header className="page-header">
        <h1 className="page-title">Search</h1>
        <button
          className={`btn ${sqlViewActive ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSqlViewActive(!sqlViewActive)}
        >
          <FaDatabase />
          {sqlViewActive ? 'Hide SQL' : 'Show SQL'}
        </button>
      </header>

      <main className={sqlViewActive ? 'sql-view-active' : ''}>
        {/*  ref 추가 */}
        <form className="query-section" onSubmit={handleSubmit} ref={querySectionRef}>
          <div className="card">
            <h2 className="card-title">Natural Language Query</h2>
            <div className="form-group">
              <textarea
                className="form-textarea"
                placeholder="서울 사는 사람 중 환경문제에 관심 있는 사람"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Run Query'}
            </button>
          </div>

          <div className="sql-card">
            <h2 className="card-title sql-title">Generated SQL</h2>
            <div className="sql-editor-box">
              <Editor
                value={sqlQuery || '-- SQL will appear here after running query'}
                onValueChange={(code) => setSqlQuery(code)}
                highlight={(code) => highlight(code, languages.sql, 'sql')}
                padding={14}
                readOnly={isLoading}
                style={{
                  fontFamily: '"SF Mono", "Menlo", monospace',
                  fontSize: 13,
                  lineHeight: 1.5,
                  minHeight: '120px',
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '10px' }}
              onClick={handleRunModifiedSql}
              disabled={isLoading || !sqlQuery}
            >
              Run Modified SQL
            </button>
          </div>
        </form>
      </main>

      {(isLoading || isInsightLoading) && (
        <div className="loading-overlay">
          <img
            src={loadingGif}
            alt="Loading..."
            style={{ width: '300px', marginBottom: '16px' }}
          />
          <p>AI가 데이터를 분석하고 있습니다...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="result-section">
          <div className="result-summary">
            <strong>{summary}</strong>
          </div>

          <div className="opinion-box">
            <div className="opinion-item">
              <span className="opinion-label">AI Opinion</span>
              <span className="opinion-value">{opinion}</span>
            </div>

            {/* Main Category */}
            <div className="opinion-item">
              <span className="opinion-label">Main Category</span>
              {(!mainCategory || mainCategory === '-' || mainCategory === 'N/A' || mainCategory === '') ? (
                /* 값이 없으면 연한 태그로 '-' 표시 (모양 유지) */
                <span className="opinion-value tag-none">-</span>
              ) : (
                <span className="opinion-value tag-main">{mainCategory}</span>
              )}
            </div>

            {/* Sub Category */}
            <div className="opinion-item">
              <span className="opinion-label">Sub Category</span>
              {(!subCategory || subCategory === '-' || subCategory === 'N/A' || subCategory === '') ? (
                /* 값이 없으면 연한 태그로 '-' 표시 (모양 유지) */
                <span className="opinion-value tag-none">-</span>
              ) : (
                <span className="opinion-value tag-sub">{subCategory}</span>
              )}
            </div>
          </div>

          <div className="card">
            <div className="result-table-header">
              <h2 className="card-title">Query Results</h2>
              <div>
                {opinion && !opinion.startsWith('N/A') &&(
                  <button
                    className="btn btn-secondary"
                    style={{ marginRight: '10px' }}
                    onClick={handleGenerateInsight}
                    disabled={results.length === 0}
                  >
                    <FaChartPie size={12} /> Generate Insight
                  </button>
                )}
                <button
                  className="btn btn-save-excel"
                  onClick={handleExcelDownload}
                >
                  <FaDownload size={12} /> Download Excel
                </button>
              </div>
            </div>

            <div className="result-table-container">
              <table className="result-table">
                <thead>
                  <tr>
                    {orderedColumns.map((col) => (
                      <th key={col}>{QID_MAP[col] || col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row, idx) => (
                    <tr key={row.id ?? idx}>
                      {orderedColumns.map((col) => (
                        <td key={col}>
                          {row[col] != null ? String(row[col]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px', paddingBottom: '8px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ padding: '6px 12px' }}
                >
                  <FaChevronLeft size={10} />
                </button>
                
                <span style={{ fontSize: '13px', color: '#555' }}>
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>

                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ padding: '6px 12px' }}
                >
                  <FaChevronRight size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h2 className="card-title">Recommended Next Questions</h2>
          <ul className="recommend-list">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className="recommend-item"
                onClick={() => setQuery(rec)}
              >
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div
          className="result-summary"
          style={{ color: '#EF4444', borderColor: '#EF4444' }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {insightContext && (
        <div ref={insightSectionRef}>
          <InsightFinal
            analysisContext={insightContext}
            onClose={() => setInsightContext(null)}
            onLoadingChange={setIsInsightLoading}
            onSimilarQuery={handleSimilarQueryFromInsight}
          />
        </div>
      )}
    </div>
  );
}

export default SearchPage;
