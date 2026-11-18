import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { radioStations as stations } from '../data'
import { useDialogFocus } from '../hooks/useDialogFocus'
import '../styles/radio.css'

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'error'
type Props = { open: boolean; onOpen: () => void; onClose: () => void }

const timestamp = (seconds: number) =>
  Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0')

function RadioDialog({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useDialogFocus(ref)
  return createPortal(
    <dialog
      ref={ref}
      className="room-radio-dialog"
      aria-labelledby="radio-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="radio-window">
        <header className="radio-titlebar">
          <h2 id="radio-title">Room Radio</h2>
          <button type="button" onClick={onClose} aria-label="Close radio" autoFocus>
            ×
          </button>
        </header>
        {children}
      </div>
    </dialog>,
    document.body,
  )
}

export default function RoomRadio({ open, onOpen, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playRequest = useRef(0)
  const wantsPlayback = useRef(false)
  const [station, setStation] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [volume, setVolume] = useState(35)
  const [muted, setMuted] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const track = stations[station]
  const active = status === 'playing' || status === 'loading'

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      wantsPlayback.current = false
      playRequest.current += 1
      audio?.pause()
      audio?.removeAttribute('src')
      audio?.load()
    }
  }, [])

  const play = (index = station) => {
    const audio = audioRef.current
    if (!audio) return
    const request = ++playRequest.current
    wantsPlayback.current = true
    setStation(index)
    setStatus('loading')
    const src = import.meta.env.BASE_URL + 'audio/' + stations[index].file
    if (audio.getAttribute('src') !== src || audio.error) {
      audio.src = src
      setElapsed(0)
      setDuration(0)
      audio.load()
    }
    audio.volume = (volume / 100) ** 2
    audio.muted = muted
    void audio.play().catch(() => {
      if (request !== playRequest.current) return
      wantsPlayback.current = false
      setStatus('error')
    })
  }

  const pause = () => {
    wantsPlayback.current = false
    playRequest.current += 1
    audioRef.current?.pause()
    setStatus('paused')
  }

  return (
    <>
      <button
        type="button"
        className="room-radio-hotspot"
        onClick={onOpen}
        aria-label={'Open room radio' + (active ? ', music playing' : '')}
        aria-haspopup="dialog"
        data-playing={status === 'playing'}
      >
        <img src={import.meta.env.BASE_URL + 'room-radio-v3.png'} alt="" />
        <span className="radio-object-light" aria-hidden="true" />
        <span className="radio-object-label">Radio{active ? ' ♫' : ''}</span>
      </button>
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => {
          if (wantsPlayback.current) setStatus('playing')
          else audioRef.current?.pause()
        }}
        onWaiting={() => {
          if (wantsPlayback.current) setStatus('loading')
        }}
        onPause={() => {
          const audio = audioRef.current
          if (audio?.paused && !audio.ended) {
            wantsPlayback.current = false
            setStatus(audio.error ? 'error' : 'paused')
          }
        }}
        onError={() => {
          if (audioRef.current?.error) {
            wantsPlayback.current = false
            setStatus('error')
          }
        }}
        onEnded={() => {
          if (wantsPlayback.current) play((station + 1) % stations.length)
        }}
        onTimeUpdate={() => setElapsed(audioRef.current?.currentTime ?? 0)}
        onDurationChange={() => {
          const length = audioRef.current?.duration ?? 0
          setDuration(Number.isFinite(length) ? length : 0)
        }}
      />
      {open && (
        <RadioDialog onClose={onClose}>
          <div className="radio-body">
            <div className="radio-display" data-playing={status === 'playing'}>
              <div className="radio-display-top">
                <span>CH {String(station + 1).padStart(2, '0')}</span>
                <span className="radio-signal" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="radio-now-playing">
                <img
                  className="radio-track-cover"
                  src={import.meta.env.BASE_URL + 'albums/' + track.cover}
                  alt={track.coverAlt}
                  width="104"
                  height="104"
                />
                <div className="radio-track-info">
                  <h3>{track.title}</h3>
                  <p>Eric Skiff · {track.subtitle}</p>
                </div>
              </div>
              <progress aria-label="Track progress" max={duration || 1} value={elapsed} />
              <div className="radio-time" aria-hidden="true">
                <span>{timestamp(elapsed)}</span>
                <span>{timestamp(duration)}</span>
              </div>
            </div>
            <p className="radio-status" role="status">
              {status === 'error'
                ? 'Couldn’t play this station. Press play to try again, or choose another.'
                : status === 'loading'
                  ? 'Tuning in…'
                  : status === 'playing'
                    ? 'Now playing · keep listening while you explore.'
                    : status === 'paused'
                      ? 'Paused · ready when you are.'
                      : 'Choose a station or press play.'}
            </p>
            <div className="radio-transport">
              <button
                type="button"
                onClick={() => play((station + stations.length - 1) % stations.length)}
                aria-label="Play previous station"
              >
                <span aria-hidden="true">◀◀</span>
              </button>
              <button
                type="button"
                className="radio-play"
                onClick={() => (wantsPlayback.current ? pause() : play())}
                aria-label={active ? 'Pause radio' : 'Play radio'}
              >
                <span aria-hidden="true">{active ? 'Ⅱ' : '▶'}</span>
                {active ? 'Pause' : status === 'error' ? 'Retry' : 'Play'}
              </button>
              <button
                type="button"
                onClick={() => play((station + 1) % stations.length)}
                aria-label="Play next station"
              >
                <span aria-hidden="true">▶▶</span>
              </button>
            </div>
            <div className="radio-volume">
              <button
                type="button"
                aria-label={muted ? 'Unmute radio' : 'Mute radio'}
                aria-pressed={muted}
                onClick={() => {
                  const next = !muted
                  setMuted(next)
                  if (audioRef.current) audioRef.current.muted = next
                }}
              >
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <label htmlFor="radio-volume">Volume</label>
              <input
                id="radio-volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                aria-valuetext={volume + ' percent' + (muted ? ', muted' : '')}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  setVolume(next)
                  if (audioRef.current) audioRef.current.volume = (next / 100) ** 2
                }}
              />
            </div>
            <div className="radio-stations" role="group" aria-label="Radio stations">
              {stations.map((item, index) => (
                <button
                  key={item.file}
                  type="button"
                  aria-label={'Play ' + item.title}
                  aria-pressed={station === index}
                  onClick={() => play(index)}
                >
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item.title}</span>
                  {station === index && (
                    <span className="radio-station-mark" aria-hidden="true">
                      ◆
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="radio-credits">
              Music:{' '}
              <a href="https://ericskiff.com/music/" target="_blank" rel="noreferrer">
                Eric Skiff — Resistor Anthems
              </a>
              {' · '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 4.0
              </a>
            </p>
          </div>
        </RadioDialog>
      )}
    </>
  )
}
