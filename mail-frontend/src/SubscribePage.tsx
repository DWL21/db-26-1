import { useState, useMemo, useEffect, useRef } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8001';

// 백엔드 없이 UI 흐름 확인용 데모 모드
const DEMO_MODE = !import.meta.env.VITE_API_BASE;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

const SAMPLE: Record<string, { title: string; status: string }[]> = {
  '학사':         [{ title: '2026학년도 1학기 수강신청 일정 안내', status: '진행' }, { title: '성적 정정 기간 및 절차 공고', status: '진행' }],
  '장학':         [{ title: '2026-1 국가장학금 2차 신청 마감 (~5/20)', status: '마감' }, { title: '교내 우수장학생 추천 모집', status: '진행' }],
  '국제교류':     [{ title: '2026 봄학기 교환학생 모집 공고', status: '진행' }],
  '외국인유학생': [{ title: '외국인 유학생 비자 연장 안내', status: '진행' }],
  '채용':         [{ title: '삼성전자 DS부문 신입 채용설명회 (5/22)', status: '진행' }, { title: '현대자동차 R&D 인턴 모집 공고', status: '진행' }],
  '비교과·행사':  [{ title: '총장 초청 봄 콘서트 (5/24)', status: '진행' }, { title: '독서마라톤 5월 챌린지 시작', status: '진행' }],
  '교원채용':     [{ title: '2026학년도 1학기 전임교원 공개채용 공고', status: '진행' }],
  '교직':         [{ title: '교원자격증 발급 신청 안내', status: '진행' }],
  '봉사':         [{ title: '1365 자원봉사 정기 활동 모집', status: '진행' }, { title: '지역 아동센터 학습 멘토링 봉사자 모집', status: '진행' }],
  '기타':         [{ title: '학내 셔틀버스 운행 시간표 변경', status: '진행' }],
};

const CONFETTI_COLORS = ['#4d8ef0', '#014099', '#f5c518', '#22c55e', '#f87171', '#a78bfa', '#38bdf8', '#fb923c'];

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
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 6,
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
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
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

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}
    />
  );
}

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

function nextEight() {
  const now = new Date();
  const t = new Date();
  t.setHours(8, 0, 0, 0);
  if (now >= t) t.setDate(t.getDate() + 1);
  const ms = t.getTime() - now.getTime();
  return `${Math.floor(ms / 3600000)}시간 ${Math.floor((ms % 3600000) / 60000)}분`;
}

type Step = 1 | 2 | 3 | 4;

const STEP_INFO: Record<number, { label: string; title: string; desc: string }> = {
  1: { label: 'STEP 01', title: '이메일 입력', desc: '매일 08:00에 이 주소로 발송됩니다.' },
  2: { label: 'STEP 02', title: '인증번호 확인', desc: '메일로 받은 6자리 코드를 입력해주세요.' },
  3: { label: 'STEP 03', title: '카테고리 선택', desc: '받고 싶은 공지 유형을 골라주세요.' },
};
const STEP_INFO_EXISTING: Partial<typeof STEP_INFO> = {
  3: { label: 'STEP 03', title: '구독 수정', desc: '카테고리를 수정하거나 전체 해지할 수 있습니다.' },
};

function NoticePreview({ selected }: { selected: string[] }) {
  const items = useMemo(
    () => selected.flatMap(cat => (SAMPLE[cat] ?? []).map(n => ({ ...n, cat }))),
    [selected]
  );

  if (selected.length === 0) return null;

  return (
    <div className="preview-box">
      <div className="preview-box__head">
        <span className="preview-box__label">미리보기</span>
        <span className="preview-box__sub">오늘 이런 공지가 왔을 거예요 ({items.length}건)</span>
      </div>
      <div className="preview-box__list">
        {items.slice(0, 5).map((n, i) => (
          <div className="preview-box__item" key={i}>
            <div className="preview-box__tags">
              <span className="preview-box__cat">{n.cat}</span>
              <span className={`preview-box__status ${n.status === '마감' ? 'preview-box__status--closed' : ''}`}>
                {n.status}
              </span>
            </div>
            <div className="preview-box__title">{n.title}</div>
          </div>
        ))}
        {items.length > 5 && (
          <div className="preview-box__more">+ {items.length - 5}건 더</div>
        )}
      </div>
    </div>
  );
}

