import { useState } from "react";
import UploadZone from "../components/UploadZone";
import ReviewTable from "../components/ReviewTable";
import DownloadButtons from "../components/DownloadButtons";

// 型定義
type PdfItem = {
  original_name: string;
  date: string | null;
  company: string | null;
  amount: string | null;
  excluded: boolean;
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
    <main style={{ padding: "2rem" }}>
      <h1>PDF索引ファイル命名ツール</h1>

      {step === 1 && (
        <UploadZone
          onUploaded={(items, files) => {
            setUploadedFiles(files);
            setPdfItems(items.map((item) => ({ ...item, excluded: false })));
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
