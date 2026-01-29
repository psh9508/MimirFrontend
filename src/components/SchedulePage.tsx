import React, { useState, useRef } from 'react';
import { MonthlyRoster, DailySchedule } from '../types/roster';

interface SchedulePageProps {
  onBack: () => void;
}

// Mock 데이터 (PDF 파싱 전 테스트용)
const mockRoster: MonthlyRoster = {
  year: 2025,
  month: 'Nov',
  monthNumber: 11,
  crewName: 'LEE JIHYUN',
  schedules: [
    {
      date: '01-Nov-25',
      day: 'S',
      dutyType: 'off',
      flights: []
    },
    {
      date: '02-Nov-25',
      day: 'S',
      dutyType: 'ground',
      flights: [{ duty: 'G', dutyStart: '0900L', dutyEnd: '1800L', dutyPeriod: '9:00' }]
    },
    {
      date: '03-Nov-25',
      day: 'M',
      dutyType: 'flight',
      flights: [
        {
          duty: '0520',
          sd: 'FC',
          sector: 'HKG NRT',
          acType: '77P',
          dutyStart: '0900L',
          depTime: '1030L',
          arrTime: '1535L',
          dutyEnd: '1605L',
          dutyPeriod: '7:05',
          blockHours: '4:05'
        }
      ]
    },
    {
      date: '04-Nov-25',
      day: 'T',
      dutyType: 'leave',
      flights: [{ duty: 'LS' }]
    },
    {
      date: '05-Nov-25',
      day: 'W',
      dutyType: 'leave',
      flights: [{ duty: 'LS' }]
    },
    {
      date: '06-Nov-25',
      day: 'T',
      dutyType: 'off',
      flights: []
    },
    {
      date: '07-Nov-25',
      day: 'F',
      dutyType: 'flight',
      flights: [
        {
          duty: '0301',
          sd: 'FC',
          sector: 'HKG LAX',
          acType: '77K',
          dutyStart: '0800L',
          depTime: '0930L',
          arrTime: '0710L+1',
          dutyEnd: '0740L+1',
          dutyPeriod: '14:40',
          blockHours: '12:40'
        }
      ]
    },
    {
      date: '08-Nov-25',
      day: 'S',
      dutyType: 'flight',
      flights: [
        {
          duty: '0520',
          sd: 'FC',
          sector: 'HKG NRT',
          acType: '77P',
          dutyStart: '0900L',
          depTime: '1030L',
          arrTime: '1535L',
          blockHours: '4:05'
        },
        {
          duty: '0521',
          sd: 'FC',
          sector: 'NRT HKG',
          acType: '77P',
          depTime: '1645L',
          arrTime: '2110L',
          dutyEnd: '2140L',
          dutyPeriod: '12:30',
          blockHours: '5:25'
        }
      ]
    },
  ]
};

