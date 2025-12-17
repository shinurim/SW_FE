import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  FaTimes,
  FaSave,
  FaListUl,
  FaAlignLeft,
  FaLayerGroup,
  FaLightbulb,
} from 'react-icons/fa';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

import { useAuth } from '../contexts/AuthContext';

const COLORS_TARGET = ['#4F46E5', '#22C55E', '#F97316', '#EC4899', '#06B6D4', '#EAB308'];
const COLORS_FULL = ['#A5B4FC', '#6EE7B7', '#FED7AA', '#F9A8D4', '#67E8F9', '#FEF08A'];

function InsightFinal({ analysisContext, onClose, onLoadingChange, onSimilarQuery }) {
  const [insight, setInsight] = useState(null);
  const [stage3Info, setStage3Info] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const QID_MAP = {
    //
  };

  // 접기/펼치기 상태
  const [isCollapsed, setIsCollapsed] = useState(false);

  // -----------------------------
  // 1) 인사이트 조회
  // -----------------------------
  useEffect(() => {
    if (!analysisContext) {
      setError('분석할 대상을 찾을 수 없습니다.');
      setIsLoading(false);
      onLoadingChange && onLoadingChange(false);
      return;
    }

    const fetchInsight = async () => {
      try {
        setIsLoading(true);
        onLoadingChange && onLoadingChange(true);
        setError(null);

        let insightPayload = null;
        let stage3Payload = null;

        // SearchPage에서 바로 인사이트 생성 (from-text)
        if (analysisContext.type === 'text') {
          const payload = {
            user_input: analysisContext.user_input || analysisContext.value || '',
            stage3: analysisContext.stage3 || {},
          };

          console.log('[INSIGHT] request payload(from-text):', payload);

          const res = await axiosInstance.post('/api/v1/insight/from-text', payload);
          const raw = res.data || {};

          insightPayload = raw.insight || null;
          stage3Payload = raw.stage3 || null;
        }
        // SegmentPage에서 저장된 세그먼트 인사이트 보기
        else if (analysisContext.type === 'segment') {
          if (!user || !user.user_id) {
            setError('로그인 정보를 찾을 수 없습니다. 다시 로그인 후 시도해주세요.');
            setIsLoading(false);
            onLoadingChange && onLoadingChange(false);
            return;
          }

          console.log('[INSIGHT] load saved segment:', analysisContext, 'user=', user);

          const res = await axiosInstance.get(
            `/api/v1/insights/${analysisContext.id}`,
            { params: { user_id: user.user_id } }
          );

          const raw = res.data || {};
          insightPayload = raw.insight || null;
          stage3Payload = raw.stage3 || null;
        } else {
          setError('유효하지 않은 분석 타입입니다.');
          setIsLoading(false);
          onLoadingChange && onLoadingChange(false);
          return;
        }

        setInsight(insightPayload);
        setStage3Info(stage3Payload);
      } catch (err) {
        console.error('Insight fetch failed:', err);
        setError(
          err?.response?.data?.error ||
          '인사이트를 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setIsLoading(false);
        onLoadingChange && onLoadingChange(false);
      }
    };

    fetchInsight();
  }, [analysisContext, user, onLoadingChange]);

  // -----------------------------
  // 2) 세그먼트 저장
  // -----------------------------
  const handleSaveSegment = async () => {
    if (analysisContext?.type === 'segment') {
      alert('이미 저장된 인사이트입니다.');
      return;
    }

    if (!insight) {
      alert('저장할 인사이트가 없습니다.');
      return;
    }

    if (!analysisContext || !analysisContext.stage3) {
      alert('stage3 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    if (!user || !user.user_id) {
      alert('로그인 정보를 찾을 수 없습니다. 다시 로그인 후 시도해주세요.');
      return;
    }

    const defaultTitle = insight.title || '';
    const name = prompt('이 인사이트를 어떤 이름으로 저장할까요?', defaultTitle);
    if (!name) return;

    try {
      await axiosInstance.post('/api/v1/save/save_segment', {
        user_id: user.user_id,
        segment_name: name,
        user_input: analysisContext.user_input || analysisContext.value || '',
        stage3: analysisContext.stage3,
        insight: insight,
      });

      alert('세그먼트가 저장되었습니다.');
    } catch (e) {
      console.error(e);
      alert('세그먼트 저장 중 오류가 발생했습니다.');
    }
  };

  const handleSimilarQueryClick = (q) => {
    const cleaned =
      typeof q === 'string' ? q.replace(/[<>]/g, '').trim() : q;

    if (onSimilarQuery) {
      onSimilarQuery(cleaned);
    } else {
      alert(`'${cleaned}' 로 Search 페이지에서 다시 검색하도록 연결해 주세요 :)`);
    }
  };

  const getInsightText = (idx) => {
    if (!insight?.insights || !insight.insights[idx]) return '';
    const item = insight.insights[idx];
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && 'text' in item) return item.text;
    return String(item);
  };

  const chartSpecific = insight?.charts?.chart_specific;
  const chartFull = insight?.charts?.chart_full;

  const getAggregatedData = (rows) => {
    if (!rows || rows.length === 0) return [];
    
    const countMap = {};

    rows.forEach((row) => {
      // 1. 문자열로 변환 후 콤마(,)로 쪼개기
      const groupStr = String(row.answer_group || '');
      const answers = groupStr.split(',');

      answers.forEach((ans) => {
        const cleanName = ans.trim(); // 앞뒤 공백 제거
        if (!cleanName) return;

        // 2. 분리된 키워드별로 카운트 누적
        countMap[cleanName] = (countMap[cleanName] || 0) + row.count;
      });
    });

    // 3. 배열로 변환 및 내림차순 정렬
    return Object.entries(countMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // ------------------------------------------------------------------
  // [수정됨] Pie Chart 데이터 생성 (상위 5개 + 기타)
  // ------------------------------------------------------------------
  const pieData = (() => {
    const rawRows = chartSpecific?.rows || [];
    const aggregated = getAggregatedData(rawRows);

    // 상위 5개만 남기고 나머지는 '기타'로 묶기
    const topN = 5;
    if (aggregated.length > topN) {
      const topItems = aggregated.slice(0, topN);
      const otherCount = aggregated.slice(topN).reduce((sum, item) => sum + item.value, 0);
      
      if (otherCount > 0) {
        topItems.push({ name: '기타', value: otherCount });
      }
      return topItems;
    }
    return aggregated;
  })();

  // ------------------------------------------------------------------
  // [수정됨] Radar Chart 데이터 생성 (타겟 vs 전체 비교)
  // ------------------------------------------------------------------
  const radarData = (() => {
    if (!chartSpecific?.rows || !chartFull?.rows) return [];

    // 1. 타겟과 전체 데이터를 각각 쪼개서 집계
    const targetAgg = getAggregatedData(chartSpecific.rows);
    const fullAgg = getAggregatedData(chartFull.rows);

    // 2. 비율 계산을 위한 총합 구하기
    const targetTotal = targetAgg.reduce((sum, r) => sum + r.value, 0);
    const fullTotal = fullAgg.reduce((sum, r) => sum + r.value, 0);

    // 3. 전체 데이터 검색 속도 향상을 위한 Map 변환
    const fullMap = new Map(fullAgg.map((r) => [r.name, r.value]));

    // 4. 타겟 그룹 상위 8개 키워드 추출 (레이더 차트 꼭지점)
    const topKeywords = targetAgg.slice(0, 8); 

    return topKeywords.map((r) => {
      const targetVal = r.value;
      const fullVal = fullMap.get(r.name) || 0;

      const targetRatio = targetTotal > 0 ? ((targetVal / targetTotal) * 100).toFixed(1) : 0;
      const fullRatio = fullTotal > 0 ? ((fullVal / fullTotal) * 100).toFixed(1) : 0;

      return {
        name: r.name,
        target: Number(targetRatio),
        full: Number(fullRatio),
      };
    });
  })();

  // -----------------------------
  // 3) 차트에 사용된 qid → 자연어 라벨 추출
  // -----------------------------
  const detectChartQid = () => {
    if (!insight) return null;

    // 백엔드에서 내려줄 수 있는 여러 케이스 방어적으로 처리
    if (insight.charts?.qid) return insight.charts.qid;
    if (chartSpecific?.qid) return chartSpecific.qid;
    if (chartSpecific?.question_id) return chartSpecific.question_id;
    if (insight.charts?.question_id) return insight.charts.question_id;

    // 아무 것도 없으면 per_question_analysis의 첫 번째 문항을 사용
    if (insight.per_question_analysis) {
      const keys = Object.keys(insight.per_question_analysis);
      if (keys.length > 0) return keys[0];
    }
    return null;
  };

  const chartQid = detectChartQid();
  const chartTitleText = chartQid
    ? (QID_MAP[chartQid] || '')
    : null;

  if (isLoading) {
    return (
      <div className="insight-view-wrapper">
        <p>인사이트를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insight-view-wrapper">
        <p style={{ color: 'red' }}>{error}</p>
        <button className="btn btn-secondary" onClick={onClose}>
          <FaTimes /> 닫기
        </button>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="insight-view-wrapper">
        <p>표시할 인사이트가 없습니다.</p>
        <button className="btn btn-secondary" onClick={onClose}>
          <FaTimes /> 닫기
        </button>
      </div>
    );
  }

  return (
    <div className="insight-view-wrapper">
      {/* 헤더 (제목 + 버튼들) */}
      <div className="insight-header-row">
        <h2 className="insight-main-title">
          {insight.title || '인사이트 결과'}
        </h2>
        <div className="insight-actions" style={{ display: 'flex', gap: '12px' }}>
          {analysisContext?.type === 'text' && (
            <button className="btn btn-primary" onClick={handleSaveSegment}>
              <FaSave /> 세그먼트 저장
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? '펼치기' : '접기'}
          </button>
        </div>
      </div>

      {/* 접기/펼치기: 접힌 경우 아래 내용 숨김 */}
      {!isCollapsed && (
        <>
          {/* 키워드 / 실행시간 */}
          <div className="insight-meta-row">
            <div className="insight-keywords">
              {(insight.keywords || []).map((kw, i) => (
                <span key={i} className="insight-keyword-chip">
                  #{kw}
                </span>
              ))}
            </div>
            {stage3Info?.sql_executed_time && (
              <div className="insight-columns-info">
                <FaListUl /> 쿼리 실행 시간:{' '}
                <strong>{stage3Info.sql_executed_time}</strong>
              </div>
            )}
          </div>

          <hr className="insight-divider" />

          {/* 섹션 1: 타깃 그룹 심층 분석 */}
          <div className="insight-section" style={{ marginBottom: '40px' }}>
            <h3 className="insight-sub-title">
              <FaAlignLeft style={{ marginRight: '8px' }} />
              타깃 그룹 심층 분석
            </h3>

            {pieData.length > 0 && (
              <div className="card" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h4 className="card-title" style={{ fontSize: '16px' }}>
                  {/* 🔹 여기: qid 매핑 자연어 사용 */}
                  {chartTitleText || '타깃 그룹 응답 분포'}
                </h4>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Tooltip formatter={(val) => [`${val}`, '응답 수']} />
                      <Legend />
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS_TARGET[idx % COLORS_TARGET.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {insight.per_question_analysis && (
              <div style={{ marginTop: '20px' }}>
                <h4
                  className="card-title"
                  style={{ fontSize: '15px', marginBottom: '12px', color: '#555' }}
                >
                   문항별 해석
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {Object.entries(insight.per_question_analysis).map(([qid, text]) => {
                    const label = QID_MAP[qid] || '';

                    return (
                      <div
                        key={qid}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '10px',
                          padding: '14px 16px',
                          background: '#ffffff',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          minHeight: '105px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            marginBottom: '6px',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ color: '#2563eb' }}></span>
                          {label && (
                            <span style={{ color: '#4b5563' }}>
                              {label}
                            </span>
                          )}
                        </div>

                        <p
                          style={{
                            fontSize: '14px',
                            color: '#374151',
                            margin: 0,
                            lineHeight: 1.45,
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {getInsightText(0) && (
              <p className="insight-long-text" style={{ marginTop: '20px' }}>
                {getInsightText(0)}
              </p>
            )}
          </div>

          {/* 섹션 2: 전체 집단 비교 */}
          <div className="insight-section">
            <h3 className="insight-sub-title">
              <FaLayerGroup style={{ marginRight: '8px' }} />
              전체 집단 비교
            </h3>

            {radarData.length > 0 && (
              <div className="card" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h4 className="card-title" style={{ fontSize: '16px' }}>
                  {/*  여기도 동일한 문항 라벨 사용 */}
                  {chartTitleText || '타깃 vs 전체 집단 응답 분포'}
                </h4>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar
                        name="타깃 그룹"
                        dataKey="target"
                        stroke={COLORS_TARGET[0]}
                        fill={COLORS_TARGET[0]}
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="전체 집단"
                        dataKey="full"
                        stroke={COLORS_FULL[0]}
                        fill={COLORS_FULL[0]}
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {getInsightText(1) && (
              <p className="insight-long-text" style={{ marginTop: '12px' }}>
                {getInsightText(1)}
              </p>
            )}
          </div>

          {/* 섹션 3: 추천 유사 질의 */}
          {insight.similar_queries && insight.similar_queries.length > 0 && (
            <div
              className="card"
              style={{
                marginTop: '24px',
                border: '1px dashed #2b6ee5',
                background: '#f0f7ff',
              }}
            >
              <h2
                className="card-title"
                style={{ color: '#2b6ee5', fontSize: '15px' }}
              >
                <FaLightbulb style={{ marginRight: '8px' }} />
                이런 분석은 어떠세요?
              </h2>
              <ul className="recommend-list" style={{ marginTop: '12px' }}>
                {insight.similar_queries.map((q, idx) => (
                  <li
                    key={idx}
                    className="recommend-item"
                    style={{ background: '#fff', borderColor: '#cce0ff' }}
                    onClick={() => handleSimilarQueryClick(q)}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default InsightFinal;
