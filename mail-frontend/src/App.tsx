import { useState, useMemo, useRef, useEffect } from 'react';
import UnsubscribePage from './UnsubscribePage';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8001';

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

const SAMPLE_NOTICES: Record<string, { t: string; d: string }[]> = {
  '학사': [
    { t: '2026학년도 1학기 수강신청 일정 안내', d: '05.16' },
    { t: '성적 정정 기간 및 절차 공고', d: '05.16' },
    { t: '조기졸업 신청 마감 안내', d: '05.15' },
  ],
  '장학': [
    { t: '2026-1 국가장학금 2차 신청 마감 (~5/20)', d: '05.16' },
    { t: '교내 우수장학생 추천 모집', d: '05.15' },
  ],
  '국제교류': [
    { t: '2026 봄학기 교환학생 모집 공고', d: '05.16' },
    { t: '어학연수 프로그램 설명회 안내', d: '05.14' },
  ],
  '외국인유학생': [
    { t: '외국인 유학생 비자 연장 안내', d: '05.16' },
    { t: '한국어 도우미 프로그램 신청', d: '05.14' },
  ],
  '채용': [
    { t: '삼성전자 DS부문 신입 채용설명회 (5/22 오후 2시)', d: '05.16' },
    { t: '현대자동차 R&D 인턴 모집 공고', d: '05.15' },
    { t: '취업 동아리 SCBP 신규 부원 모집', d: '05.15' },
  ],
  '비교과·행사': [
    { t: '총장 초청 봄 콘서트 (5/24)', d: '05.16' },
    { t: '독서마라톤 5월 챌린지 시작', d: '05.13' },
  ],
  '교원채용': [
    { t: '2026학년도 1학기 전임교원 공개채용 공고', d: '05.15' },
  ],
  '교직': [
    { t: '교원자격증 발급 신청 안내', d: '05.14' },
  ],
  '봉사': [
    { t: '1365 자원봉사 정기 활동 모집', d: '05.16' },
    { t: '지역 아동센터 학습 멘토링 봉사자 모집', d: '05.13' },
  ],
  '기타': [
    { t: '학내 셔틀버스 운행 시간표 변경', d: '05.16' },
    { t: '도서관 휴관 안내', d: '05.15' },
  ],
};

const todayLabel = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${m}.${day}`;
};

function nextNineCountdown() {
  const now = new Date();
  const target = new Date();
  target.setHours(9, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const ms = target.getTime() - now.getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}시간 ${m}분`;
}

/* ───────── Routing ──────────────────────────────────────── */
type Route = 'home' | 'subscribe';

function getRoute(): Route {
  return window.location.hash.startsWith('#/subscribe') ? 'subscribe' : 'home';
}

/* ───────── Icon components ──────────────────────────────── */
function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="btn__arrow"
      style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
      <path d="M2 6h8m0 0L6.5 2.5M10 6L6.5 9.5" stroke="currentColor"
        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="chip__tick">
      <path d="M2.5 6.2L4.7 8.4 9.5 3.6" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────── Header ───────────────────────────────────────── */
function Header() {
  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <a className="brand" href="#/">
          <span className="brand__word">숭실메일</span>
          <span className="brand__dot" />
          <span className="brand__sub">ssu-mail</span>
        </a>
        <nav className="site-nav">
          <span className="site-nav__links" style={{ display: 'inline-flex', gap: 28 }}>
            <a href="#how">소개</a>
            <a href="#subscribe-section">구독</a>
            <a href="#faq">FAQ</a>
          </span>
        </nav>
      </div>
    </header>
  );
}

function SubscribeHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <a className="brand" href="#/">
          <span className="brand__word">숭실메일</span>
          <span className="brand__dot" />
          <span className="brand__sub">ssu-mail</span>
        </a>
        <a className="site-nav__back" href="#/">
          <Arrow flip />
          돌아가기
        </a>
      </div>
    </header>
  );
}

