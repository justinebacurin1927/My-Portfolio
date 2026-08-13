import { useEffect, useRef } from 'react'

export default function ScrollClaw() {
  const leftClawRef = useRef<HTMLDivElement>(null)
  const rightClawRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const leftClaw = leftClawRef.current
    const rightClaw = rightClawRef.current
    if (!leftClaw || !rightClaw) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const updateClaw = () => {
      frame = 0
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
      const rightOffset = reduceMotion.matches
        ? 120
        : 16 + progress * Math.max(180, window.innerHeight * 0.48)
      const leftOffset = reduceMotion.matches
        ? 176
        : 72 + progress * Math.max(150, window.innerHeight * 0.38)
      const rightDrop = Math.round((window.scrollY + rightOffset) / 8) * 8
      const leftDrop = Math.round((window.scrollY + leftOffset) / 8) * 8

      rightClaw.style.setProperty('--claw-drop', `${rightDrop}px`)
      leftClaw.style.setProperty('--claw-drop', `${leftDrop}px`)
      rightClaw.classList.toggle('is-grabbing', progress > 0.9)
      leftClaw.classList.toggle('is-grabbing', progress > 0.94)
    }

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateClaw)
    }

    updateClaw()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    reduceMotion.addEventListener('change', scheduleUpdate)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      reduceMotion.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <>
      <div className="global-claw-machine global-claw-machine-left" aria-hidden="true">
        <div className="pixel-claw-track global-claw-track">
          <span className="pixel-claw-track-light" />
        </div>
        <div ref={leftClawRef} className="pixel-claw global-claw">
          <div className="pixel-claw-carriage" />
          <div className="pixel-claw-cable" />
          <div className="pixel-claw-grabber">
            <span className="pixel-claw-hub"><i /></span>
            <span className="pixel-claw-arm pixel-claw-arm-left"><i /></span>
            <span className="pixel-claw-arm pixel-claw-arm-right"><i /></span>
          </div>
        </div>
      </div>

      <div className="global-claw-machine global-claw-machine-right" aria-hidden="true">
        <div className="pixel-claw-track global-claw-track">
          <span className="pixel-claw-track-light" />
        </div>
        <div ref={rightClawRef} className="pixel-claw global-claw">
          <div className="pixel-claw-carriage" />
          <div className="pixel-claw-cable" />
          <div className="pixel-claw-grabber">
            <span className="pixel-claw-hub"><i /></span>
            <span className="pixel-claw-arm pixel-claw-arm-left"><i /></span>
            <span className="pixel-claw-arm pixel-claw-arm-right"><i /></span>
          </div>
        </div>
      </div>
    </>
  )
}
