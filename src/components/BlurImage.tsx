import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
}

export default function BlurImage({ src, alt, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder gradient */}
      <div className="pixel-placeholder absolute inset-0" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`pixel-project-image h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
