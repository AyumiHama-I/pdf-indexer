import ReviewRow from "./ReviewRow";
import { useState } from "react";
import PdfPreviewModal from "./PdfPreviewModal";

type PdfItem = {
  original_name: string;
  date: string | null;
  company: string | null;
  amount: string | null;
  excluded: boolean;
  page_count: number 
};

type ConfirmedItem = {
  original_name: string;
  date: string;
  company: string;
  amount: string;
};

type Props = {
  pdfItems: PdfItem[];
  onChange: (items: PdfItem[]) => void;
  onConfirm: (confirmed: ConfirmedItem[]) => void;
};

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 500,
  fontSize: "12px",
  color: "#999",
  borderBottom: "0.5px solid #e5e5e5",
};

export default function ReviewTable({ pdfItems, onChange, onConfirm }: Props) {
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const handleChange = (updated: PdfItem, index: number) => {
    const newItems = [...pdfItems];
    newItems[index] = updated;
    onChange(newItems);
  };

  const handleConfirm = async () => {
    const activeItems = pdfItems.filter((item) => !item.excluded);
    const hasNull = activeItems.some(
      (item) => !item.date || !item.company || !item.amount,
    );
    if (hasNull) {
      alert("未入力の項目があります。赤くなっている箇所を入力してください。");
      return;
    }

    const confirmed: ConfirmedItem[] = activeItems.map((item) => ({
      original_name: item.original_name,
      date: item.date!,
      company: item.company!,
      amount: item.amount!,
    }));

    // POST /confirm を叩く
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirmed),
    });

    onConfirm(confirmed);
  };

  return (
    <div>
      {/* テーブルをカードで囲む */}
      <div
        style={{
          border: "0.5px solid #e5e5e5",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.25rem",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "90px" }}>PDF確認</th>
              <th style={{ ...thStyle, width: "120px" }}>日付</th>
              <th style={thStyle}>会社名</th>
              <th style={{ ...thStyle, width: "110px" }}>金額</th>
              <th style={{ ...thStyle, width: "60px" }}>除外</th>
            </tr>
          </thead>
          <tbody>
            {pdfItems.map((item, i) => (
              <ReviewRow
                key={item.original_name}
                item={item}
                onChange={(updated) => handleChange(updated, i)}
                onPreview={setPreviewFile}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 件数 + 一括確定ボタン */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "12px", color: "#aaa" }}>
          {pdfItems.length}件中 {pdfItems.filter((i) => !i.excluded).length}
          件が対象
        </span>
        <button
          onClick={handleConfirm}
          style={{
            fontSize: "13px",
            color: "#fff",
            background: "#111",
            border: "none",
            borderRadius: "8px",
            padding: "8px 20px",
            cursor: "pointer",
          }}
        >
          一括確定
        </button>
      </div>

      {previewFile && (
        <PdfPreviewModal
          filename={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
