import csv
import os

MASTER_PATH = os.path.join(os.path.dirname(__file__), "data", "master.csv")

def load_master() -> list:
    # master.csvを読み込んでリストとして返す
    if not os.path.exists(MASTER_PATH):
        return []
    with open(MASTER_PATH, encoding="utf-8") as f:
        return list(csv.DictReader(f))

def find_company_by_tel(tel_list: list, master: list) -> str:
    # 電話番号リストを順番にmaster.csvと照合
    for tel in tel_list:
        for row in master:
            if row["tel"] == tel:
                return row["name"]
    return None