const SchedulePage: React.FC<SchedulePageProps> = ({ onBack }) => {
  const [roster, setRoster] = useState<MonthlyRoster | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }
    setUploadedFileName(file.name);
    // TODO: 실제 PDF 파싱 로직 구현
    // 현재는 mock 데이터 사용
    setRoster(mockRoster);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setRoster(null);
    setUploadedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 총 비행 시간 계산
  const calculateTotalBlockHours = (schedules: DailySchedule[]): string => {
    let totalMinutes = 0;
    schedules.forEach(schedule => {
      schedule.flights.forEach(flight => {
        if (flight.blockHours) {
          const [hours, minutes] = flight.blockHours.split(':').map(Number);
          totalMinutes += hours * 60 + minutes;
        }
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // 근무 타입별 색상
  const getDutyColor = (dutyType: string): string => {
    switch (dutyType) {
      case 'flight': return '#4a90d9';
      case 'ground': return '#718096';
      case 'leave': return '#9b59b6';
      case 'off': return '#27ae60';
      case 'standby': return '#f39c12';
      case 'training': return '#e67e22';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="schedule-page">
      {/* Header */}
      <div className="schedule-header">
        <button className="back-button" onClick={onBack}>
          <span>←</span> 뒤로가기
        </button>
        <h1 className="schedule-title">My Schedule</h1>
        <div className="header-spacer"></div>
      </div>

      {!roster ? (
        // PDF 업로드 영역
        <div className="upload-section">
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              accept=".pdf"
              style={{ display: 'none' }}
            />
            <div className="upload-icon">📄</div>
            <h2 className="upload-title">로스터 PDF 업로드</h2>
            <p className="upload-description">
              PDF 파일을 드래그하거나 클릭하여 업로드하세요
            </p>
            <div className="upload-hint">
              다음 달 스케줄 PDF를 업로드하면 자동으로 파싱됩니다
            </div>
          </div>
        </div>
      ) : (
        // 로스터 표시 영역
        <div className="roster-section">
          {/* 로스터 헤더 */}
          <div className="roster-header">
            <div className="roster-info">
              <h2 className="roster-title">
                {roster.month} {roster.year} Roster
              </h2>
              {roster.crewName && (
                <p className="crew-name">{roster.crewName}</p>
              )}
            </div>
            <div className="roster-summary">
              <div className="summary-item">
                <span className="summary-label">총 비행시간</span>
                <span className="summary-value">{calculateTotalBlockHours(roster.schedules)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">비행일</span>
                <span className="summary-value">
                  {roster.schedules.filter(s => s.dutyType === 'flight').length}일
                </span>
              </div>
            </div>
            <button className="reset-button" onClick={handleReset}>
              새 파일 업로드
            </button>
          </div>

          {/* 파일명 표시 */}
          {uploadedFileName && (
            <div className="file-info">
              <span className="file-icon">📎</span>
              <span className="file-name">{uploadedFileName}</span>
            </div>
          )}

          {/* 로스터 테이블 */}
          <div className="roster-table-container">
            <table className="roster-table">
              <thead>
                <tr>
                  <th className="col-date">DATE</th>
                  <th className="col-duty">DUTY</th>
                  <th className="col-sd">SD</th>
                  <th className="col-sector">SECTOR</th>
                  <th className="col-ac">AC TYPE</th>
                  <th className="col-time">DUTY START</th>
                  <th className="col-time">DEP TIME</th>
                  <th className="col-time">ARR TIME</th>
                  <th className="col-time">DUTY END</th>
                  <th className="col-period">DUTY PERIOD</th>
                  <th className="col-period">BLOCK HOURS</th>
                </tr>
              </thead>
              <tbody>
                {roster.schedules.map((schedule, scheduleIdx) => {
                  const flightCount = Math.max(schedule.flights.length, 1);

                  return schedule.flights.length === 0 ? (
                    // 휴무일 (비행 없음)
                    <tr key={scheduleIdx} className={`duty-row duty-${schedule.dutyType}`}>
                      <td className="col-date">
                        <div className="date-cell">
                          <span className="date-text">{schedule.date}</span>
                          <span className="day-text">{schedule.day}</span>
                        </div>
                      </td>
                      <td colSpan={10} className="off-day">
                        <span className="off-label">OFF</span>
                      </td>
                    </tr>
                  ) : (
                    // 근무일 (비행 있음)
                    schedule.flights.map((flight, flightIdx) => (
                      <tr
                        key={`${scheduleIdx}-${flightIdx}`}
                        className={`duty-row duty-${schedule.dutyType}`}
                      >
                        {flightIdx === 0 && (
                          <td className="col-date" rowSpan={flightCount}>
                            <div className="date-cell">
                              <span className="date-text">{schedule.date}</span>
                              <span className="day-text">{schedule.day}</span>
                            </div>
                          </td>
                        )}
                        <td className="col-duty">
                          <span
                            className="duty-badge"
                            style={{ backgroundColor: getDutyColor(schedule.dutyType) }}
                          >
                            {flight.duty}
                          </span>
                        </td>
                        <td className="col-sd">{flight.sd || '-'}</td>
                        <td className="col-sector">{flight.sector || '-'}</td>
                        <td className="col-ac">{flight.acType || '-'}</td>
                        <td className="col-time">{flight.dutyStart || '-'}</td>
                        <td className="col-time">{flight.depTime || '-'}</td>
                        <td className="col-time">{flight.arrTime || '-'}</td>
                        <td className="col-time">{flight.dutyEnd || '-'}</td>
                        <td className="col-period">{flight.dutyPeriod || '-'}</td>
                        <td className="col-period">{flight.blockHours || '-'}</td>
                      </tr>
                    ))
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 범례 */}
          <div className="roster-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#4a90d9' }}></span>
              <span>비행</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#718096' }}></span>
              <span>지상 근무</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#9b59b6' }}></span>
              <span>휴가</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#27ae60' }}></span>
              <span>휴무</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
              <span>대기</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
