import os
import shutil
import zipfile
import csv

TMP_DIR = "tmp"
OUTPUT_DIR = "tmp"

def build_zip_and_csv(confirmed_items: list) -> tuple:
    zip_path = os.path.join(OUTPUT_DIR, "result.zip")
    csv_path = os.path.join(OUTPUT_DIR, "result.csv")

    # ZIPファイルを作成
    with zipfile.ZipFile(zip_path, "w") as zf:
        for item in confirmed_items:
            # 新しいファイル名を生成
            new_name = f"{item['date']}_{item['company']}_{item['amount']}.pdf"
            original_path = os.path.join(TMP_DIR, item["original_name"])

            # ZIPに追加（新しいファイル名で）
            zf.write(original_path, arcname=new_name)

    # CSVファイルを作成
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        # utf-8-sig はExcelで開いたときに文字化けしないようにするためのおまじない
        writer = csv.DictWriter(f, fieldnames=["ファイル名", "日付", "会社名", "金額"])
        writer.writeheader()
        for item in confirmed_items:
            new_name = f"{item['date']}_{item['company']}_{item['amount']}.pdf"
            writer.writerow({
                "ファイル名": new_name,
                "日付": item["date"],
                "会社名": item["company"],
                "金額": item["amount"],
            })

    return zip_path, csv_path