// src/utils/excelExporter.js

import * as XLSX from 'xlsx'; // xlsx 라이브러리
import { saveAs } from 'file-saver'; // file-saver 라이브러리

/**
 * JSON 데이터를 엑셀 파일로 변환하여 다운로드하는 함수
 * @param {Array<object>} data - 엑셀 시트로 만들 JSON 객체 배열
 * @param {string} fileName - 저장할 파일 이름 (확장자 제외)
 */
export const exportToExcel = (data, fileName) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    alert("엑셀로 내보낼 데이터가 없습니다.");
    return;
  }

  try {
    // 1. JSON 데이터를 엑셀 워크시트(worksheet)로 변환
    const ws = XLSX.utils.json_to_sheet(data);


    const colsWidth = Object.keys(data[0]).map(key => ({
      wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2
    }));
    ws['!cols'] = colsWidth;

    // 2. 새 워크북(workbook)을 만들고 워크시트 추가
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 

    // 3. 엑셀 파일을 바이너리 배열로 생성
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // 4. 바이너리 배열을 Blob 객체로 변환
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    // 5. file-saver를 사용해 파일 다운로드
    saveAs(dataBlob, `${fileName}.xlsx`);

  } catch (error) {
    console.error("Excel export failed", error);
    alert("엑셀 파일을 생성하는 중 오류가 발생했습니다.");
  }
};