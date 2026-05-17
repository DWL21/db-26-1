import { useState } from 'react';
import { CATEGORIES } from './categories';

interface Props {
  apiBase: string;
  categories: string[];
  onBack: () => void;
  onSuccess: () => void;
}

type Step = 'input' | 'verify';
type Msg = { type: 'success' | 'error' | 'info'; text: string } | null;

export default function EmailPage({ apiBase, categories, onBack, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('input');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const selectedLabels = CATEGORIES.filter(c => categories.includes(c.value));

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMsg({ type: 'error', text: '이메일을 입력해주세요.' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${apiBase}/auth/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || '인증번호 발송에 실패했습니다.');
      }
      setMsg({ type: 'info', text: '이메일로 6자리 인증번호를 발송했습니다. (스팸함도 확인해주세요)' });
      setStep('verify');
    } catch (e) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : '오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode.length !== 6) {
      setMsg({ type: 'error', text: '6자리 인증번호를 정확히 입력해주세요.' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${apiBase}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), categories, auth_code: authCode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || '인증에 실패했거나 인증번호가 만료되었습니다.');
      }
      onSuccess();
    } catch (e) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : '오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <button
          className="btn-back"
          onClick={() => {
            if (step === 'verify') {
              setStep('input');
              setAuthCode('');
              setMsg(null);
            } else {
              onBack();
            }
          }}
        >
          ← 뒤로
        </button>
        <div className="step-indicator">
          <span className="step done">✓</span>
          <span className="step-line done" />
          <span className="step active">2</span>
        </div>
      </div>

      <div className="glass-panel">
        <h2 className="page-title">
          {step === 'input' ? '이메일 주소를 입력하세요' : '인증번호를 입력하세요'}
        </h2>

        <div className="selected-cats-summary">
          <span className="summary-label">선택한 카테고리</span>
          <div className="summary-chips">
            {selectedLabels.map(cat => (
              <span key={cat.value} className="summary-chip">
                {cat.icon} {cat.label}
              </span>
            ))}
          </div>
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {step === 'input' ? (
          <form onSubmit={handleRequestCode}>
            <div className="form-group">
              <label htmlFor="email">이메일 주소</label>
              <input
                id="email"
                className="input-field"
                type="email"
                placeholder="student@soongsil.ac.kr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '인증번호 받기'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="verify-meta">
              <p>수신 이메일: <strong>{email}</strong></p>
              <p style={{ margin: 0 }}>받은 6자리 인증번호를 입력해주세요.</p>
            </div>
            <div className="form-group">
              <label htmlFor="code">인증번호</label>
              <input
                id="code"
                className="input-field input-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={authCode}
                onChange={e => setAuthCode(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={loading}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '구독 완료'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