/* ───────── Hero ─────────────────────────────────────────── */
function HeroMailMock() {
  return (
    <div className="mailmock" aria-hidden="true">
      <div className="mailmock__head">
        <div className="mailmock__head-left">
          <div className="mailmock__avatar">숭</div>
        </div>
        <div className="mailmock__time">{todayLabel()} · 09:00</div>
      </div>
      <div className="mailmock__body">
        <h3 className="mailmock__subject">오늘의 숭실대 공지 · 7건 (학사·장학·채용)</h3>
        <div className="mailmock__divide" />
        <div>
          <div className="mailmock__section-title">학사 · 3</div>
          <div className="mailmock__item">
            <span className="mailmock__item-num">01</span>
            <span className="mailmock__item-title">2026-1 수강신청 일정 안내</span>
          </div>
          <div className="mailmock__item">
            <span className="mailmock__item-num">02</span>
            <span className="mailmock__item-title">성적 정정 기간 및 절차 공고</span>
          </div>
          <div className="mailmock__item">
            <span className="mailmock__item-num">03</span>
            <span className="mailmock__item-title">조기졸업 신청 마감 안내</span>
          </div>
        </div>
        <div className="mailmock__divide" />
        <div>
          <div className="mailmock__section-title">장학 · 2</div>
          <div className="mailmock__item">
            <span className="mailmock__item-num">04</span>
            <span className="mailmock__item-title">국가장학금 2차 신청 마감 (~5/20)</span>
          </div>
          <div className="mailmock__item">
            <span className="mailmock__item-num">05</span>
            <span className="mailmock__item-title">교내 우수장학생 추천 모집</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__grid">
        <div>
          <div className="eyebrow hero__eyebrow">숭실메일 · ssu-mail</div>
          <h1 className="hero__title">
            놓치기엔 너무 중요한 공지를,<br />
            <em>한 통의 메일</em>로.
          </h1>
          <p className="hero__lede">
            장학금 마감, 수강신청, 채용 공고까지 — 흩어진 학교 공지를
            카테고리별로 골라 매일 아침 09시 한 번에 정리해 보내드립니다.
          </p>
          <button className="btn-hero-cta" onClick={onSubscribe}>
            구독하기 <Arrow />
          </button>
        </div>
        <HeroMailMock />
      </div>
    </section>
  );
}

/* ───────── How it works ─────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: '관심 카테고리를 고릅니다',
      body: '학사·장학부터 채용·봉사까지 10개 카테고리 중 보고 싶은 것만 골라 담아요.',
    },
    {
      n: '02',
      title: '이메일 주소를 입력합니다',
      body: '받아볼 메일 주소를 알려주세요. 학교 메일도 개인 메일도 모두 가능합니다.',
    },
    {
      n: '03',
      title: '인증 한 번으로 구독 완료',
      body: '6자리 인증번호를 확인하면 끝. 그 이후엔 매일 09시, 새 공지가 자동으로 도착합니다.',
    },
  ];
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section__head">
          <div className="section__label">How it works</div>
          <h2 className="section__title">
            구독까지 세 단계면 됩니다.<br />
            <em>이후엔 매일 09시.</em>
          </h2>
        </div>
        <div className="how">
          {steps.map(s => (
            <div className="how__step" key={s.n}>
              <span className="how__num"><em>{s.n}</em></span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Subscribe flow (separate page) ───────────────── */
