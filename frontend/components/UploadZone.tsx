import { useState } from "react"

type PdfItem = {
  original_name: string
  date: string | null
  company: string | null
  amount: string | null
  page_count: number
}

type Props = {
  onUploaded: (items: PdfItem[], files: File[]) => void
}

// PDFアイコン（SVG）
const PdfIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5 5h4M5 7.5h4M5 10h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export default function UploadZone({ onUploaded }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf")
    setFiles(dropped)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(Array.from(e.target.files))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setLoading(true)
    const formData = new FormData()
    files.forEach(f => formData.append("files", f))
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    setLoading(false)
    onUploaded(data, files)
  }

  return (
    <div>
      {/* ドロップゾーン */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        style={{
          border: `1.5px dashed ${isDragOver ? "#888" : "#ccc"}`,
          borderRadius: "12px",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "#aaa",
          fontSize: "14px",
          marginBottom: "1.25rem",
          background: isDragOver ? "#fafafa" : "transparent",
          transition: "all 0.15s",
          cursor: "default",
        }}
      >
        {/* アップロードアイコン */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
          style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.35 }}>
          <rect x="4" y="8" width="24" height="20" rx="2" stroke="#888" strokeWidth="1.5"/>
          <path d="M11 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#888" strokeWidth="1.5"/>
          <path d="M16 14v8M13 17l3-3 3 3" stroke="#888" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        PDFをここにドロップ
      </div>

      {/* 選択したファイル一覧 */}
      {files.length > 0 && (
        <ul style={{ listStyle: "none", margin: "0 0 1rem", padding: 0 }}>
          {files.map(f => (
            <li key={f.name} style={{
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "13px", color: "#555",
              padding: "6px 0",
              borderBottom: "0.5px solid #eee",
            }}>
              <PdfIcon />
              {f.name}
            </li>
          ))}
        </ul>
      )}

      {/* ボタン行 */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* ファイル選択ボタン（input を隠してラベルで見た目を作る） */}
        <label style={{
          fontSize: "13px", color: "#555",
          border: "0.5px solid #ccc", borderRadius: "8px",
          padding: "7px 14px", cursor: "pointer",
        }}>
          ファイルを選択
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}   // inputは非表示にしてラベルだけ見せる
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          style={{
            fontSize: "13px",
            color: "#fff",
            background: loading || files.length === 0 ? "#ccc" : "#111",
            border: "none",
            borderRadius: "8px",
            padding: "8px 20px",
            cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {loading ? "抽出中..." : "抽出開始"}
        </button>
      </div>
    </div>
  )
}