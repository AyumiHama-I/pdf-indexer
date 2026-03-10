import pdfplumber
from fastapi import FastAPI, UploadFile, File
from typing import List
import shutil
import os
import logging

from extractor import extract_date, extract_amount, extract_tel
from matcher import load_master, find_company_by_tel
from fastapi.responses import FileResponse
from builder import build_zip_and_csv
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class ConfirmedItem(BaseModel):
    original_name: str
    date: str
    company: str
    amount: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:3000",
        "https://pdf-indexer-beta.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


TMP_DIR = "tmp"
os.makedirs(TMP_DIR, exist_ok=True)

# 起動時にmaster.csvを読み込む
master = load_master()

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(TMP_DIR, filename)
    
    if not os.path.exists(file_path):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="ファイルが見つかりません")
    
    # ZIPとCSV両方ダウンロードされたら削除する
    def cleanup():
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"削除: {file_path}")

    zip_path = os.path.join(TMP_DIR, "result.zip")
    csv_path = os.path.join(TMP_DIR, "result.csv")
    if not os.path.exists(zip_path) and not os.path.exists(csv_path):
        for f in os.listdir(TMP_DIR):
            os.remove(os.path.join(TMP_DIR, f))
            print(f"全削除: {f}")
    
    from starlette.background import BackgroundTask
    return FileResponse(
        file_path,
        filename=filename,
        background=BackgroundTask(cleanup)
    )
    
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
        tel_list = extract_tel(text)

        # 電話番号でmaster.csvと照合して会社名を解決
        company = find_company_by_tel(tel_list, master) if tel_list else None
        
        results.append({
            "original_name": file.filename,
            "date": date,
            "company": company,
            "amount": amount,
        })

    return results