function Stepper({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  const items = [
    { n: 1, label: '카테고리' },
    { n: 2, label: '이메일' },
    { n: 3, label: '인증' },
  ];
  return (
    <div className="steps">
      {items.map((it, i) => {
        const state =
          step === it.n ? 'steps__item--active' :
          step > it.n  ? 'steps__item--done'   : '';
        return (
          <>
            <button key={it.n} className={`steps__item ${state}`} onClick={() => onJump(it.n)}>
              <span className="steps__num">{step > it.n ? '✓' : String(it.n).padStart(2, '0')}</span>
              {it.label}
            </button>
            {i < items.length - 1 && <span key={`bar-${it.n}`} className="steps__bar" />}
          </>
        );
      })}
    </div>
  );
}

function StepCategories({
  selected,
  toggleCat,
  selectAll,
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
      <p className="form-card__sub">보고 싶은 카테고리를 골라주세요. 언제든지 변경할 수 있습니다.</p>
      <div className="chips__actions">
        <span className="chips__count">
          {String(selected.length).padStart(2, '0')} / 10 선택됨
        </span>
        <button className="chips__select-all" onClick={selectAll}>
          {selected.length === CATEGORIES.length ? '전체 해제' : '전체 선택'}
        </button>
      </div>
      <div className="chips" role="group" aria-label="카테고리 선택">
        {CATEGORIES.map(c => {
          const on = selected.includes(c.value);
          return (
            <button
              key={c.value}
              className={`chip ${on ? 'chip--on' : ''}`}
              onClick={() => toggleCat(c.value)}
              aria-pressed={on}
            >
              <Tick />
              {c.value}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepEmail({
  email,
  setEmail,
  selectedCount,
}: {
  email: string;
  setEmail: (v: string) => void;
  selectedCount: number;
}) {
  return (
    <>
      <div className="form-card__head">
        <h3 className="form-card__title">어디로 보내드릴까요?</h3>
      </div>
      <p className="form-card__sub">
        선택한 카테고리 {selectedCount}개의 공지를 매일 09:00 이 주소로 보내드립니다.
      </p>
      <div className="field">
        <label className="field__label" htmlFor="emailInput">이메일 주소</label>
        <input
          id="emailInput"
          className="input"
          type="email"
          placeholder="20261234@soongsil.ac.kr"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          autoComplete="email"
          spellCheck={false}
        />
      </div>
    </>
  );
}

function StepCode({
  email,
  code,
  setCode,
  onEditEmail,
}: {
  email: string;
  code: string[];
  setCode: (c: string[]) => void;
  onEditEmail: () => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length > 0) {
      e.preventDefault();
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < text.length; i++) next[i] = text[i];
      setCode(next);
      refs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  useEffect(() => { refs.current[0]?.focus(); }, []);

  return (
    <>
      <div className="form-card__head">
        <h3 className="form-card__title">인증번호를 확인해주세요</h3>
      </div>
      <p className="form-card__sub">
        발송된 6자리 인증번호를 입력해주세요. 스팸함도 확인해보세요. (최대 5분 소요)
      </p>
      <div className="recap">
        <span className="recap__label">To</span>
        <span className="recap__value">{email}</span>
        <button className="recap__edit" onClick={onEditEmail}>변경</button>
      </div>
      <div className="field">
        <label className="field__label">인증번호 6자리</label>
        <div className="code-input" onPaste={onPaste}>
          {code.map((d, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              placeholder="–"
              onChange={e => set(i, e.target.value)}
              onKeyDown={e => onKey(i, e)}
              aria-label={`인증번호 ${i + 1}번째 자리`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function StepDone({ email, count }: { email: string; count: number }) {
  return (
    <div className="success">
      <div className="success__mark">✻</div>
      <h3 className="success__title">구독이 완료되었습니다</h3>
      <p className="success__sub">
        내일 아침 09:00, <strong>{email}</strong>로<br />
        선택하신 {count}개 카테고리의 공지가 도착합니다.
      </p>
      <div className="success__meta">
        {todayLabel()} · 첫 메일까지 약 <span style={{ marginLeft: 4 }}>{nextNineCountdown()}</span>
      </div>
    </div>
  );
}

function MailPreview({ selected, email }: { selected: string[]; email: string }) {
  const items = useMemo(
    () => selected.flatMap(cat => (SAMPLE_NOTICES[cat] || []).map(n => ({ ...n, cat }))),
    [selected]
  );
  const byCat = useMemo(() => {
    const out: Record<string, typeof items> = {};
    for (const it of items) (out[it.cat] = out[it.cat] || []).push(it);
    return out;
  }, [items]);

  return (
    <div className="mail">
      <div className="mail__chrome">
        <div className="mail__chrome-left">
          <span className="mail__dot" />
          <span className="mail__dot" />
          <span className="mail__dot" />
        </div>
        <div className="mail__chrome-right">받은편지함 · 매일 09:00</div>
      </div>
      <div className="mail__head">
        <div className="mail__date">{todayLabel()} · 09:00</div>
        <h3 className="mail__subject">
          {selected.length === 0
            ? <><em>오늘의</em> 숭실대 공지 요약</>
            : <>오늘의 숭실대 공지 <em>·</em> {items.length}건</>
          }
        </h3>
      </div>
      <div className="mail__body">
        <p className="mail__intro">
          {email ? <strong>{email.split('@')[0]}</strong> : '안녕하세요'}님, 오늘 새로 올라온 공지를 정리했습니다.
        </p>
        {selected.length === 0 ? (
          <div className="mail__empty">
            <span>✻</span>
            <p>카테고리를 선택하면<br />메일 미리보기가 채워집니다.</p>
          </div>
        ) : (
          Object.entries(byCat).map(([cat, list]) => (
            <div className="mail__section" key={cat}>
              <h4 className="mail__section-title">
                {cat}
                <span className="mail__section-count">{String(list.length).padStart(2, '0')}</span>
              </h4>
              <ul className="mail__list">
                {list.map((n, i) => (
                  <li className="mail__item" key={i}>
                    <span className="mail__item-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mail__item-title">{n.t}</span>
                    <span className="mail__item-meta">{n.d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <div className="mail__footer">
        숭실메일 (ssu-mail) — 숭실대학교 비공식 공지 메일링 · <a href="#">구독 해제</a>
      </div>
    </div>
  );
}

function SubscribeSection() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleCat = (v: string) => {
    setSelected(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    setError(null);
  };
  const selectAll = () =>
    setSelected(selected.length === CATEGORIES.length ? [] : CATEGORIES.map(c => c.value));

  const goBack = () => { setError(null); if (step > 1) setStep(step - 1); };
  const goStep = (n: number) => { if (n < step) { setError(null); setStep(n); } };

  const goNext = async () => {
    setError(null);
    if (step === 1) {
      if (selected.length === 0) { setError('구독할 카테고리를 1개 이상 골라주세요.'); return; }
      setStep(2);
    } else if (step === 2) {
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
        setStep(3);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }
    } else if (step === 3) {
      if (code.join('').length !== 6) { setError('6자리 인증번호를 모두 입력해주세요.'); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/subscriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), categories: selected, auth_code: code.join('') }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { detail?: string }).detail || '인증에 실패했거나 인증번호가 만료되었습니다.');
        }
        setStep(4);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }
    }
  };

  return (
    <section className="subscribe-page" id="subscribe-section">
      <div className="wrap">
        <div className="section__head">
          <div className="section__label">Subscribe</div>
          <h2 className="section__title">
            원하는 공지만,<br /><em>골라서 받으세요.</em>
          </h2>
        </div>

        <div className="sub-grid">
          <div>
            <Stepper step={step} onJump={goStep} />
            <div className="form-card">
              {step === 1 && <StepCategories selected={selected} toggleCat={toggleCat} selectAll={selectAll} />}
              {step === 2 && <StepEmail email={email} setEmail={setEmail} selectedCount={selected.length} />}
              {step === 3 && <StepCode email={email} code={code} setCode={setCode} onEditEmail={() => setStep(2)} />}
              {step === 4 && <StepDone email={email} count={selected.length} />}

              {error && <div className="field-error">{error}</div>}

              {step !== 4 && (
                <div className="actions">
                  <div className="actions__left">
                    {step > 1 && (
                      <button className="btn btn--ghost" onClick={goBack} disabled={loading}>
                        <Arrow flip /> 이전
                      </button>
                    )}
                  </div>
                  <button
                    className="btn btn--primary"
                    onClick={goNext}
                    disabled={loading || (step === 1 && selected.length === 0)}
                  >
                    {loading && '처리 중...'}
                    {!loading && step === 1 && '이메일 입력으로'}
                    {!loading && step === 2 && '인증번호 받기'}
                    {!loading && step === 3 && '구독 완료'}
                    {!loading && <Arrow />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="preview">
            <MailPreview selected={selected} email={email} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ──────────────────────────────────────────── */
function FAQ() {
  const qs = [
    {
      q: '유료인가요?',
      a: '아니요, 완전히 무료입니다. 광고도, 트래킹 픽셀도 없습니다. 학내 공지를 더 편하게 받아보자는 학생 사이드 프로젝트입니다.',
    },
    {
      q: '학교 공식 서비스인가요?',
      a: '아닙니다. 숭실대학교 홈페이지의 공개 공지를 수집해 정리해 드리며, 원문은 메일 안의 링크에서 항상 확인할 수 있습니다.',
    },
    {
      q: '어떻게 구독을 해제하나요?',
      a: '수신한 메일 하단의 구독 해제 링크를 누르면 즉시 해지됩니다. 별도 계정이 없으니 비밀번호도 필요하지 않습니다.',
    },
    {
      q: '어떤 정보를 수집하나요?',
      a: '이메일 주소와 선택한 카테고리만 저장합니다. 학번·비밀번호는 수집하지 않으며, 메일 발송 외의 용도로는 사용하지 않습니다.',
    },
  ];
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section__head">
          <div className="section__label">FAQ</div>
          <h2 className="section__title">자주 묻는 <em>질문들.</em></h2>
        </div>
        <div className="faq">
          {qs.map((it, i) => (
            <div className="faq__item" key={i}>
              <span className="faq__num">{String(i + 1).padStart(2, '0')}</span>
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
                <li><a href="#/subscribe">구독하기</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="foot__col">
              <h4 className="foot__col-title">Legal</h4>
              <ul>
                <li><a href="#">개인정보 처리방침</a></li>
                <li><a href="#">이용약관</a></li>
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

/* ───────── Pages ────────────────────────────────────────── */
function HomePage({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <>
      <Header />
      <Hero onSubscribe={onSubscribe} />
      <HowItWorks />
      <FAQ />
      <Footer />
    </>
  );
}

function SubscribePage() {
  return (
    <>
      <SubscribeHeader />
      <SubscribeSection />
    </>
  );
}

/* ───────── App ──────────────────────────────────────────── */
export default function App() {
  const unsubscribeToken = useMemo(
    () => new URLSearchParams(window.location.search).get('unsubscribe'),
    []
  );

  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = r === 'home' ? '/' : '/subscribe';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (unsubscribeToken) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <UnsubscribePage apiBase={API_BASE} token={unsubscribeToken} />
        </div>
      </div>
    );
  }

  if (route === 'subscribe') return <SubscribePage />;
  return <HomePage onSubscribe={() => navigate('subscribe')} />;
}
