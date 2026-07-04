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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to send')

      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-12">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left: info */}
          <div>
            <p className="mb-3 font-mono text-sm text-indigo-400">What's next</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Get in touch
            </h2>
            <p className="mt-5 text-slate-400">
              I'm always open to new opportunities and interesting projects.
              Drop me a message and I'll get back to you as soon as I can.
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
            className="rounded-xl border border-slate-700/60 bg-slate-900/30 p-6 backdrop-blur-sm"
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
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Hi Justine, I'd love to talk about..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === 'sent' ? (
                <p className="flex items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-950/40 px-6 py-3 font-medium text-emerald-400">
                  <FaCheck /> Message sent!
                </p>
              ) : (
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    <FaPaperPlane className="text-sm" />
                  )}
                  {status === 'sending' ? 'Sending...' : 'Send message'}
                </button>
              )}
              {status === 'error' && (
                <p className="mt-2 text-sm text-red-400">
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Forest silhouette SVG — 3 layers of pines with a smooth horizon */}
      <div className="leading-none">
        <svg
          viewBox="0 0 1440 250"
          preserveAspectRatio="xMidYMax meet"
          className="block h-auto w-full"
          aria-hidden="true"
        >
          {/* Back layer — distant hills and faint trees */}
          <path
            d="M0,250 Q60,210 120,215 Q180,200 240,208 Q320,190 400,195 Q480,180 560,188 Q640,170 720,178 Q800,160 880,170 Q960,155 1040,165 Q1120,148 1200,158 Q1280,142 1360,152 Q1400,145 1440,148 L1440,250Z"
            fill="#0A1A18"
            opacity="0.3"
          />
          {/* Back pine trees */}
          <path
            d="M40,215 L45,190 L50,215 M80,208 L85,178 L90,208 M140,200 L146,168 L152,200 M200,195 L206,162 L212,195 M270,190 L275,155 L280,190 M340,185 L346,148 L352,185 M410,182 L415,145 L420,182 M480,178 L485,140 L490,178 M550,175 L556,138 L562,175 M620,172 L625,135 L630,172 M690,170 L696,132 L702,170 M760,168 L765,130 L770,168 M830,165 L835,128 L840,165 M900,163 L906,125 L912,163 M970,160 L975,122 L980,160 M1040,158 L1046,120 L1052,158 M1110,155 L1115,118 L1120,155 M1180,153 L1186,115 L1192,153 M1250,150 L1255,112 L1260,150 M1320,148 L1326,110 L1332,148 M1390,146 L1395,108 L1400,146"
            fill="#0A1A18"
            opacity="0.3"
          />

          {/* Mid layer — rolling hills with denser trees */}
          <path
            d="M0,250 Q80,195 160,200 Q240,180 320,185 Q400,165 480,172 Q560,155 640,162 Q720,145 800,152 Q880,135 960,142 Q1040,125 1120,135 Q1200,118 1280,128 Q1360,112 1440,118 L1440,250Z"
            fill="#061212"
            opacity="0.55"
          />
          {/* Mid pine trees */}
          <path
            d="M50,200 L58,155 L66,200 M100,195 L108,142 L116,195 M165,190 L174,130 L183,190 M235,182 L244,118 L253,182 M310,178 L319,110 L328,178 M385,172 L394,102 L403,172 M460,168 L469,98 L478,168 M535,165 L544,95 L553,165 M610,160 L619,88 L628,160 M685,158 L694,85 L703,158 M760,155 L769,82 L778,155 M835,152 L844,78 L853,152 M910,148 L919,75 L928,148 M985,145 L994,72 L1003,145 M1060,142 L1069,68 L1078,142 M1135,138 L1144,65 L1153,138 M1210,135 L1219,62 L1228,135 M1285,132 L1294,58 L1303,132 M1360,128 L1369,55 L1378,128 M1410,125 L1418,58 L1426,125"
            fill="#061212"
            opacity="0.55"
          />

          {/* Front layer — detailed pine forest silhouette */}
          <path
            d="M0,250 C60,230 80,225 120,228 C160,215 180,210 220,212 C260,200 280,195 320,198 C360,185 380,180 420,182 C460,170 480,165 520,168 C560,155 580,150 620,152 C660,140 680,135 720,138 C760,125 780,120 820,122 C860,110 880,105 920,108 C960,95 980,90 1020,92 C1060,80 1080,75 1120,78 C1160,65 1180,60 1220,62 C1260,50 1280,45 1320,48 C1360,35 1380,30 1420,32 C1430,30 1435,30 1440,32 L1440,250Z"
            fill="#020806"
            opacity="1"
          />
          {/* Front pines — detailed with branches */}
          <path
            d="M30,230 L40,185 L50,230 M35,210 L42,200 M38,220 L45,210
            M90,220 L100,165 L110,220 M95,195 L105,185 M98,208 L108,200
            M155,215 L166,150 L177,215 M160,185 L170,175 M163,200 L173,192
            M220,205 L232,132 L244,205 M226,175 L236,165 M228,190 L240,182
            M290,198 L302,118 L314,198 M295,165 L306,155 M298,180 L310,172
            M355,188 L368,105 L381,188 M362,155 L372,145 M364,170 L376,162
            M420,182 L434,95 L448,182 M426,145 L437,135 M428,162 L440,152
            M490,175 L504,85 L518,175 M496,135 L506,125 M498,152 L510,142
            M555,168 L570,75 L585,168 M562,125 L572,115 M564,142 L576,132
            M620,160 L636,65 L652,160 M628,115 L638,105 M630,132 L642,122
            M690,152 L706,55 L722,152 M698,108 L708,98 M700,125 L712,115
            M758,145 L775,48 L792,145 M765,102 L776,92 M768,118 L780,108
            M825,138 L842,42 L859,138 M832,95 L843,85 M834,112 L846,102
            M892,132 L910,38 L928,132 M900,88 L912,78 M902,105 L914,95
            M960,125 L978,32 L996,125 M968,82 L980,72 M970,98 L982,88
            M1025,120 L1044,28 L1063,120 M1034,75 L1046,65 M1036,92 L1048,82
            M1092,115 L1112,25 L1132,115 M1100,70 L1112,60 M1102,88 L1114,78
            M1158,108 L1178,20 L1198,108 M1165,65 L1178,55 M1168,82 L1180,72
            M1222,102 L1244,18 L1266,102 M1232,58 L1244,48 M1234,75 L1246,65
            M1288,98 L1310,15 L1332,98 M1298,52 L1310,42 M1300,70 L1312,60
            M1352,92 L1374,12 L1396,92 M1362,48 L1374,38 M1364,65 L1376,55"
            fill="#020806"
            opacity="1"
          />
        </svg>
      </div>
    </section>
  )
}
