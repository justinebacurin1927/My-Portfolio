import { profile, skills } from '../data'
import SkillsSolarSystem from './SkillsSolarSystem'
import Section from './Section'

export default function About() {
  return (
    <Section id="about" className="max-w-6xl px-6 py-14 sm:px-12">
      <div className="pixel-section-label mb-6">01 // ABOUT_ME</div>
      <h2 className="mb-4 text-3xl font-bold uppercase text-white">About me</h2>

      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left: about text + tech stack chips */}
        <div>
          <p className="text-slate-400">{profile.about}</p>

          <h3 className="mt-8 mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Tech Stack
          </h3>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="pixel-chip px-3 py-1 text-sm text-slate-200"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: tech universe */}
        <div>
          <h3 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-300">
            My Tech Universe
          </h3>
          <p className="mb-6 text-center text-sm text-slate-500">
            Hover, focus, or tap a planet to reveal the tool
          </p>
          <SkillsSolarSystem />
        </div>
      </div>
    </Section>
  )
}
