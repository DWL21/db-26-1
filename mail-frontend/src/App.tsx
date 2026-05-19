import { useState, useMemo, useEffect, useRef } from 'react';
import UnsubscribePage from './UnsubscribePage';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8001';

/* ───────── Confetti ─────────────────────────────────────── */
const CONFETTI_COLORS = ['#4ec6c1', '#3aa9a4', '#f5c518', '#22c55e', '#f87171', '#a78bfa', '#38bdf8', '#fb923c'];

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 8, h: 10 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2.5 + Math.random() * 3.5,
      opacity: 1,
    }));
    let raf: number;
    let done = false;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allOut = true;
      for (const p of pieces) {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
        if (p.y > canvas.height * 0.7) p.opacity = Math.max(0, p.opacity - 0.025);
        if (p.y < canvas.height + 20) allOut = false;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (!allOut && !done) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { done = true; cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }} />;
}

/* ───────── Ticker data ──────────────────────────────────── */
const TICKER_ITEMS = [
  { cat: '장학',     title: '2026-1 국가장학금 2차 신청 마감' },
  { cat: '채용',     title: '삼성전자 DS부문 신입 채용설명회' },
  { cat: '학사',     title: '2026학년도 1학기 수강신청 일정' },
  { cat: '국제교류', title: '2026 봄학기 교환학생 모집 공고' },
  { cat: '비교과',   title: '총장 초청 봄 콘서트 (5/24)' },
  { cat: '봉사',     title: '1365 자원봉사 정기 활동 모집' },
];

/* ───────── Data ─────────────────────────────────────────── */
const CATEGORIES = [
  { value: '학사',         hint: '수강·학적·졸업' },
  { value: '장학',         hint: '장학금 공고' },
  { value: '국제교류',     hint: '교환·어학연수' },
  { value: '외국인유학생', hint: '비자·생활' },
  { value: '채용',         hint: '취업·인턴' },
  { value: '비교과·행사',  hint: '특강·문화행사' },
  { value: '교원채용',     hint: '교원 공고' },
  { value: '교직',         hint: '교원자격' },
  { value: '봉사',         hint: '봉사활동' },
  { value: '기타',         hint: '그 외' },
];

interface NoticeItem {
  status: string;
  category: string;
  department: string;
  title: string;
}

const SAMPLE_NOTICES: Record<string, NoticeItem[]> = {
  '학사': [
    { status: '진행', category: '학사', department: '학사팀', title: '2026학년도 1학기 수강신청 일정 안내' },
    { status: '진행', category: '학사', department: '학사팀', title: '성적 정정 기간 및 절차 공고' },
    { status: '마감', category: '학사', department: '학사팀', title: '조기졸업 신청 마감 안내' },
  ],
  '장학': [
    { status: '진행', category: '장학', department: '장학팀', title: '2026-1 국가장학금 2차 신청 마감 (~5/20)' },
    { status: '진행', category: '장학', department: '장학팀', title: '교내 우수장학생 추천 모집' },
  ],
  '국제교류': [
    { status: '진행', category: '국제교류', department: '국제처', title: '2026 봄학기 교환학생 모집 공고' },
    { status: '진행', category: '국제교류', department: '국제처', title: '어학연수 프로그램 설명회 안내' },
  ],
  '외국인유학생': [
    { status: '진행', category: '외국인유학생', department: '국제처', title: '외국인 유학생 비자 연장 안내' },
    { status: '진행', category: '외국인유학생', department: '국제처', title: '한국어 도우미 프로그램 신청' },
  ],
  '채용': [
    { status: '진행', category: '채용', department: '취업지원팀', title: '삼성전자 DS부문 신입 채용설명회 (5/22)' },
    { status: '진행', category: '채용', department: '취업지원팀', title: '현대자동차 R&D 인턴 모집 공고' },
    { status: '마감', category: '채용', department: '취업지원팀', title: '취업 동아리 SCBP 신규 부원 모집' },
  ],
  '비교과·행사': [
    { status: '진행', category: '비교과·행사', department: '학생지원팀', title: '총장 초청 봄 콘서트 (5/24)' },
    { status: '진행', category: '비교과·행사', department: '도서관', title: '독서마라톤 5월 챌린지 시작' },
  ],
  '교원채용': [
    { status: '진행', category: '교원채용', department: '총무·인사팀', title: '2026학년도 1학기 전임교원 공개채용 공고' },
  ],
  '교직': [
    { status: '진행', category: '교직', department: '교직지원실', title: '교원자격증 발급 신청 안내' },
  ],
  '봉사': [
    { status: '진행', category: '봉사', department: '학생복지팀', title: '1365 자원봉사 정기 활동 모집' },
    { status: '진행', category: '봉사', department: '학생복지팀', title: '지역 아동센터 학습 멘토링 봉사자 모집' },
  ],
  '기타': [
    { status: '진행', category: '기타', department: '총무팀', title: '학내 셔틀버스 운행 시간표 변경' },
    { status: '마감', category: '기타', department: '도서관', title: '도서관 휴관 안내' },
  ],
};

