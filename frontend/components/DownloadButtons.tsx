type Props = {
  onReset: () => void
}

export default function DownloadButtons({ onReset }: Props) {
  return (
    <div>
      <h2>✅ 処理完了</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <a href="http://localhost:8000/download/result.zip" download>
          <button>ZIPダウンロード</button>
        </a>
        <a href="http://localhost:8000/download/result.csv" download>
          <button>CSVダウンロード</button>
        </a>
      </div>
      <button onClick={onReset}>最初からやり直す</button>
    </div>
  )
}