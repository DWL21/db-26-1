export interface Category {
  value: string;
  label: string;
  icon: string;
  description: string;
}

// scatch.ssu.ac.kr/공지사항/ 카테고리 필터 값 기준.
// 변경 시 mail-worker/src/scraper.ts 와 동기화 필요.
export const CATEGORIES: Category[] = [
  { value: '전체',       label: '전체',       icon: '📋', description: '모든 카테고리의 공지사항' },
  { value: '학사',       label: '학사',       icon: '🎓', description: '수강·성적·졸업 관련' },
  { value: '장학',       label: '장학',       icon: '💰', description: '장학금·지원금 모집' },
  { value: '국제교류',   label: '국제교류',   icon: '✈️', description: '해외 교환학생·어학연수' },
  { value: '외국인유학생', label: '외국인유학생', icon: '🌏', description: '외국인 학생 대상 공지' },
  { value: '채용',       label: '채용',       icon: '💼', description: '기업 채용·인턴 모집' },
  { value: '비교과·행사', label: '비교과·행사', icon: '🎪', description: '캠퍼스 행사·특강·프로그램' },
  { value: '교원채용',   label: '교원채용',   icon: '👨‍🏫', description: '교수·강사 채용 공고' },
  { value: '교직',       label: '교직',       icon: '📚', description: '교원자격·교직 이수' },
  { value: '봉사',       label: '봉사',       icon: '🤝', description: '봉사활동·지역사회 연계' },
  { value: '기타',       label: '기타',       icon: '📌', description: '그 외 학교 공지사항' },
];
