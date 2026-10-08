import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  aspectRatio?: number
}

export default function BlurImage({ src, alt, className = '', aspectRatio }: Props) {
  const [imageState, setImageState] = useState<{ src: string; status: 'loaded' | 'error' } | null>(
    null,
  )
  const loaded = imageState?.src === src && imageState.status === 'loaded'
  const failed = imageState?.src === src && imageState.status === 'error'

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {/* Placeholder gradient */}
      <div className="pixel-placeholder absolute inset-0" aria-hidden="true" />
      {failed ? (
        <p className="relative p-6 text-center text-sm text-slate-300" role="img" aria-label={alt}>
          Preview unavailable
        </p>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setImageState({ src, status: 'loaded' })}
          onError={() => setImageState({ src, status: 'error' })}
          className={`pixel-project-image relative h-full w-full ${aspectRatio ? 'object-contain' : 'object-cover'} transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
