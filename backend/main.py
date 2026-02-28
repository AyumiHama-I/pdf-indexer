import pdfplumber
from fastapi import FastAPI, UploadFile, File
from typing import List
import shutil
import os
from extractor import extract_date, extract_amount, extract_tel

app = FastAPI()

TMP_DIR = "tmp"

@app.post("/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    results = []

    for file in files:
        # tmp/にPDFを一時保存
        tmp_path = os.path.join(TMP_DIR, file.filename)
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # pdfplumberでテキスト抽出
        text = ""
        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""

        # 抽出したテキストから日付・金額・電話番号を取得
        date = extract_date(text)
        amount = extract_amount(text)
        tel = extract_tel(text)

        results.append({
            "original_name": file.filename,
            "date": date,
            "company": None,  # 次のステップで埋める
            "amount": amount,
            "tel": tel,       # 確認用、master.csv照合後に消す
        })

    return results