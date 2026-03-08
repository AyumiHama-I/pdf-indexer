import re

def extract_date(text: str) -> str:
    # 例: 2026/02/01, 2026-02-01, 2026年02月01日, 令和8年2月1日
    patterns = [
        r'(\d{4})[/\-年](\d{1,2})[/\-月](\d{1,2})',
        r'令和(\d+)年(\d{1,2})月(\d{1,2})日',
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            if '令和' in pattern:
                year = 2018 + int(match.group(1))
                month = match.group(2).zfill(2)
                day = match.group(3).zfill(2)
            else:
                year = match.group(1)
                month = match.group(2).zfill(2)
                # zfill(2)は「1桁の数字を2桁にする」メソッドです 例: "2" → "02"
                day = match.group(3).zfill(2)
            return f"{year}{month}{day}"
    return None

def extract_amount(text: str) -> str:
    # 例: ¥110,000, 110,000円, 合計 110,000
    patterns = [
        r'[¥￥](\d{1,3}(?:,\d{3})+)',
        r'(\d{1,3}(?:,\d{3})+)円',
        r'合計[^\d]*(\d{1,3}(?:,\d{3})+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            # カンマを除去して数字だけにする
            return match.group(1).replace(",", "")
    return None

def extract_tel(text: str) -> list:
    # 全ての電話番号をリストで返す
    pattern = r'\d{2,4}-\d{2,4}-\d{3,4}'
    return re.findall(pattern, text)
    # re.findall は「全部見つける」関数です（re.searchは最初の1つだけ）