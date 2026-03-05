import csv
import os

MASTER_PATH = os.path.join(os.path.dirname(__file__), "data", "master.csv")

def load_master() -> list:
    # master.csvを読み込んでリストとして返す
    if not os.path.exists(MASTER_PATH):
        return []
    with open(MASTER_PATH, encoding="utf-8") as f:
        return list(csv.DictReader(f))

def find_company_by_tel(tel: str, master: list) -> str:
    # 電話番号でmaster.csvを検索して会社名を返す
    for row in master:
        if row["tel"] == tel:
            return row["name"]
    return None