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
    # 優先順位1: 「合計金額」「請求合計」「合計」の近くの数字
    priority_patterns = [
        r'合計金額[^\d]*(\d{1,3}(?:,\d{3})+)',
        r'請求合計[^\d]*(\d{1,3}(?:,\d{3})+)',
        r'項合計[^\d]*(\d{1,3}(?:,\d{3})+)',
        r'合計[^\d]*(\d{1,3}(?:,\d{3})+)',
        r'合\s*計\s*金\s*額[^\d]*(\d{1,3}(?:,\d{3})+)', 
        r'合\s*計\s[^\d]*(\d{1,3}(?:,\d{3})+)',
    ]
    for pattern in priority_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).replace(",", "")

    # 優先順位2: ¥・￥の後の数字の中で一番大きいもの
    yen_pattern = r'[¥￥\\](\d{1,3}(?:,\d{3})+)'
    yen_matches = re.findall(yen_pattern, text)
    if yen_matches:
        return max(yen_matches, key=lambda x: int(x.replace(",", ""))).replace(",", "")

    # 優先順位3: 末尾に「円」がついた数字の中で一番大きいもの
    en_pattern = r'(\d{1,3}(?:,\d{3})+)円'
    en_matches = re.findall(en_pattern, text)
    if en_matches:
        return max(en_matches, key=lambda x: int(x.replace(",", ""))).replace(",", "")

    return None

def extract_tel(text: str) -> list:
    # 全ての電話番号をリストで返す
    pattern = r'\d{2,4}-\d{2,4}-\d{3,4}'
    return re.findall(pattern, text)
    # re.findall は「全部見つける」関数です（re.searchは最初の1つだけ）