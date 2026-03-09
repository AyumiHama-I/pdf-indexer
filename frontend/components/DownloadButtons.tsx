type Props = {
  onReset: () => void
}

export default function DownloadButtons({ onReset }: Props) {
  return (
    <div>
      <h2>✅ 処理完了</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/download/result.zip`} download>
          <button>ZIPダウンロード</button>
        </a>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/download/result.csv`} download>
          <button>CSVダウンロード</button>
        </a>
      </div>
      <button onClick={onReset}>最初からやり直す</button>
    </div>
  )
}