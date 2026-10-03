import { useEffect, useRef, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  src: string
  alt: string
  label: string
  aspectRatio: number
  onClose: () => void
}

export default function RoomPhotoViewer({ src, alt, label, aspectRatio, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus = document.activeElement
    dialog.showModal()

    return () => {
      dialog.close()
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      className="room-photo-viewer"
      aria-label={label}
      style={{ '--room-photo-ratio': aspectRatio } as CSSProperties}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button className="room-photo-close" type="button" onClick={onClose} aria-label={`Close ${label.toLowerCase()}`} autoFocus>
        ×
      </button>
      <figure className="room-photo-frame">
        <img src={src} alt={alt} />
      </figure>
    </dialog>,
    document.body,
  )
}
