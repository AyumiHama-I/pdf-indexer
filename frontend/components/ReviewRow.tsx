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
    <tr style={{ backgroundColor: item.excluded ? "#eee" : isIncomplete ? "#fff0f0" : "white" }}>
      <td>
        <button onClick={() => onPreview(item.original_name)}>👁 PDF確認</button>
      </td>
      <td>
        <input
          value={item.date ?? ""}
          onChange={e => onChange({ ...item, date: e.target.value })}
          style={{ borderColor: !item.date ? "red" : undefined }}
        />
      </td>
      <td>
        <input
          value={item.company ?? ""}
          onChange={e => onChange({ ...item, company: e.target.value })}
          style={{ borderColor: !item.company ? "red" : undefined }}
        />
      </td>
      <td>
        <input
          value={item.amount ?? ""}
          onChange={e => onChange({ ...item, amount: e.target.value })}
          style={{ borderColor: !item.amount ? "red" : undefined }}
        />
      </td>
      <td>
        <button onClick={() => onChange({ ...item, excluded: !item.excluded })}>
          {item.excluded ? "除外解除" : "除外"}
        </button>
      </td>
    </tr>
  )
}