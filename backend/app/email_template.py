from datetime import date
from app.config import settings

_BADGE_BASE = (
    "display:inline-block;width:70px;padding:4px 0;font-size:12px;"
    "text-align:center;border-radius:3px;white-space:nowrap;overflow:hidden;"
    "text-overflow:ellipsis;box-sizing:border-box;"
)


def _status_style(status: str) -> str:
    if status == "진행":
        return _BADGE_BASE + "font-weight:600;color:#fff;background-color:#4ec6c1;"
    if status == "마감":
        return _BADGE_BASE + "font-weight:600;color:#fff;background-color:#e74c3c;"
    return ""


def _category_style() -> str:
    return _BADGE_BASE + "color:#888;border:1px solid #ccc;"


def _render_notice_row(notice: dict) -> str:
    status_html = (
        f'<span style="{_status_style(notice["status"])}">{notice["status"]}</span>'
        if notice.get("status")
        else ""
    )

    category_html = (
        f'<span style="{_category_style()}">{notice["category"]}</span>'
        if notice.get("category")
        else ""
    )

    link = notice.get("link", "#")
    if link and not link.startswith("http"):
        link = f"https://scatch.ssu.ac.kr{link}"

    return f"""
    <tr style="border-bottom:1px solid #f0f0f0;height:52px;">
      <td style="padding:0 8px;height:52px;vertical-align:middle;text-align:center;">
        {status_html}
      </td>
      <td style="padding:0 8px;height:52px;vertical-align:middle;text-align:center;">
        {category_html}
      </td>
      <td style="padding:0 8px;height:52px;vertical-align:middle;">
        <a href="{link}" style="color:#333;text-decoration:none;font-size:14px;">{notice["title"]}</a>
      </td>
      <td style="padding:0 8px;height:52px;vertical-align:middle;text-align:left;color:#999;font-size:13px;">
        {notice.get("department", "")}
      </td>
    </tr>"""


def build_email_html(notices: list[dict], target_date: date | None = None, unsub_token: str | None = None, welcome: bool = False) -> str:
    """공지사항 목록을 HTML 이메일 본문으로 변환한다.

    Args:
        notices: 크롤러에서 가져온 공지사항 딕셔너리 리스트.
        target_date: 메일 상단에 표시할 날짜. None이면 오늘 날짜.
    """
    if target_date is None:
        target_date = date.today()

    display_date = target_date.strftime("%Y.%m.%d")
    count=len(notices)
    
    grouped_notices={}

    for notice in notices:
        category=notice.get("category","기타");

        if not category:
            category="기타"

        if category not in grouped_notices:
            grouped_notices[category]=[]

        grouped_notices[category].append(notice)

    rows_html = ""

    for category, items in grouped_notices.items():

        rows_html += f"""
        <tr>
          <td style="padding:18px 4px 10px;font-size:16px;font-weight:700;color:#333;">
            {category}
          </td>
        </tr>
        """
        for notice in items:
            rows_html += _render_notice_row(notice)

    welcome_html = ""
    if welcome:
        welcome_html = """
          <tr>
            <td style="background-color:#eaf7f6;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;padding:18px 20px;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#2e8c87;">
                구독해주셔서 감사합니다! 🎉
              </p>
              <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">
                구독 시점 기준 최근 3일간의 공지사항을 먼저 보내드립니다.<br>
                내일부터는 매일 아침 08:00에 새 공지가 도착합니다.
              </p>
            </td>
          </tr>"""

    unsub_html = ""

    if unsub_token:
        unsub_url = f"{settings.frontend_origin}?unsubscribe={unsub_token}"
        unsub_html = f"""
          <tr>
            <td style="padding:8px 0 0;text-align:center;">
              <a href="{unsub_url}" style="font-size:11px;color:#bbb;text-decoration:underline;">
                구독 해지
              </a>
            </td>
          </tr>"""
    return f"""\
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>숭실대학교 공지사항 - {display_date}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:16px 12px;">

        <table role="presentation" cellpadding="0" cellspacing="0"
               style="width:100%;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background-color:#4ec6c1;border-radius:8px 8px 0 0;padding:20px 20px;">
              <h1 style="margin:0;font-size:18px;font-weight:700;color:#fff;">
                숭실대학교 공지사항
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">
                {display_date} · 새 공지 {count}건
              </p>
            </td>
          </tr>

          {welcome_html}

          <!-- Body -->
          <tr>
            <td style="background-color:#f9fafb;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;padding:12px 12px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                {rows_html}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 8px 8px;padding:16px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;">
                    <a href="https://scatch.ssu.ac.kr/%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad/"
                       style="display:inline-block;padding:10px 24px;font-size:13px;font-weight:600;color:#4ec6c1;border:1px solid #4ec6c1;border-radius:4px;text-decoration:none;">
                      전체 공지사항 보기
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#bbb;">
                      본 메일은 숭실대학교 공지사항 구독 서비스에 의해 자동 발송되었습니다.
                    </p>
                  </td>
                </tr>
                {unsub_html}
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>"""
