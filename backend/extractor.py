import re


def extract_date(text: str) -> str:
    # 優先: キーワードの近くの日付を先に探す
    priority_keywords = [
        r"伝票日付[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"請求日[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"発行日[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"日付[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"伝票日付[：:\s]*(\d{2})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"通知日[：:\s]*(\d{4})年(\d{1,2})月(\d{1,2})日",
    ]
    for pattern in priority_keywords:
        match = re.search(pattern, text)
        if match:
            year = match.group(1)
            if len(year) == 2:
                year = str(2000 + int(year))
            month = match.group(2).zfill(2)
            day = match.group(3).zfill(2)
            return f"{year}{month}{day}"

    # 通常パターン
    patterns = [
        r"(?<!\d)([1-9]\d{3})\s*[/\-年]\s*(\d{1,2})\s*[/\-月]\s*(\d{1,2})",
        r"(?<!\d)([1-9]\d{3})\.\s*(\d{1,2})\.\s*(\d{1,2})",
        r"令和(\d+)年(\d{1,2})月(\d{1,2})日",
        r"(?<!\d)([1-9]\d{3})[\s　]+(\d{1,2})[\s　]+(\d{1,2})(?!\d)",  # スペース区切り
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            if "令和" in pattern:
                year = 2018 + int(match.group(1))
                month = match.group(2).zfill(2)
                day = match.group(3).zfill(2)
            else:
                year = match.group(1)
                month = match.group(2).zfill(2)
                day = match.group(3).zfill(2)
            return f"{year}{month}{day}"
    return None
