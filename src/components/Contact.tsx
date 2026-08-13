import { useState, type FormEvent } from 'react'
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
  FaCheck,
  FaSpinner,
} from 'react-icons/fa6'
import { profile } from '../data'

const FORMSPREE_URL = 'https://formspree.io/f/mjgqaeew'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (status === 'sent' || status === 'error') setStatus('idle')
  }

  return (
    <section id="contact" className="scroll-mt-20 px-4 py-10 sm:px-6 sm:py-16">
      <div className="pixel-panel mx-auto max-w-6xl px-6 py-12 sm:px-12">
        <div className="pixel-section-label mb-6">03 // COMMS_TERMINAL</div>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-cyan-300">
              Incoming transmission
            </p>
            <h2 className="text-3xl font-bold uppercase text-white sm:text-4xl">Get in touch</h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              I'm always open to new opportunities and interesting projects. Send a message and I'll get back to you as soon as I can.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              <li><a href={`mailto:${profile.email}`} className="pixel-contact-link"><FaEnvelope aria-hidden="true" /> {profile.email}</a></li>
              <li><a href={profile.socials.github} target="_blank" rel="noreferrer" className="pixel-contact-link"><FaGithub aria-hidden="true" /> GitHub</a></li>
              {profile.socials.linkedin && (
                <li><a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="pixel-contact-link"><FaLinkedin aria-hidden="true" /> LinkedIn</a></li>
              )}
            </ul>

            <div className="pixel-signal mt-10" aria-hidden="true">
              <span /><span /><span /><span /><span /><span /><span />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pixel-terminal p-6">
            <div className="pixel-terminal-bar mb-6">
              <span>MESSAGE.EXE</span><span>[_][□][×]</span>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="pixel-label">NAME:</label>
                <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Your name" className="pixel-input" />
              </div>
              <div>
                <label htmlFor="email" className="pixel-label">EMAIL:</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" className="pixel-input" />
              </div>
              <div>
                <label htmlFor="message" className="pixel-label">MESSAGE:</label>
                <textarea id="message" name="message" required rows={5} value={form.message} onChange={(e) => updateField('message', e.target.value)} placeholder="Type transmission..." className="pixel-input resize-none" />
              </div>

              {status === 'sent' && <p role="status" aria-live="polite" className="pixel-alert pixel-alert-success"><FaCheck /> Transmission sent!</p>}
              <button type="submit" disabled={status === 'sending'} className="pixel-button inline-flex w-full items-center justify-center gap-2 bg-indigo-500 px-6 py-3 font-bold uppercase text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">
                {status === 'sending' ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaPaperPlane aria-hidden="true" />}
                {status === 'sending' ? 'Transmitting...' : 'Send transmission'}
              </button>
              {status === 'error' && <p role="alert" className="pixel-alert pixel-alert-error">Transmission failed. Try again or email me directly.</p>}
            </div>
          </form>
        </div>
      </div>

    </section>
  )
}