export default function SubscribePage({ isDark, onToggleTheme }: { isDark?: boolean; onToggleTheme?: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (v: string) => {
    setSelected(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
    setError(null);
  };
  const selectAll = () =>
    setSelected(selected.length === CATEGORIES.length ? [] : CATEGORIES.map(c => c.value));

  const next = async () => {
    setError(null);
    if (step === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('올바른 이메일 형식이 아닙니다.'); return;
      }
      setLoading(true);
      try {
        if (DEMO_MODE) {
          await sleep(1000);
        } else {
          const res = await fetch(`${API_BASE}/auth/request-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim() }),
          });
          if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            throw new Error((e as { detail?: string }).detail || '인증번호 발송 실패');
          }
        }
        setStep(2);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }
    } else if (step === 2) {
      if (code.length !== 6) { setError('6자리 인증번호를 입력해주세요.'); return; }
      setLoading(true);
      try {
        if (DEMO_MODE) {
          await sleep(1200);
          setMode('new');
        } else {
          const res = await fetch(
            `${API_BASE}/subscriptions/me?email=${encodeURIComponent(email.trim())}&auth_code=${encodeURIComponent(code)}`,
          );
          if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            throw new Error((e as { detail?: string }).detail || '인증 실패');
          }
          const data = await res.json();
          if (data.is_registered) {
            setMode('existing');
            setSelected(data.subscribed_categories);
          } else {
            setMode('new');
          }
        }
        setStep(3);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }
    } else if (step === 3) {
      if (!selected.length) { setError('카테고리를 1개 이상 선택해주세요.'); return; }
      setLoading(true);
      try {
        if (DEMO_MODE) {
          await sleep(1000);
        } else {
          const res = await fetch(`${API_BASE}/subscriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), categories: selected, auth_code: code }),
          });
          if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            throw new Error((e as { detail?: string }).detail || '처리 실패');
          }
        }
        setStep(4);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
      } finally { setLoading(false); }
    }
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm('구독을 전체 해지하시겠습니까?')) return;
    setError(null);
    setLoading(true);
    try {
      if (DEMO_MODE) {
        await sleep(1000);
      } else {
        const res = await fetch(`${API_BASE}/subscriptions/me`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), auth_code: code }),
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error((e as { detail?: string }).detail || '해지 실패');
        }
      }
      setUnsubscribed(true);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally { setLoading(false); }
  };

  const stepInfo = (mode === 'existing' && step === 3 ? STEP_INFO_EXISTING[3] : null) ?? STEP_INFO[step];

  return (
    <div className="sub-wrap">
      <div className="sub-nav">
        <a className="sub-nav__logo" href="#">SSU<em>메일</em></a>
        <div className="sub-nav__right">
          <button className="nav__theme" onClick={onToggleTheme} title="테마 전환">
            {isDark ? '☀️' : '🌙'}
          </button>
          <a className="sub-nav__back" href="#">← 홈으로</a>
        </div>
      </div>

      <div className="sub-body">
        <div className="sub-card">
          {step !== 4 && (
            <>
              <div className="sub-card__step">{stepInfo.label}</div>
              <h1 className="sub-card__title">{stepInfo.title}</h1>
              <p className="sub-card__desc">{stepInfo.desc}</p>
              <div className="prog">
                {[1, 2, 3].map(n => (
                  <div key={n} className={`prog__dot ${step === n ? 'prog__dot--active' : step > n ? 'prog__dot--done' : ''}`} />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <div className="inp-wrap">
              <label className="inp-label" htmlFor="emailInp">이메일 주소</label>
              <input
                id="emailInp" className="inp" type="email"
                placeholder="20261234@soongsil.ac.kr"
                value={email} onChange={e => setEmail(e.target.value)}
                autoFocus autoComplete="email"
              />
              <div className="inp-hint">학교 메일·개인 메일 모두 가능합니다.</div>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="recap">
                <span className="recap__email">{email}</span>
                <button className="recap__edit" onClick={() => { setError(null); setStep(1); }}>변경</button>
              </div>
              <div className="inp-wrap">
                <label className="inp-label" htmlFor="codeInp">인증번호 6자리</label>
                <input
                  id="codeInp" className="inp" type="text" inputMode="numeric"
                  maxLength={6} placeholder="000000" value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus autoComplete="one-time-code"
                />
                <div className="inp-hint">인증번호는 10분간 유효합니다.</div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {mode === 'existing' && (
                <div className="recap" style={{ marginBottom: '0.75rem' }}>
                  <span className="recap__email">{email}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success, #22c55e)', fontWeight: 600 }}>기존 구독 중</span>
                </div>
              )}
              <div className="cat-meta">
                <span className="cat-meta__count"><span>{selected.length}</span> / {CATEGORIES.length}</span>
                <button className="cat-meta__all" onClick={selectAll}>
                  {selected.length === CATEGORIES.length ? '전체 해제' : '전체 선택'}
                </button>
              </div>
              <div className="cat-list">
                {CATEGORIES.map(c => {
                  const on = selected.includes(c.value);
                  return (
                    <button key={c.value} className={`cat-row ${on ? 'cat-row--on' : ''}`} onClick={() => toggle(c.value)}>
                      <div className="cat-row__box">
                        <svg className="cat-row__box-check" width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5.2L4 7.2L8 3" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="cat-row__name">{c.value}</div>
                        <div className="cat-row__hint">{c.hint}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <NoticePreview selected={selected} />
              {mode === 'existing' && (
                <button className="btn-unsub" onClick={handleUnsubscribe} disabled={loading}>
                  구독 전체 해지
                </button>
              )}
            </>
          )}

          {step === 4 && <Confetti />}

          {step === 4 && (
            <div className="done">
              <span className="done__icon">{unsubscribed ? '👋' : '✦'}</span>
              <h2 className="done__title">
                {unsubscribed ? '구독 해지 완료' : mode === 'existing' ? '구독 수정 완료' : '구독 완료'}
              </h2>
              <p className="done__desc">
                {unsubscribed
                  ? <>{email}의 구독이 해지되었습니다.</>
                  : <>내일 아침 08:00부터<br /><strong>{email}</strong>로 공지를 보내드립니다.</>
                }
              </p>
              {!unsubscribed && <div className="done__badge">⏰ 첫 메일까지 약 {nextEight()}</div>}
              <br />
              <a href="#" className="btn-home">홈으로 돌아가기</a>
            </div>
          )}

          {error && <div className="err">{error}</div>}

          {step !== 4 && (
            <div className="actions">
              {step > 1 && (
                <button className="btn-prev" onClick={() => { setError(null); setStep((step - 1) as Step); }} disabled={loading}>
                  ← 이전
                </button>
              )}
              <button className="btn-go" onClick={next}
                disabled={loading || (step === 3 && selected.length === 0)}>
                {loading
                  ? <><Spinner /> 처리 중</>
                  : step === 1 ? '인증번호 받기 →'
                  : step === 2 ? '확인 →'
                  : mode === 'existing' ? '수정 완료 →' : '구독 완료 →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
