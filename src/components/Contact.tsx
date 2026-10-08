import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { profile } from '../data'
import { useDialogFocus } from '../hooks/useDialogFocus'

const FORMSPREE_URL = 'https://formspree.io/f/mjgqaeew'
const FOLD_DURATION = 720
const REQUEST_TIMEOUT = 12_000

type Props = {
  onClose: () => void
}

type LetterStatus = 'idle' | 'sending' | 'folding' | 'sent' | 'error'

function LetterEnvelope({ sealed = false }: { sealed?: boolean }) {
  return (
    <svg viewBox="0 0 128 88" fill="none" shapeRendering="crispEdges" aria-hidden="true">
      {!sealed && (
        <path
          d="M8 30V22H16V18H24V14H32V10H44V6H56V2H72V6H84V10H96V14H104V18H112V22H120V30Z"
          fill="#c6a17e"
          stroke="#624340"
          strokeWidth="2"
        />
      )}
      <path
        d="M8 26H120V30H124V80H120V84H8V80H4V30H8Z"
        fill="#e5c8a0"
        stroke="#624340"
        strokeWidth="2"
      />
      <path
        d="M8 78H16V72H24V66H32V60H40V54H48V48M120 78H112V72H104V66H96V60H88V54H80V48"
        stroke="#b58b6c"
        strokeWidth="2"
      />
      {sealed && (
        <path
          d="M8 30H16V34H24V38H32V42H40V46H48V50H56V54H72V50H80V46H88V42H96V38H104V34H112V30H120"
          stroke="#624340"
          strokeWidth="2"
        />
      )}
      <path d="M8 80H120" stroke="#f5dfba" strokeWidth="2" />
      {sealed && (
        <g>
          <path d="M58 47H70V49H72V61H70V63H58V61H56V49H58Z" fill="#654060" />
          <path d="M61 50H64V53H61V57H65V60H60V58H58V53H60V50Z" fill="#f4d990" />
        </g>
      )}
    </svg>
  )
}

function LetterStamp() {
  return (
    <svg
      className="room-letter-stamp"
      viewBox="0 0 24 28"
      shapeRendering="crispEdges"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 0H6V2H8V0H12V2H14V0H18V2H20V0H24V4H22V6H24V10H22V12H24V16H22V18H24V22H22V24H24V28H20V26H18V28H14V26H12V28H8V26H6V28H2V24H0V22H2V18H0V16H2V12H0V10H2V6H0V4H2Z"
        fill="#d7bb8a"
      />
      <path d="M4 4H20V24H4Z" fill="#57405e" />
      <path d="M10 7H13V9H15V11H16V15H15V17H13V18H9V17H7V15H11V14H13V10H11V9H10Z" fill="#f1d594" />
      <path d="M6 8H7V9H6ZM17 17H18V18H17ZM7 20H17V21H7Z" fill="#b8cbd0" />
    </svg>
  )
}

