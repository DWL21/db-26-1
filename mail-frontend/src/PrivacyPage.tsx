export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="wrap legal-page__wrap">
        <a className="legal-page__back" href="#/">← 홈으로</a>

        <div className="legal-page__head">
          <div className="legal-page__label">Privacy Policy</div>
          <h1 className="legal-page__title">개인정보 처리방침</h1>
          <p className="legal-page__date">시행일: 2026년 5월 17일</p>
        </div>

        <div className="legal-page__body">
          <p>
            숭실메일(이하 "서비스")은 숭실대학교 공지사항 이메일 구독 서비스입니다.
            본 방침은 서비스 이용 과정에서 수집·이용하는 개인정보에 관한 사항을 안내합니다.
          </p>

          <h2>1. 수집하는 개인정보 항목</h2>
          <p>서비스는 다음 정보만 수집합니다.</p>
          <ul>
            <li>이메일 주소</li>
            <li>구독 카테고리 선택 정보</li>
          </ul>
          <p>학번·비밀번호·이름 등 그 외의 정보는 수집하지 않습니다.</p>

          <h2>2. 개인정보의 수집 및 이용 목적</h2>
          <p>수집한 정보는 오직 다음 목적으로만 사용합니다.</p>
          <ul>
            <li>매일 08:00 공지사항 이메일 발송</li>
            <li>인증번호 발송(구독 시 1회)</li>
          </ul>
          <p>위 목적 이외의 용도로는 사용하지 않습니다.</p>

          <h2>3. 개인정보의 보유 및 이용 기간</h2>
          <p>
            구독 해지 시 즉시 삭제합니다. 구독 해지는 수신한 모든 메일 하단의
            '구독 해지' 링크를 통해 언제든지 가능합니다.
          </p>

          <h2>4. 개인정보의 제3자 제공</h2>
          <p>수집한 개인정보를 제3자에게 제공하지 않습니다.</p>

          <h2>5. 개인정보 처리 위탁</h2>
          <p>
            이메일 발송을 위해 아래 외부 서비스를 이용합니다. 해당 업체는
            이메일 발송 목적 이외에 개인정보를 처리하지 않습니다.
          </p>
          <ul>
            <li>이메일 발송 인프라: 자체 서버(ssu-mail-api.simplyimg.com)</li>
          </ul>

          <h2>6. 이용자의 권리</h2>
          <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
          <ul>
            <li>
              <strong>구독 해지 및 정보 삭제</strong>: 메일 하단 '구독 해지' 링크 클릭 즉시 처리
            </li>
            <li>
              <strong>문의</strong>: 아래 이메일로 요청하면 지체 없이 처리합니다.
            </li>
          </ul>

          <h2>7. 개인정보 보호책임자</h2>
          <table className="legal-page__table">
            <tbody>
              <tr><td>이메일</td><td>leopold.urssu@gmail.com</td></tr>
              <tr><td>처리 기간</td><td>요청일로부터 3일 이내</td></tr>
            </tbody>
          </table>

          <h2>8. 방침의 변경</h2>
          <p>
            방침 변경 시 서비스 내 공지 또는 이메일로 7일 전 안내합니다.
            변경된 방침은 공지된 시행일부터 효력이 발생합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
