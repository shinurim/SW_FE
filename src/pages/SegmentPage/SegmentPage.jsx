import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { FaUsers, FaEdit, FaTrash, FaChartPie } from 'react-icons/fa';
import InsightFinal from '../../components/InsightFinal';
import loadingGif from '../../assets/loading.gif';
import './SegmentPage.css';

// 로그인 정보
import { useAuth } from '../../contexts/AuthContext';

function SegmentPage({ onNavigate }) {
  const { user } = useAuth();
  const [segments, setSegments] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

// Insight 모달용
  const [insightContext, setInsightContext] = useState(null);

  const handleSimilarQueryFromInsight = (text) => {
    try {
      localStorage.setItem('fromInsightQuery', text);
    } catch (e) {
      console.error('Failed to persist similar query:', e);
    }

    setInsightContext(null);

    if (onNavigate) {
      onNavigate('search');
    }
  };

  // =========================
  // 1) 세그먼트 목록 가져오기
  // =========================
  useEffect(() => {
    if (!user || !user.user_id) {
      setError('로그인 정보를 찾을 수 없습니다. 다시 로그인 해주세요.');
      setIsLoading(false);
      return;
    }

    const fetchSegments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get('/api/v1/segments', {
          params: { user_id: user.user_id },
        });

        const items = res.data?.segments || [];
        setSegments(items);
      } catch (err) {
        console.error('Failed to fetch segments', err);
        setError(
          err?.response?.data?.error ||
            '세그먼트 목록을 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSegments();
  }, [user]);

  // =========================
  // 2) 이름 변경 
  // =========================
  const handleRenameSegment = async (segmentId) => {
    const seg = segments.find((s) => s.id === segmentId);
    if (!seg) return;

    const newName = prompt('새 세그먼트 이름을 입력하세요:', seg.segment_name);
    if (!newName || newName === seg.segment_name) return;

    setSegments((prev) =>
      prev.map((s) =>
        s.id === segmentId ? { ...s, segment_name: newName } : s,
      ),
    );
    alert('세그먼트 이름이 변경되었습니다. ');
  };

  // =========================
  // 3) 삭제 
  // =========================
  const handleDeleteSegment = async (segmentId) => {
    if (!window.confirm('정말로 이 세그먼트를 삭제하시겠습니까?')) return;

    if (!user || !user.user_id) {
      alert('로그인 정보를 찾을 수 없습니다. 다시 로그인 해주세요.');
      return;
    }

    try {
      await axiosInstance.post('/api/v1/segments/delete', {
        id: segmentId,
        user_id: user.user_id,
      });

      setSegments((prev) => prev.filter((s) => s.id !== segmentId));

      alert('세그먼트가 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete segment', err);
      alert(
        err?.response?.data?.error ||
          '세그먼트를 삭제하는 중 오류가 발생했습니다.',
      );
    }
  };


  // =========================
  // 4) 인사이트 보기 버튼
  // =========================
  const handleGoToInsight = (segmentId, segmentName) => {
    setInsightContext({
      type: 'segment',
      id: segmentId,
      name: segmentName,
    });
  };

  // =========================
  // 로딩 화면
  // =========================
  if (isLoading) {
    return (
      <div className="content-wrap">
        <div className="segment-page-container">
          <header className="page-header">
            <h1 className="page-title">My Insights</h1>
          </header>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
            }}
          >
            <img
              src={loadingGif}
              alt="Loading..."
              style={{ width: '500px', marginBottom: '16px' }}
            />
            <p style={{ color: '#666', fontSize: '16px' }}>
              세그먼트 목록을 불러오는 중입니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // 렌더링
  // =========================
  return (
    <div className="content-wrap">
      <div className="segment-page-container"> 
        <header className="page-header">
          <h1 className="page-title">My Insights</h1>
          <button className="btn btn-primary" onClick={() => onNavigate('search')}>
            + New Insight
          </button>
        </header>

        {error && (
          <p style={{ color: 'red', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        {/* 세그먼트 카드 리스트 */}
        <div className="segment-cards-wrapper">
          <div className="segment-cards-grid">
            {segments.length === 0 && !error && (
              <p style={{ color: '#666' }}>저장된 인사이트가 없습니다.</p>
            )}

            {segments.map((seg) => (
              <div className="segment-card" key={seg.id}>
                <div className="segment-card-header">
                  <h3 className="segment-card-title">{seg.segment_name}</h3>
                  <FaUsers className="segment-card-icon" />
                </div>

                <div className="segment-card-value">
                  {seg.count != null ? Number(seg.count).toLocaleString() : '-'}
                </div>

                <p
                  style={{
                    fontSize: '12px',
                    color: '#888',
                    margin: '0 0 12px 0',
                  }}
                >
                  {seg.main && <span>#{seg.main} </span>}
                  {seg.sub && <span>/ {seg.sub}</span>}
                </p>

                <div className="segment-card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleGoToInsight(seg.id, seg.segment_name)}
                  >
                    <FaChartPie size={12} /> Insight
                  </button>

                  <button
                    className="btn btn-outline"
                    style={{ color: '#EF4444', borderColor: '#EF4444' }}
                    onClick={() => handleDeleteSegment(seg.id)}
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 모달 인사이트 */}
      {insightContext && (
        <InsightFinal
          analysisContext={insightContext}
          onClose={() => setInsightContext(null)}
          onSimilarQuery={handleSimilarQueryFromInsight}
        />
      )}
    </div>
  );
}

export default SegmentPage;
