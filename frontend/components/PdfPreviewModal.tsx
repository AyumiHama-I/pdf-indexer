import { useRef, useEffect } from "react"

type Props = {
  filename: string
  onClose: () => void
}

export default function PdfPreviewModal({ filename, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  // ドラッグ移動の管理
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // リサイズの管理
  const resizing = useRef(false)
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 })

  // ヘッダーを掴んだとき → ドラッグ開始
  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return
    const rect = modalRef.current.getBoundingClientRect()
    dragging.current = true
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  // 右下の角を掴んだとき → リサイズ開始
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return
    e.stopPropagation()  // ドラッグイベントと混在しないように止める
    const rect = modalRef.current.getBoundingClientRect()
    resizing.current = true
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: rect.width,
      h: rect.height,
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!modalRef.current) return

      // ドラッグ中: 位置を直接DOMに書き込む（Reactの再描画を経由しないので速い）
      if (dragging.current) {
        modalRef.current.style.left = `${e.clientX - dragOffset.current.x}px`
        modalRef.current.style.top = `${e.clientY - dragOffset.current.y}px`
      }

      // リサイズ中: サイズを直接DOMに書き込む
      if (resizing.current) {
        const newW = resizeStart.current.w + (e.clientX - resizeStart.current.x)
        const newH = resizeStart.current.h + (e.clientY - resizeStart.current.y)
        // 最小サイズを設定（小さくなりすぎないように）
        modalRef.current.style.width = `${Math.max(300, newW)}px`
        modalRef.current.style.height = `${Math.max(200, newH)}px`
      }
    }

    const handleMouseUp = () => {
      dragging.current = false
      resizing.current = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div
      ref={modalRef}
      style={{
        position: "fixed",
        top: "80px",
        left: "80px",
        width: "600px",
        height: "700px",
        backgroundColor: "white",
        border: "0.5px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ヘッダー（ドラッグで移動） */}
      <div
        onMouseDown={handleDragMouseDown}
        style={{
          padding: "8px 12px",
          backgroundColor: "#f5f5f5",
          borderBottom: "0.5px solid #ddd",
          borderRadius: "8px 8px 0 0",
          cursor: "grab",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
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
        style={{ flex: 1, border: "none" }}
      />

      {/* リサイズハンドル（右下の角） */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: "absolute",
          right: "0",
          bottom: "0",
          width: "16px",
          height: "16px",
          cursor: "nwse-resize",   // 斜め矢印カーソル
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* リサイズハンドルの見た目（小さい斜め線） */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M9 1L1 9M9 5L5 9M9 9" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}