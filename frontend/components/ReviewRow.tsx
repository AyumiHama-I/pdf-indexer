// 虫眼鏡アイコン
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

type PdfItem = {
  original_name: string
  date: string | null
  company: string | null
  amount: string | null
  excluded: boolean
}

type Props = {
  item: PdfItem
  onChange: (updated: PdfItem) => void
  onPreview: (filename: string) => void
}

export default function ReviewRow({ item, onChange, onPreview }: Props) {
  const isIncomplete = !item.date || !item.company || !item.amount

  return (
    <tr style={{
      background: item.excluded ? "#f7f7f7" : isIncomplete ? "#fff5f5" : "#fff"
    }}>
      <td style={{ padding: "8px 12px" }}>
        <button
          onClick={() => onPreview(item.original_name)}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "12px",
            color: "#555",
            background: "#f5f5f5",
            border: "0.5px solid #ddd",
            borderRadius: "6px",
            padding: "5px 10px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <SearchIcon />
          確認
        </button>
      </td>
      <td style={{ padding: "8px 12px 8px 0" }}>
        <input
          value={item.date ?? ""}
          onChange={e => onChange({ ...item, date: e.target.value })}
          style={{
            width: "calc(100% - 16px)",
            fontSize: "13px", padding: "5px 8px",
            border: `0.5px solid ${!item.date ? "#e24b4a" : "#ddd"}`,
            borderRadius: "6px", background: "transparent",
          }}
        />
      </td>
      <td style={{ padding: "8px 12px 8px 0" }}>
        <input
          value={item.company ?? ""}
          onChange={e => onChange({ ...item, company: e.target.value })}
          style={{
            width: "calc(100% - 16px)",
            fontSize: "13px", padding: "5px 8px",
            border: `0.5px solid ${!item.company ? "#e24b4a" : "#ddd"}`,
            borderRadius: "6px", background: "transparent",
          }}
        />
      </td>
      <td style={{ padding: "8px 12px 8px 0" }}>
        <input
          value={item.amount ?? ""}
          onChange={e => onChange({ ...item, amount: e.target.value })}
          style={{
            width: "calc(100% - 16px)",
            fontSize: "13px", padding: "5px 8px",
            border: `0.5px solid ${!item.amount ? "#e24b4a" : "#ddd"}`,
            borderRadius: "6px", background: "transparent",
          }}
        />
      </td>
      <td style={{ padding: "8px 0" }}>
        <button
          onClick={() => onChange({ ...item, excluded: !item.excluded })}
          style={{
            fontSize: "12px",
            color: item.excluded ? "#111" : "#999",
            background: "transparent",
            border: `0.5px solid ${item.excluded ? "#aaa" : "#ddd"}`,
            borderRadius: "6px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {item.excluded ? "解除" : "除外"}
        </button>
      </td>
    </tr>
  )
}