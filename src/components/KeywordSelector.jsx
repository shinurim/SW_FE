import React from 'react';
import { CATEGORY_DATA } from '../data/keywords'; 
import './KeywordSelector.css'; 

// Props:
// - selectedKeywords: 현재 선택된 키워드 배열 
// - onKeywordsChange: 키워드 배열이 변경될 때 호출될 함수 
// - maxCount: 최대 선택 개수 
function KeywordSelector({ selectedKeywords, onKeywordsChange, maxCount = 3 }) {

  const handleChipClick = (subCategory) => {
    // 이미 선택된 칩을 클릭하면 -> 선택 해제
    if (selectedKeywords.includes(subCategory)) {
      onKeywordsChange(selectedKeywords.filter(k => k !== subCategory));
    } 
    // 최대 개수에 도달하지 않았으면 -> 선택 추가
    else if (selectedKeywords.length < maxCount) {
      onKeywordsChange([...selectedKeywords, subCategory]);
    }
    // 최대 개수에 도달했으면 -> 경고 (혹은 무시)
    else {
      console.warn(`최대 ${maxCount}개까지만 선택할 수 있습니다.`);
    }
  };

  const isMaxReached = selectedKeywords.length >= maxCount;

  return (
    <div className="keyword-selector">
      <p className="keyword-selector-hint">
        관심 키워드를 선택하세요 (
        <span className={isMaxReached ? 'limit-reached' : ''}>
          {selectedKeywords.length} / {maxCount}
        </span> 개)
      </p>

      {CATEGORY_DATA.map((category) => (
        <div key={category.main} className="category-group">
          <h4 className="category-main-title">{category.main}</h4>
          <div className="category-sub-chips">
            {category.subs.map((sub) => {
              const isSelected = selectedKeywords.includes(sub);
              return (
                <button
                  type="button"
                  key={sub}
                  className={`chip-btn ${isSelected ? 'selected' : ''} ${!isSelected && isMaxReached ? 'disabled' : ''}`}
                  onClick={() => handleChipClick(sub)}
                  disabled={!isSelected && isMaxReached} // 최대 개수 도달 시 비활성화
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KeywordSelector;