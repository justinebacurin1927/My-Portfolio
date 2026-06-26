import { useState } from 'react'
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
} from 'react-icons/fa6'
import { profile } from '../data'
import Section from './Section'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend: compose an email in the visitor's mail client.
    // To use a real form service (e.g. Formspree), POST to your endpoint here instead.
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`)
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name} (${form.email})`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

  return (
    <Section id="contact" className="max-w-6xl px-6 py-16 sm:px-12">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Left: info */}
        <div>
          <p className="mb-3 font-mono text-sm text-indigo-400">What's next</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-5 text-slate-400">
            I'm always open to new opportunities and interesting projects. Drop
            me a message and I'll get back to you as soon as I can.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
              >
                <FaEnvelope className="text-indigo-400" />
                {profile.email}
              </a>
            </li>
            <li>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
              >
                <FaGithub className="text-indigo-400" />
                GitHub
              </a>
            </li>
            {profile.socials.linkedin && (
              <li>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                >
                  <FaLinkedin className="text-indigo-400" />
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Right: message form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-6"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Hi Justine, I'd love to talk about..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-400"
            >
              <FaPaperPlane className="text-sm" />
              Send message
            </button>
          </div>
        </form>
      </div>
    </Section>
  )
}
