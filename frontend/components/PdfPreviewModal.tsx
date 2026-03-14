import { useRef, useState, useEffect } from "react"

type Props = {
  filename: string          // 表示するPDFのファイル名
  onClose: () => void       // ✕ボタンを押したときに呼ばれる関数
}

export default function PdfPreviewModal({ filename, onClose }: Props) {
  // モーダルの位置（画面左上からの距離）
  const [pos, setPos] = useState({ x: 80, y: 80 })

  // ドラッグ中かどうか、ドラッグ開始時のマウス位置とモーダル位置を記憶する
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // ヘッダー部分を掴んだとき → ドラッグ開始
  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    dragOffset.current = {
      x: e.clientX - pos.x,  // マウス位置 - モーダル位置 = ずれ
      y: e.clientY - pos.y,
    }
  }

  useEffect(() => {
    // マウスを動かしているとき → 位置を更新
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }
    // マウスボタンを離したとき → ドラッグ終了
    const handleMouseUp = () => {
      dragging.current = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    // コンポーネントが消えるときにイベントを後片付けする
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div
      style={{
        position: "fixed",   // 画面にピン留め（スクロールしても動かない）
        top: pos.y,
        left: pos.x,
        width: "600px",
        height: "700px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        zIndex: 1000,        // 他の要素より手前に表示
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ヘッダー（ここを掴んでドラッグ移動する） */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          padding: "8px 12px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          borderRadius: "8px 8px 0 0",
          cursor: "grab",           // カーソルを「掴む」アイコンに
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",       // ドラッグ中にテキストが選択されないように
        }}
      >
        <span style={{ fontSize: "13px", color: "#555" }}>{filename}</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#888",
          }}
        >
          ✕
        </button>
      </div>

      {/* PDF表示エリア */}
      <iframe
        src={`${process.env.NEXT_PUBLIC_API_URL}/preview/${encodeURIComponent(filename)}`}
        style={{ flex: 1, border: "none" }}   // flex:1 = 残りの高さを全部使う
      />
    </div>
  )
}