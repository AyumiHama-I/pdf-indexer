import os
import json


def load_master() -> list:
    # 環境変数からmaster dataを読み込む
    master_data = os.environ.get("MASTER_DATA")
    if not master_data:
        return []
    return json.loads(master_data)


def find_company_by_tel(tel_list: list, master: list) -> str:
    # 電話番号リストを順番にmasterと照合
    for tel in tel_list:
        for row in master:
            if row["tel"] == tel:
                return row["name"]
    return None
