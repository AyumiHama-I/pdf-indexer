import re


def extract_date(text: str) -> str:
    # 優先: 「伝票日付」「請求日」「発行日」「日付」キーワードの近くの日付を先に探す
    print("=== pattern results ===")
    patterns_debug = [
        r"(?<!\d)([1-9]\d{3})\s*[/\-年]\s*(\d{1,2})\s*[/\-月]\s*(\d{1,2})",
        r"(?<!\d)([1-9]\d{3})\.\s*(\d{1,2})\.\s*(\d{1,2})",
        r"令和(\d+)年(\d{1,2})月(\d{1,2})日",
        r"(?<!\d)([1-9]\d{3})[\s　]+(\d{1,2})[\s　]+(\d{1,2})(?!\d)",
    ]
    for p in patterns_debug:
        m = re.search(p, text)
        print(f"パターン: {p[:30]}... → {m.group() if m else 'なし'}")
    print("======================")
    priority_keywords = [
        r"伝票日付[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"請求日[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"発行日[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"日付[：:\s]*(\d{4})[年/\-](\d{1,2})[月/\-](\d{1,2})",
        r"伝票日付[：:\s]*(\d{2})[年/\-](\d{1,2})[月/\-](\d{1,2})",  # 25/09/02形式
        r"通知日[：:\s]*(\d{4})年(\d{1,2})月(\d{1,2})日",
    ]
    for pattern in priority_keywords:
        match = re.search(pattern, text)
        if match:
            year = match.group(1)
            # 2桁年（25など）は2000を足して4桁にする
            if len(year) == 2:
                year = str(2000 + int(year))
            month = match.group(2).zfill(2)
            day = match.group(3).zfill(2)
            return f"{year}{month}{day}"

    # 通常パターン（従来通り）
    patterns = [
        r"(?<!\d)([1-9]\d{3})\s*[/\-年]\s*(\d{1,2})\s*[/\-月]\s*(\d{1,2})",
        r"(\d{4})\s*[/\-年]\s*(\d{1,2})\s*[/\-月]\s*(\d{1,2})",
        r"(\d{4})[/\-年](\d{1,2})[/\-月](\d{1,2})",
        r"(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})",
        r"令和(\d+)年(\d{1,2})月(\d{1,2})日",
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


def extract_amount(text: str) -> str:
    # 税込金額合計は次の行の最大値を取る特別処理
    match = re.search(r"税込金額合計\n(.*)", text)
    if match:
        nums = re.findall(r"\d{1,3}(?:,\d{3})+", match.group(1))
        if nums:
            return max(nums, key=lambda x: int(x.replace(",", ""))).replace(",", "")

    # 優先順位1: 「合計金額」「請求合計」「合計」の近くの数字
    priority_patterns = [
        r"税込合計[^\d]*(\d{1,3}(?:,\d{3})+)",
        r"合計金額[^\d]*(\d{1,3}(?:,\d{3})+)",
        r"請求合計[^\d]*(\d{1,3}(?:,\d{3})+)",
        r"項合計[^\d]*(\d{1,3}(?:,\d{3})+)",
        r"合計[^\d]*(\d{1,3}(?:,\d{3})+)",
        r"合\s*計\s*金\s*額[^\d]*(\d{1,3}(?:,\d{3})+)",
        r"合\s*計\s[^\d]*(\d{1,3}(?:,\d{3})+)",
    ]
    for pattern in priority_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).replace(",", "")

    # 優先順位2: ¥・￥の後の数字の中で一番大きいもの
    yen_pattern = r"[¥￥\\](\d{1,3}(?:,\d{3})+)"
    yen_matches = re.findall(yen_pattern, text)
    if yen_matches:
        return max(yen_matches, key=lambda x: int(x.replace(",", ""))).replace(",", "")

    # 優先順位3: 末尾に「円」がついた数字の中で一番大きいもの
    en_pattern = r"(\d{1,3}(?:,\d{3})+)円"
    en_matches = re.findall(en_pattern, text)
    if en_matches:
        return max(en_matches, key=lambda x: int(x.replace(",", ""))).replace(",", "")

    # 優先順位の最後に追加：テキスト末尾の数字を返す
    all_amounts = re.findall(r"\d{1,3}(?:,\d{3})+", text)
    if all_amounts:
        return all_amounts[-1].replace(",", "")

    return None


def extract_tel(text: str) -> list:
    # 全ての電話番号をリストで返す
    pattern = r"\d{2,4}-\d{2,4}-\d{3,4}"
    return re.findall(pattern, text)
    # re.findall は「全部見つける」関数です（re.searchは最初の1つだけ）
