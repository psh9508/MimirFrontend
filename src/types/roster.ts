// 근무 타입
export type DutyType =
  | 'flight'    // 비행 근무
  | 'ground'    // 지상 근무 (G)
  | 'leave'     // 휴가 (LS)
  | 'off'       // 휴무 (빈칸)
  | 'standby'   // 대기
  | 'training'  // 교육
  | 'other';    // 기타

// 단일 비행 정보
export interface FlightInfo {
  duty: string;           // 비행편명 또는 근무코드 (예: 0520, G, LS)
  sd?: string;            // 직무 구분 (FC 등)
  sector?: string;        // 노선 구간 (예: "HKG NRT")
  acType?: string;        // 항공기 기종 (예: 77P, 35G)
  dutyStart?: string;     // 업무 시작 시간
  depTime?: string;       // 출발 시간
  arrTime?: string;       // 도착 시간 (+1은 다음날)
  dutyEnd?: string;       // 업무 종료 시간
  dutyPeriod?: string;    // 총 근무 시간 (HH:MM)
  blockHours?: string;    // 순수 비행 시간 (HH:MM)
}

// 일별 스케줄
export interface DailySchedule {
  date: string;           // 날짜 (예: "08-Nov-25")
  day: string;            // 요일 (S, M, T, W, T, F, S)
  dutyType: DutyType;     // 근무 타입
  flights: FlightInfo[];  // 해당 날짜의 비행 정보들 (여러 개 가능)
}

// 월별 로스터
export interface MonthlyRoster {
  year: number;
  month: string;          // 월 이름 (예: "Nov")
  monthNumber: number;    // 월 숫자 (1-12)
  crewName?: string;      // 승무원 이름
  crewId?: string;        // 승무원 ID
  schedules: DailySchedule[];
  uploadedAt?: Date;
}

// PDF 파싱 결과
export interface RosterParseResult {
  success: boolean;
  roster?: MonthlyRoster;
  error?: string;
}

// 요일 코드 (영문 약어)
// 참고: 실제 로스터에서 T는 화/목 둘 다 사용되므로 위치(인덱스)로 구분 필요
export const DAY_CODES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
export const DAY_NAMES_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

// 근무 타입 판별 함수
export function getDutyType(duty: string): DutyType {
  if (!duty || duty.trim() === '') return 'off';
  if (duty === 'G') return 'ground';
  if (duty === 'LS') return 'leave';
  if (duty === 'SB' || duty === 'STBY') return 'standby';
  if (duty === 'TR' || duty === 'TRN') return 'training';
  // 숫자로 시작하면 비행편
  if (/^\d/.test(duty)) return 'flight';
  return 'other';
}

// 근무 타입별 라벨
export const DUTY_TYPE_LABELS: Record<DutyType, string> = {
  flight: '비행',
  ground: '지상 근무',
  leave: '휴가',
  off: '휴무',
  standby: '대기',
  training: '교육',
  other: '기타',
};
