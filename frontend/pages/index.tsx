import { useState } from "react";
import UploadZone from "../components/UploadZone";
import ReviewTable from "../components/ReviewTable";
import DownloadButtons from "../components/DownloadButtons";

type PdfItem = {
  original_name: string;
  date: string | null;
  company: string | null;
  amount: string | null;
  excluded: boolean;
  page_count: number;
};

type ConfirmedItem = {
  original_name: string;
  date: string;
  company: string;
  amount: string;
};

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pdfItems, setPdfItems] = useState<PdfItem[]>([]);
  const [confirmedItems, setConfirmedItems] = useState<ConfirmedItem[]>([]);

  return (
    <main
      style={{
        padding: "2.5rem 2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      {/* タイトル */}
      <p style={{ fontSize: "13px", color: "#999", marginBottom: "2px" }}>
        PDF索引ファイル命名ツール
      </p>

      {/* ステップインジケーター（点3つ） */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: n === step ? "#111" : n < step ? "#bbb" : "#ddd",
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <UploadZone
          onUploaded={(items, _files) => {
            setPdfItems(
              items.map((item) => ({
                ...item,
                excluded: false,
                page_count: item.page_count ?? 1, // ← 追加（念のためデフォルト1）
              })),
            );
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <ReviewTable
          pdfItems={pdfItems}
          onChange={setPdfItems}
          onConfirm={(confirmed) => {
            setConfirmedItems(confirmed);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <DownloadButtons
          onReset={() => {
            setStep(1);
            setUploadedFiles([]);
            setPdfItems([]);
            setConfirmedItems([]);
          }}
        />
      )}
    </main>
  );
}