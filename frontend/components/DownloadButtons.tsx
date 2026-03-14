type Props = {
  onReset: () => void
}

export default function DownloadButtons({ onReset }: Props) {
  return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      {/* チェックアイコン */}
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1.25rem",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l4 4L19 7" stroke="#111" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <p style={{ fontSize: "17px", fontWeight: 500, marginBottom: "6px" }}>
        処理が完了しました
      </p>
      <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "2rem" }}>
        ファイルをダウンロードしてください
      </p>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "1rem" }}>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/download/result.zip`} download>
          <button style={{
            fontSize: "13px", color: "#fff", background: "#111",
            border: "none", borderRadius: "8px", padding: "8px 20px", cursor: "pointer",
          }}>
            ZIPダウンロード
          </button>
        </a>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/download/result.csv`} download>
          <button style={{
            fontSize: "13px", color: "#555",
            background: "transparent", border: "0.5px solid #ccc",
            borderRadius: "8px", padding: "7px 20px", cursor: "pointer",
          }}>
            CSVダウンロード
          </button>
        </a>
      </div>

      <button
        onClick={onReset}
        style={{
          fontSize: "13px", color: "#bbb",
          background: "transparent", border: "none",
          cursor: "pointer", padding: "6px",
        }}
      >
        最初からやり直す
      </button>
    </div>
  )
}