export default function Contact({ onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<LetterStatus>('idle')
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const receiptRef = useRef<HTMLHeadingElement>(null)
  const requestRef = useRef<AbortController | null>(null)
  const foldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const busy = status === 'sending' || status === 'folding'
  useDialogFocus(dialogRef)

  useEffect(() => {
    return () => {
      requestRef.current?.abort()
      if (foldTimerRef.current) clearTimeout(foldTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (status === 'sent') {
      dialogRef.current?.scrollTo({ top: 0 })
      receiptRef.current?.focus({ preventScroll: true })
    }
  }, [status])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (requestRef.current || busy || status === 'sent') return

    const letter = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }

    if (!letter.name || !letter.email || !letter.message) {
      setError('Add your name, email, and message before sending.')
      setStatus('error')
      return
    }

    const request = new AbortController()
    requestRef.current = request
    setError('')
    setStatus('sending')
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      request.abort()
    }, REQUEST_TIMEOUT)

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(letter),
        signal: request.signal,
      })
      if (!response.ok) throw new Error('Letter was not accepted')
      if (request.signal.aborted) return

      const finishSending = () => {
        foldTimerRef.current = null
        setForm({ name: '', email: '', message: '' })
        setStatus('sent')
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishSending()
      } else {
        setStatus('folding')
        foldTimerRef.current = setTimeout(finishSending, FOLD_DURATION)
      }
    } catch {
      if (!request.signal.aborted || timedOut) {
        setError(
          timedOut
            ? 'Sending took too long. Try again, or email me directly below.'
            : 'Your letter could not be sent. Try again, or email me directly below.',
        )
        setStatus('error')
      }
    } finally {
      clearTimeout(timeout)
      if (requestRef.current === request) requestRef.current = null
    }
  }

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (status === 'error') {
      setError('')
      setStatus('idle')
    }
  }

  const writeAnother = () => {
    setStatus('idle')
    requestAnimationFrame(() => {
      dialogRef.current?.scrollTo({ top: 0 })
      nameRef.current?.focus({ preventScroll: true })
    })
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="room-letter-dialog"
      aria-labelledby="room-letter-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="room-letter-scene" data-phase={status}>
        <button
          className="room-letter-close"
          type="button"
          onClick={onClose}
          aria-label="Close letter"
          autoFocus
        >
          ×
        </button>

        <div className="room-letter-composition">
          {status !== 'sent' ? (
            <>
              <div className="room-letter-envelope">
                <LetterEnvelope sealed={status === 'folding'} />
              </div>
              <section className="room-letter-paper">
                <header className="room-letter-header">
                  <div>
                    <p className="room-letter-kicker">A NOTE TO JUSTINE</p>
                    <h2 id="room-letter-title">Write me a letter.</h2>
                    <p className="room-letter-intro">A project, an idea, or just a hello.</p>
                  </div>
                  <LetterStamp />
                </header>

                <div className="room-letter-recipient">
                  <span>To</span>
                  <div>
                    <strong>{profile.name}</strong>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </div>
                </div>

                <form onSubmit={handleSubmit} aria-busy={busy}>
                  <fieldset disabled={busy}>
                    <legend className="sr-only">Your letter</legend>
                    <div className="room-letter-sender">
                      <div>
                        <label htmlFor="letter-name">From</label>
                        <input
                          ref={nameRef}
                          id="letter-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={form.name}
                          onChange={(event) => updateField('name', event.target.value)}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="letter-email">Reply to</label>
                        <input
                          id="letter-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={form.email}
                          onChange={(event) => updateField('email', event.target.value)}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="room-letter-message">
                      <label htmlFor="letter-message">Your message</label>
                      <span className="room-letter-salutation" aria-hidden="true">
                        Dear Justine,
                      </span>
                      <textarea
                        id="letter-message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(event) => updateField('message', event.target.value)}
                        placeholder="I have something in mind..."
                        aria-describedby={status === 'error' ? 'room-letter-error' : undefined}
                      />
                    </div>
                  </fieldset>

                  <div className="room-letter-actions">
                    <span className="room-letter-signoff" aria-hidden="true">
                      Talk soon.
                    </span>
                    <button type="submit" className="room-letter-send" disabled={busy}>
                      <LetterEnvelope sealed />
                      {status === 'sending'
                        ? 'Sending…'
                        : status === 'folding'
                          ? 'Sealing…'
                          : 'Send letter'}
                    </button>
                  </div>
                  {status === 'sending' && (
                    <p className="room-letter-feedback" role="status">
                      Sending your letter…
                    </p>
                  )}
                  {status === 'error' && (
                    <p
                      id="room-letter-error"
                      className="room-letter-feedback room-letter-feedback--error"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </form>
              </section>
            </>
          ) : (
            <section className="room-letter-receipt">
              <div className="room-letter-delivered-envelope">
                <LetterEnvelope sealed />
              </div>
              <p className="room-letter-kicker">SIGNED, SEALED, SENT</p>
              <h2 id="room-letter-title" ref={receiptRef} tabIndex={-1}>
                Letter sent!
              </h2>
              <p role="status">
                Thanks for reaching out.
                <br />
                I'll get back to you as soon as I can.
              </p>
              <button type="button" className="room-letter-send" onClick={writeAnother}>
                Write another letter
              </button>
            </section>
          )}
        </div>

        <footer className="room-letter-footer">
          <a href={`mailto:${profile.email}`} className="room-letter-direct">
            {profile.email}
          </a>
          <div>
            <a href={profile.socials.github} target="_blank" rel="noreferrer">
              <FaGithub aria-hidden="true" /> GitHub
            </a>
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin aria-hidden="true" /> LinkedIn
              </a>
            )}
          </div>
        </footer>
      </div>
    </dialog>,
    document.body,
  )
}
