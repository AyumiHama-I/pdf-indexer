import pdfplumber
from fastapi import FastAPI, UploadFile, File
from typing import List
import shutil
import os
from extractor import extract_date, extract_amount, extract_tel
from matcher import load_master, find_company_by_tel
from fastapi.responses import FileResponse
from builder import build_zip_and_csv
from pydantic import BaseModel

class ConfirmedItem(BaseModel):
    original_name: str
    date: str
    company: str
    amount: str

app = FastAPI()

TMP_DIR = "tmp"

# 起動時にmaster.csvを読み込む
master = load_master()

@app.post("/confirm")
async def confirm(items: List[ConfirmedItem]):
    confirmed_list = [item.dict() for item in items]
    zip_path, csv_path = build_zip_and_csv(confirmed_list)
    return {
        "zip_url": "/download/result.zip",
        "csv_url": "/download/result.csv",
    }

@app.get("/preview/{filename}")
async def preview_pdf(filename: str):
    tmp_path = os.path.join(TMP_DIR, filename)
    return FileResponse(tmp_path, media_type="application/pdf")

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

        # 電話番号でmaster.csvと照合して会社名を解決
        company = find_company_by_tel(tel, master) if tel else None

        results.append({
            "original_name": file.filename,
            "date": date,
            "company": company,
            "amount": amount,
        })

    return results