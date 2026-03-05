import { useState } from "react"

type PdfItem = {
  original_name: string
  date: string | null
  company: string | null
  amount: string | null
}

type Props = {
  onUploaded: (items: PdfItem[], files: File[]) => void
}

export default function UploadZone({ onUploaded }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf")
    setFiles(dropped)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    setFiles(selected)
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setLoading(true)

    const formData = new FormData()
    files.forEach(f => formData.append("files", f))

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    setLoading(false)
    onUploaded(data, files)
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: "2px dashed #aaa",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1rem"
        }}
      >
        PDFをここにドロップ
      </div>

      <input type="file" accept="application/pdf" multiple onChange={handleFileSelect} />

      <ul>
        {files.map(f => <li key={f.name}>{f.name}</li>)}
      </ul>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "抽出中..." : "抽出開始"}
      </button>
    </div>
  )
}