interface Props {
  onStart: () => void;
}

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="page-landing">
      <div className="landing-card glass-panel">
        <div className="landing-badge">숭실대학교</div>

        <h1 className="landing-title">
          공지사항을<br />이메일로 받아보세요
        </h1>
        <p className="landing-subtitle">
          매일 아침 8시, 원하는 카테고리의 새 공지만<br />
          깔끔하게 정리해서 보내드립니다.
        </p>

        <button className="btn-cta" onClick={onStart}>
          구독 시작하기
          <span className="btn-cta-arrow">→</span>
        </button>

        <ul className="landing-features">
          <li><span className="feature-check">✓</span> scatch.ssu.ac.kr 공지 매일 자동 수집</li>
          <li><span className="feature-check">✓</span> 11가지 카테고리 중 원하는 것만 선택</li>
          <li><span className="feature-check">✓</span> 메일 하단 링크 한 번으로 구독 해지</li>
        </ul>
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