const todayLabel = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${m}.${day}`;
};

function nextEightCountdown() {
  const now = new Date();
  const target = new Date();
  target.setHours(8, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const ms = target.getTime() - now.getTime();
  const h = Math.floor(ms / 3600000);
  const min = Math.floor((ms % 3600000) / 60000);
  return `${h}시간 ${min}분`;
}

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

function Tick() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="chip__tick">
      <path d="M2.5 6.2L4.7 8.4 9.5 3.6" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────── Ticker ───────────────────────────────────────── */
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
            <a href="#subscribe">구독</a>
            <a href="#faq">FAQ</a>
          </span>
          <a className="site-nav__back" href="#subscribe">
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
          <a href="#subscribe" className="btn-hero-cta">
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

/* ───────── Subscribe flow ───────────────────────────────── */
function Stepper({ step, onJump, mode }: { step: number; onJump: (n: number) => void; mode: 'new' | 'existing' | null }) {
  const items = [
    { n: 1, label: '이메일' },
    { n: 2, label: '인증' },
    { n: 3, label: mode === 'existing' ? '구독 관리' : '카테고리' },
  ];
  return (
    <div className="steps">
      {items.map((it, i) => {
        const state = step === it.n ? 'steps__item--active' : step > it.n ? 'steps__item--done' : '';
        return (
          <>
            <button key={it.n} className={`steps__item ${state}`} onClick={() => onJump(it.n)}>
              <span className="steps__num">{step > it.n ? '✓' : it.n}</span>
              {it.label}
            </button>
            {i < items.length - 1 && <span key={`bar-${it.n}`} className="steps__bar" />}
          </>
        );
      })}
    </div>
  );
}

function CategoryChips({
  selected, toggleCat, selectAll,
}: {
  selected: string[];
  toggleCat: (v: string) => void;
  selectAll: () => void;
}) {
  return (
    <>
      <div className="chips__actions">
        <span className="chips__count">{selected.length} / {CATEGORIES.length} 선택됨</span>
        <button className="chips__select-all" onClick={selectAll}>
          {selected.length === CATEGORIES.length ? '전체 해제' : '전체 선택'}
        </button>
      </div>
      <div className="chips" role="group" aria-label="카테고리 선택">
        {CATEGORIES.map(c => {
          const on = selected.includes(c.value);
          return (
            <button key={c.value} className={`chip ${on ? 'chip--on' : ''}`}
              onClick={() => toggleCat(c.value)} aria-pressed={on}>
              <Tick />
              {c.value}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepCategories({
  selected, toggleCat, selectAll,
}: {
  selected: string[];
  toggleCat: (v: string) => void;
  selectAll: () => void;
}) {
  return (
    <>
      <div className="form-card__head">
        <h3 className="form-card__title">어떤 공지를 받을까요?</h3>
      </div>
      <p className="form-card__sub">보고 싶은 카테고리를 골라주세요. 언제든지 바꿀 수 있어요.</p>
      <CategoryChips selected={selected} toggleCat={toggleCat} selectAll={selectAll} />
    </>
  );
}

function StepManage({
  selected, toggleCat, selectAll, onUnsubscribe, unsubLoading,
}: {
  selected: string[];
  toggleCat: (v: string) => void;
  selectAll: () => void;
  onUnsubscribe: () => void;
  unsubLoading: boolean;
}) {
  return (
    <>
      <div className="form-card__head">
        <h3 className="form-card__title">현재 구독 중인 카테고리</h3>
      </div>
      <p className="form-card__sub">원하는 대로 수정하고 저장하거나, 전체 구독을 해지할 수 있어요.</p>
      <CategoryChips selected={selected} toggleCat={toggleCat} selectAll={selectAll} />
      <div className="unsub-zone">
        <button className="btn btn--unsub" onClick={onUnsubscribe} disabled={unsubLoading}>
          {unsubLoading ? '처리 중...' : '전체 구독 해지'}
        </button>
      </div>
    </>
  );
}

function StepEmail({
  email, setEmail,
}: {
  email: string;
  setEmail: (v: string) => void;
}) {
  return (
    <>
      <div className="form-card__head">
        <h3 className="form-card__title">이메일 주소를 알려주세요</h3>
      </div>
      <p className="form-card__sub">
        매일 08:00 새 공지를 보내드립니다. 이미 구독 중이라면 구독 정보를 바로 확인할 수 있어요.
      </p>
      <div className="field">
        <label className="field__label" htmlFor="emailInput">이메일 주소</label>
        <input id="emailInput" className="input" type="email"
          placeholder="20261234@soongsil.ac.kr" value={email}
          onChange={e => setEmail(e.target.value)} autoFocus autoComplete="email" spellCheck={false} />
      </div>
    </>
  );
}

function StepCode({
  email, code, setCode, onEditEmail,
}: {
  email: string;
  code: string[];
  setCode: (c: string[]) => void;
  onEditEmail: () => void;
}) {
  const value = code.join('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setCode(next);
  };

  return (
    <>
      <div className="form-card__head">
        <h3 className="form-card__title">인증번호를 확인해주세요</h3>
      </div>
      <p className="form-card__sub">방금 발송된 6자리 인증번호를 입력해주세요. (최대 5분 소요)</p>
      <p className="form-card__spam-hint">메일이 오지 않으면 <strong>스팸메일함</strong>을 확인해주세요.</p>
      <div className="recap">
        <span className="recap__label">To</span>
        <span className="recap__value">{email}</span>
        <button className="recap__edit" onClick={onEditEmail}>변경</button>
      </div>
      <div className="field">
        <label className="field__label" htmlFor="codeInput">인증번호 6자리</label>
        <input
          id="codeInput"
          className="input"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={value}
          placeholder="인증번호 6자리 입력"
          onChange={handleChange}
          autoFocus
          autoComplete="one-time-code"
          spellCheck={false}
        />
      </div>
    </>
  );
}

type DoneKind = 'subscribed' | 'updated' | 'unsubscribed';

function StepDone({ email, count, kind }: { email: string; count: number; kind: DoneKind }) {
  if (kind === 'unsubscribed') {
    return (
      <div className="success">
        <div className="success__mark success__mark--unsub">✕</div>
        <h3 className="success__title">구독이 해지되었습니다</h3>
        <p className="success__sub">
          <strong>{email}</strong>의 모든 구독이 해지되었습니다.<br />
          언제든 다시 구독할 수 있어요.
        </p>
      </div>
    );
  }
  return (
    <>
      <Confetti />
      <div className="success">
      <div className="success__mark">✓</div>
      <h3 className="success__title">
        {kind === 'updated' ? '구독이 변경되었습니다' : '구독이 완료되었습니다'}
      </h3>
      <p className="success__sub">
        내일 아침 08:00, <strong>{email}</strong>로<br />
        선택하신 {count}개 카테고리의 새 공지가 도착합니다.
      </p>
      <div className="success__meta">첫 메일까지 약 {nextEightCountdown()}</div>
    </div>
    </>
  );
}

/* ───────── Live mail preview ────────────────────────────── */
function MailPreview({ selected }: { selected: string[] }) {
  const items = useMemo(
    () => selected.flatMap(cat => (SAMPLE_NOTICES[cat] || []).map(n => ({ ...n }))),
    [selected]
  );

  return (
    <div className="mail">
      <div className="mail__chrome">
        <h4>숭실대학교 공지사항</h4>
        <p>{todayLabel()} · {selected.length === 0 ? '구독 카테고리 미선택' : `새 공지 ${items.length}건`}</p>
      </div>
      <div className="mail__body">
        {selected.length === 0 ? (
          <div className="mail__empty">
            <span>✉</span>
            <p>왼쪽에서 카테고리를 골라보세요.<br />실제로 받게 될 메일이 여기에 채워집니다.</p>
          </div>
        ) : (
          items.map((n, i) => (
            <div className="mail__card" key={i}>
              <div className="mail__badges">
                {n.status && (
                  <span
                    className="mail__badge mail__badge--status"
                    style={n.status === '마감' ? { background: '#e74c3c' } : undefined}
                  >
                    {n.status}
                  </span>
                )}
                <span className="mail__badge mail__badge--cat">{n.category}</span>
                <span className="mail__badge mail__badge--dept">{n.department}</span>
              </div>
              <p className="mail__item-title">{n.title}</p>
            </div>
          ))
        )}
      </div>
      <div className="mail__foot">
        <a className="mail__foot-btn" href="https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/?f&keyword" target="_blank" rel="noopener noreferrer">전체 공지사항 보기</a>
        <p className="mail__foot-note">
          본 메일은 숭실대학교 공지사항 구독 서비스에 의해 자동 발송되었습니다.<br />
          <a href="#">구독 해지</a>
        </p>
      </div>
    </div>
  );
}

function Subscribe() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'new' | 'existing' | null>(null);
  const [doneKind, setDoneKind] = useState<DoneKind>('subscribed');
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unsubLoading, setUnsubLoading] = useState(false);

  const toggleCat = (v: string) => {
    setSelected(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    setError(null);
  };
  const selectAll = () => setSelected(selected.length === CATEGORIES.length ? [] : CATEGORIES.map(c => c.value));
  const goBack = () => { setError(null); if (step > 1) setStep(step - 1); };
  const goStep = (n: number) => { if (n < step) { setError(null); setStep(n); } };

  const goNext = async () => {
    setError(null);

    // Step 1: 이메일 입력 → 인증번호 발송
    if (step === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('올바른 이메일 형식이 아닙니다.'); return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/request-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { detail?: string }).detail || '인증번호 발송에 실패했습니다.');
        }
        setStep(2);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }

    // Step 2: 인증번호 확인 → 기존/신규 분기
    } else if (step === 2) {
      if (code.join('').length !== 6) { setError('6자리 인증번호를 모두 입력해주세요.'); return; }
      setLoading(true);
      try {
        const params = new URLSearchParams({ email: email.trim(), auth_code: code.join('') });
        const res = await fetch(`${API_BASE}/subscriptions/me?${params}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { detail?: string }).detail || '인증에 실패했거나 인증번호가 만료되었습니다.');
        }
        const data = await res.json() as { is_registered: boolean; subscribed_categories: string[] };
        if (data.is_registered) {
          setMode('existing');
          setSelected(data.subscribed_categories);
        } else {
          setMode('new');
          setSelected([]);
        }
        setStep(3);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }

    // Step 3: 카테고리 선택 완료 or 구독 변경 저장
    } else if (step === 3) {
      if (selected.length === 0) { setError('구독할 카테고리를 1개 이상 골라주세요.'); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/subscriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), categories: selected, auth_code: code.join('') }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { detail?: string }).detail || '저장에 실패했습니다.');
        }
        setDoneKind(mode === 'existing' ? 'updated' : 'subscribed');
        setStep(4);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }
    }
  };

  const handleUnsubscribe = async () => {
    setError(null);
    setUnsubLoading(true);
    try {
      const res = await fetch(`${API_BASE}/subscriptions/me`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), auth_code: code.join('') }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail || '구독 해지에 실패했습니다.');
      }
      setDoneKind('unsubscribed');
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally { setUnsubLoading(false); }
  };

  const barTitle = step === 4
    ? doneKind === 'unsubscribed' ? '구독 해지 완료' : mode === 'existing' ? '구독 변경 완료' : '구독 완료'
    : mode === 'existing' && step === 3 ? '구독 관리' : '공지 구독하기';

  const barSub = step === 4
    ? doneKind === 'unsubscribed' ? '구독이 해지되었습니다' : '내일 아침부터 새 공지를 받아보세요'
    : [
        '이메일 주소를 입력해주세요',
        '인증번호로 본인 메일을 확인합니다',
        mode === 'existing' ? '카테고리를 수정하거나 구독을 해지할 수 있어요' : '받고 싶은 카테고리를 골라주세요',
      ][step - 1];

  const nextLabel = mode === 'existing' && step === 3 ? '구독 변경 저장' : step === 1 ? '인증번호 받기' : step === 2 ? '확인' : '구독 완료';

  return (
    <section className="subscribe-page" id="subscribe">
      <div className="wrap">
        <div className="section__head">
          <div className="section__label">Subscribe</div>
          <h2 className="section__title">
            원하는 공지만,<br /><em>골라서 받으세요.</em>
          </h2>
        </div>
        <div className="sub-grid">
          <div>
            <Stepper step={step} onJump={goStep} mode={mode} />
            <div className="form-card">
              <div className="form-card__bar">
                <h4>{barTitle}</h4>
                <p>{barSub}</p>
              </div>
              <div className="form-card__inner">
                {step === 1 && <StepEmail email={email} setEmail={setEmail} />}
                {step === 2 && <StepCode email={email} code={code} setCode={setCode} onEditEmail={() => setStep(1)} />}
                {step === 3 && mode !== 'existing' && <StepCategories selected={selected} toggleCat={toggleCat} selectAll={selectAll} />}
                {step === 3 && mode === 'existing' && (
                  <StepManage
                    selected={selected} toggleCat={toggleCat} selectAll={selectAll}
                    onUnsubscribe={handleUnsubscribe} unsubLoading={unsubLoading}
                  />
                )}
                {step === 4 && <StepDone email={email} count={selected.length} kind={doneKind} />}

                {error && <div className="field-error">{error}</div>}

                {step !== 4 && (
                  <div className="actions">
                    <div className="actions__left">
                      {step > 1 && (
                        <button className="btn btn--ghost" onClick={goBack} disabled={loading || unsubLoading}>
                          <Arrow flip /> 이전
                        </button>
                      )}
                    </div>
                    <button className="btn btn--primary" onClick={goNext}
                      disabled={loading || unsubLoading || (step === 3 && selected.length === 0)}>
                      {loading ? '처리 중...' : <>{nextLabel} <Arrow /></>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="preview">
            <MailPreview selected={selected} />
          </div>
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
                <li><a href="#subscribe">구독</a></li>
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

  return (
    <>
      <Header />
      <Hero />
      <Ticker />
      <HowItWorks />
      <Subscribe />
      <FAQ />
      <Footer />
    </>
  );
}
