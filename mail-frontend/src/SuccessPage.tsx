interface Props {
  onReset: () => void;
}

export default function SuccessPage({ onReset }: Props) {
  return (
    <div className="page-landing">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <div className="success-icon">🎉</div>
        <h2 className="page-title">구독 완료!</h2>
        <p className="page-subtitle">
          내일 아침 8시(KST)부터 메일을 받아보실 수 있어요.<br />
          이 창은 닫으셔도 됩니다.
        </p>
        <button className="btn-link" onClick={onReset} style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          ← 처음으로 돌아가기
        </button>
      </div>
      <p className="brand-footer">
        채플 출결 조회는{' '}
        <a
          href="https://ssu-chapel.pages.dev/?utm_source=ssu-mails&utm_campaign=cross_link"
          target="_blank"
          rel="noreferrer"
        >
          ssu-chapel.pages.dev
        </a>
        에서
      </p>
    </div>
  );
}
