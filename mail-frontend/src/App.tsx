import { useState, useMemo, useEffect } from 'react';
import UnsubscribePage from './UnsubscribePage';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
import SubscribePage from './SubscribePage';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8001';

const todayLabel = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${m}.${day}`;
};

/* ───────── Icons ────────────────────────────────────────── */
function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="btn__arrow"
      style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
      <path d="M2 6h8m0 0L6.5 2.5M10 6L6.5 9.5" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────── Header ───────────────────────────────────────── */
function Header() {
  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <a className="brand" href="#top">
          <span className="brand__word">숭실메일</span>
          <span className="brand__dot" />
          <span className="brand__sub">ssu-mail</span>
        </a>
        <nav className="site-nav">
          <span className="site-nav__links" style={{ display: 'inline-flex', gap: 24 }}>
            <a href="#how">소개</a>
            <a href="#/subscribe">구독</a>
            <a href="#faq">FAQ</a>
          </span>
          <a className="site-nav__back" href="#/subscribe">
            구독하기
            <Arrow />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ───────── Hero ─────────────────────────────────────────── */
function HeroMailMock() {
  const cards = [
    { status: '진행', cat: '채용', dept: '총무·인사팀', title: '2026년 숭실대학교 교무처 교무팀 계약직 직원 모집' },
    { status: '진행', cat: '장학', dept: '장학팀', title: '2026년 대통령과학장학금 신규장학생 선발 공고' },
    { status: '',     cat: '비교과·행사', dept: '한국기독교문화연구원', title: '2026 한국기독교문화연구원 해외 석학초청강좌 I' },
  ];
  return (
    <div className="mailmock" aria-hidden="true">
      <div className="mailmock__head">
        <div className="mailmock__head-left">
          <h4>숭실대학교 공지사항</h4>
          <p>{todayLabel()} · 새 공지 {cards.length}건</p>
        </div>
        <div className="mailmock__time">매일 08:00</div>
      </div>
      <div className="mailmock__body">
        {cards.map((c, i) => (
          <div className="mailmock__card" key={i}>
            <div className="mailmock__badges">
              {c.status && (
                <span className="mailmock__badge mailmock__badge--status">{c.status}</span>
              )}
              <span className="mailmock__badge mailmock__badge--cat">{c.cat}</span>
              <span className="mailmock__badge mailmock__badge--dept">{c.dept}</span>
            </div>
            <div className="mailmock__title">{c.title}</div>
          </div>
        ))}
      </div>
      <div className="mailmock__foot">
        <a className="mailmock__foot-btn" href="https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&keyword" target="_blank" rel="noopener noreferrer">전체 공지사항 보기</a>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__grid">
        <div>
          <div className="eyebrow hero__eyebrow">숭실메일 · ssu-mail</div>
          <h1 className="hero__title">
            놓치기엔 너무 중요한 공지를,{' '}
            <em>한 통의 메일</em>로.
          </h1>
          <p className="hero__lede">
            장학금 마감, 수강신청, 채용 공고까지 — 흩어진 학교 공지를
            카테고리별로 골라 매일 아침 한 번에 정리해 보내드립니다.
          </p>
          <a href="#/subscribe" className="btn-hero-cta">
            지금 구독하기 <Arrow />
          </a>
        </div>
        <HeroMailMock />
      </div>
    </section>
  );
}

/* ───────── How it works ─────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '1', title: '관심 카테고리를 고릅니다', body: '학사·장학부터 채용·봉사까지 10개 카테고리 중 보고 싶은 것만 골라 담아요.' },
    { n: '2', title: '이메일 주소를 입력합니다', body: '받아볼 메일 주소를 알려주세요. 학교 메일도 개인 메일도 모두 가능합니다.' },
    { n: '3', title: '인증 후 구독 완료', body: '6자리 인증번호를 확인하면 끝. 매일 아침 08시, 새 공지가 자동으로 도착합니다.' },
  ];
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section__head">
          <div className="section__label">How it works</div>
          <h2 className="section__title">세 단계면 충분합니다.</h2>
        </div>
        <div className="how">
          {steps.map(s => (
            <div className="how__step" key={s.n}>
              <span className="how__num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ──────────────────────────────────────────── */
function FAQ() {
  const qs = [
    { q: '유료인가요?', a: '아니요, 모두 무료입니다. 광고도, 트래킹 픽셀도 넣지 않습니다. 학내 공지를 더 쉽게 받아보자는 학생 사이드 프로젝트로 운영됩니다.' },
    { q: '공식 채널인가요?', a: '학교 공식 서비스는 아닙니다. 숭실대학교 홈페이지의 공개 공지를 크롤링해 정리해 보내드리며, 원문은 항상 메일 안의 링크에서 확인할 수 있습니다.' },
    { q: '구독을 해제하려면 어떻게 하나요?', a: "모든 메일 하단의 '구독 해지' 링크 한 번이면 끝입니다. 별도 계정 가입이 없기 때문에 비밀번호도 필요하지 않습니다." },
    { q: '어떤 정보를 저장하나요?', a: '메일 주소와 선택한 카테고리만 저장합니다. 학번이나 비밀번호는 저장하지 않으며, 발송 외 다른 용도로 사용하지 않습니다.' },
  ];
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section__head">
          <div className="section__label">FAQ</div>
          <h2 className="section__title">궁금할 만한 <em>네 가지</em>.</h2>
        </div>
        <div className="faq">
          {qs.map((it, i) => (
            <div className="faq__item" key={i}>
              <span className="faq__num">{i + 1}</span>
              <div>
                <h3 className="faq__q">{it.q}</h3>
                <p className="faq__a">{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Footer ───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__row">
          <div>
            <div className="foot__brand">숭실<span className="accent">메일</span></div>
            <div className="foot__brand-sub">ssu-mail</div>
          </div>
          <div className="foot__cols">
            <div className="foot__col">
              <h4 className="foot__col-title">Product</h4>
              <ul>
                <li><a href="#how">소개</a></li>
                <li><a href="#/subscribe">구독</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="foot__col">
              <h4 className="foot__col-title">Legal</h4>
              <ul>
                <li><a href="#/privacy">개인정보 처리방침</a></li>
                <li><a href="#/terms">이용약관</a></li>
              </ul>
            </div>
            <div className="foot__col">
              <h4 className="foot__col-title">Project</h4>
              <ul>
                <li><a href="https://ssu-chapel.pages.dev/?utm_source=ssu-mails&utm_campaign=cross_link">채플 정보 조회</a></li>
                <li><a href="https://github.com/DWL21/ssu-chapel">GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="foot__base">
          <span>© 2026 SSU-MAIL · NOT AN OFFICIAL SOONGSIL UNIVERSITY SERVICE</span>
          <span>BUILT BY STUDENTS · OPEN-SOURCE</span>
        </div>
      </div>
    </footer>
  );
}

/* ───────── App ──────────────────────────────────────────── */
function getHash() {
  return window.location.hash.replace(/^#\/?/, '') || '';
}

export default function App() {
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

  if (unsubscribeToken) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <UnsubscribePage apiBase={API_BASE} token={unsubscribeToken} />
        </div>
      </div>
    );
  }

  if (hash === 'privacy') return <PrivacyPage />;
  if (hash === 'terms') return <TermsPage />;
  if (hash === 'subscribe') return <SubscribePage />;

  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <FAQ />
      <Footer />
    </>
  );
}
