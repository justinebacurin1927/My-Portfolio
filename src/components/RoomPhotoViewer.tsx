import { useRef, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useDialogFocus } from '../hooks/useDialogFocus'

export type RoomPhoto = {
  src: string
  alt: string
  label: string
  aspectRatio: number
  caption?: string
}

type Props = RoomPhoto & { onClose: () => void }

export default function RoomPhotoViewer({ src, alt, label, aspectRatio, caption, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useDialogFocus(dialogRef)

  return createPortal(
    <dialog
      ref={dialogRef}
      className="room-photo-viewer"
      aria-label={label}
      data-has-caption={Boolean(caption)}
      style={{ '--room-photo-ratio': aspectRatio } as CSSProperties}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button
        className="room-photo-close"
        type="button"
        onClick={onClose}
        aria-label={`Close ${label.toLowerCase()}`}
        autoFocus
      >
        ×
      </button>
      <figure className="room-photo-frame">
        <img src={src} alt={alt} />
        {caption && <figcaption className="room-photo-caption">{caption}</figcaption>}
      </figure>
    </dialog>,
    document.body,
  )
}
