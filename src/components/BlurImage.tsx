import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  aspectRatio?: number
}

export default function BlurImage({ src, alt, className = '', aspectRatio }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {/* Placeholder gradient */}
      <div className="pixel-placeholder absolute inset-0" aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`pixel-project-image relative h-full w-full ${aspectRatio ? 'object-contain' : 'object-cover'} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
