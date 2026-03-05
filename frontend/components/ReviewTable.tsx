import ReviewRow from "./ReviewRow"
import { useState } from "react"

type PdfItem = {
  original_name: string
  date: string | null
  company: string | null
  amount: string | null
  excluded: boolean
}

type ConfirmedItem = {
  original_name: string
  date: string
  company: string
  amount: string
}

type Props = {
  pdfItems: PdfItem[]
  onChange: (items: PdfItem[]) => void
  onConfirm: (confirmed: ConfirmedItem[]) => void
}

export default function ReviewTable({ pdfItems, onChange, onConfirm }: Props) {
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  const handleChange = (updated: PdfItem, index: number) => {
    const newItems = [...pdfItems]
    newItems[index] = updated
    onChange(newItems)
  }

  const handleConfirm = () => {
    // 除外していない行にnullが残っていたらエラー
    const activeItems = pdfItems.filter(item => !item.excluded)
    const hasNull = activeItems.some(item => !item.date || !item.company || !item.amount)
    if (hasNull) {
      alert("未入力の項目があります。赤くなっている箇所を入力してください。")
      return
    }

    const confirmed: ConfirmedItem[] = activeItems.map(item => ({
      original_name: item.original_name,
      date: item.date!,
      company: item.company!,
      amount: item.amount!,
    }))

    onConfirm(confirmed)
  }

  return (
    <div>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>PDF確認</th>
            <th>日付</th>
            <th>会社名</th>
            <th>金額</th>
            <th>除外</th>
          </tr>
        </thead>
        <tbody>
          {pdfItems.map((item, i) => (
            <ReviewRow
              key={item.original_name}
              item={item}
              onChange={updated => handleChange(updated, i)}
              onPreview={setPreviewFile}
            />
          ))}
        </tbody>
      </table>

      {previewFile && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => setPreviewFile(null)}>✕ 閉じる</button>
          <iframe
            src={`http://localhost:8000/preview/${encodeURIComponent(previewFile)}`}
            width="100%"
            height="600px"
          />
        </div>
      )}

      <button onClick={handleConfirm} style={{ marginTop: "1rem" }}>
        一括確定
      </button>
    </div>
  )
}