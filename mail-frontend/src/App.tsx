import { useState, useMemo, useEffect } from 'react';
import UnsubscribePage from './UnsubscribePage';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
import SubscribePage from './SubscribePage';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8001';

const TICKER_ITEMS = [
  { cat: '장학', title: '2026-1 국가장학금 2차 신청 마감' },
  { cat: '채용', title: '삼성전자 DS부문 신입 채용설명회' },
  { cat: '학사', title: '2026학년도 1학기 수강신청 일정' },
  { cat: '국제교류', title: '2026 봄학기 교환학생 모집 공고' },
  { cat: '비교과', title: '총장 초청 봄 콘서트 (5/24)' },
  { cat: '봉사', title: '1365 자원봉사 정기 활동 모집' },
];

const CATS = [
  { v: '학사',         h: '수강·학적·졸업' },
  { v: '장학',         h: '장학금 공고' },
  { v: '국제교류',     h: '교환·어학연수' },
  { v: '외국인유학생', h: '비자·생활' },
  { v: '채용',         h: '취업·인턴' },
  { v: '비교과·행사',  h: '특강·문화행사' },
  { v: '교원채용',     h: '교원 공고' },
  { v: '교직',         h: '교원자격' },
  { v: '봉사',         h: '봉사활동' },
  { v: '기타',         h: '그 외' },
];

function Nav({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <nav className="nav">
      <a className="nav__logo" href="#">SSU<em>메일</em></a>
      <div className="nav__right">
        <button className="nav__theme" onClick={onToggle} title="테마 전환">
          {isDark ? '☀️' : '🌙'}
        </button>
        <a className="nav__cta" href="#/subscribe">구독하기 →</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero__tag">숭실대학교 공지 메일링 서비스</div>
        <h1 className="hero__title">
          공지,<br />
          놓치지<br />
          <em>마세요.</em>
        </h1>
        <p className="hero__desc">
          카테고리를 골라 구독하면 매일 아침 8시,<br />
          새 공지만 모아 메일로 보내드립니다.
        </p>
        <a href="#/subscribe" className="hero__btn">지금 구독하기 →</a>
        <div className="hero__stats">
          <div>
            <div className="hero__stat-num">10</div>
            <div className="hero__stat-label">공지 카테고리</div>
          </div>
          <div>
            <div className="hero__stat-num">08:00</div>
            <div className="hero__stat-label">매일 발송</div>
          </div>
          <div>
            <div className="hero__stat-num">광고 없음</div>
            <div className="hero__stat-label">학생 프로젝트</div>
          </div>
          <div>
            <div className="hero__stat-num">30초</div>
            <div className="hero__stat-label">구독 소요</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker">
      <div className="ticker__inner">
        {items.map((it, i) => (
          <span className="ticker__item" key={i}>
            <span className="ticker__cat">{it.cat}</span>
            {it.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function CatsSection() {
  return (
    <section className="cats-section">
      <div className="wrap">
        <div className="section-eyebrow">Categories</div>
        <h2 className="section-h2">
          내가 원하는 공지만,<br /><em>골라서</em> 받는다.
        </h2>
        <div className="cats-grid">
          {CATS.map(c => (
            <div className="cat-chip" key={c.v}>
              <div className="cat-chip__name">{c.v}</div>
              <div className="cat-chip__hint">{c.h}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot__logo">SSU<em>메일</em></div>
      <div className="foot__links">
        <a href="#/subscribe">구독하기</a>
        <a href="#/privacy">개인정보처리방침</a>
        <a href="#/terms">이용약관</a>
        <a href="https://ssu-chapel.pages.dev" target="_blank" rel="noopener noreferrer">채플 정보</a>
        <a href="https://github.com/DWL21/ssu-chapel" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <div className="foot__copy">© 2026 SSU-MAIL · 비공식 학생 서비스</div>
    </footer>
  );
}

function getHash() {
  return window.location.hash.replace(/^#\/?/, '') || '';
}

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const unsubscribeToken = useMemo(
    () => new URLSearchParams(window.location.search).get('unsubscribe'),
    []
  );
  const [hash, setHash] = useState(getHash);
  useEffect(() => {
    const handler = () => setHash(getHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const toggleTheme = () => setIsDark(p => !p);

  if (unsubscribeToken) {
    return (
      <div className="page-simple">
        <div className="page-simple__inner">
          <a href="#" className="page-simple__back">← 홈으로</a>
          <UnsubscribePage apiBase={API_BASE} token={unsubscribeToken} />
        </div>
      </div>
    );
  }

  if (hash === 'privacy') return <PrivacyPage />;
  if (hash === 'terms') return <TermsPage />;
  if (hash === 'subscribe') return <SubscribePage isDark={isDark} onToggleTheme={toggleTheme} />;

  return (
    <>
      <Nav isDark={isDark} onToggle={toggleTheme} />
      <Hero />
      <Ticker />
      <CatsSection />
      <Footer />
    </>
  );
}
