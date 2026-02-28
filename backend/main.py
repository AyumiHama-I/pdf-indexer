import pdfplumber
from fastapi import FastAPI, UploadFile, File
from typing import List
import shutil
import os

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

        results.append({
            "original_name": file.filename,
            "date": None,
            "company": None,
            "amount": None,
            "extracted_text": text  # 確認用、後で消す
        })

    return results