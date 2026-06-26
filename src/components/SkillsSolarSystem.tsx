import type { CSSProperties } from 'react'
import type { IconType } from 'react-icons'
import {
  SiReact,
  SiGit,
  SiCss,
  SiJavascript,
  SiPython,
  SiPhp,
  SiLaravel,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiCplusplus,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { FaShieldHalved, FaCode } from 'react-icons/fa6'
import { TbApi } from 'react-icons/tb'

type Planet = { name: string; Icon: IconType; color: string }

type Ring = {
  radius: string
  duration: string
  reverse?: boolean
  planets: Planet[]
}

// Each ring is an orbit; planets are evenly spaced around it.
const rings: Ring[] = [
  {
    radius: '19cqmin',
    duration: '26s',
    planets: [
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'CSS', Icon: SiCss, color: '#2196F3' },
    ],
  },
  {
    radius: '31cqmin',
    duration: '40s',
    reverse: true,
    planets: [
      { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Python', Icon: SiPython, color: '#4B8BBE' },
      { name: 'PHP', Icon: SiPhp, color: '#8993BE' },
      { name: 'Java', Icon: FaJava, color: '#F89820' },
      { name: 'C++', Icon: SiCplusplus, color: '#5BA3E0' },
    ],
  },
  {
    radius: '44cqmin',
    duration: '54s',
    planets: [
      { name: 'Laravel', Icon: SiLaravel, color: '#FF2D20' },
      { name: 'Django', Icon: SiDjango, color: '#44B78B' },
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#6699CC' },
      { name: 'MySQL', Icon: SiMysql, color: '#5F94C0' },
      { name: 'REST APIs', Icon: TbApi, color: '#38BDF8' },
      { name: 'Auth', Icon: FaShieldHalved, color: '#FBBF24' },
    ],
  },
]

export default function SkillsSolarSystem() {
  return (
    <div className="flex justify-center">
      <div className="relative aspect-square w-[min(100%,440px)] [container-type:size]">
        {/* faint orbit guides */}
        {rings.map((ring) => (
          <div
            key={`ring-${ring.radius}`}
            className="solar-ring"
            style={{ '--d': `calc(${ring.radius} * 2)` } as CSSProperties}
          />
        ))}

        {/* sun */}
        <div className="solar-sun shadow-amber-500/40">
          <FaCode className="text-[6cqmin] text-amber-50" />
        </div>

        {/* planets */}
        {rings.map((ring) =>
          ring.planets.map((planet, i) => {
            const angle = (360 / ring.planets.length) * i
            const { Icon } = planet
            return (
              <div
                key={planet.name}
                className={`solar-orbit${ring.reverse ? ' reverse' : ''}`}
                style={
                  {
                    '--radius': ring.radius,
                    '--angle': `${angle}deg`,
                    '--duration': ring.duration,
                  } as CSSProperties
                }
              >
                <div className="solar-planet group">
                  <div
                    className="flex h-[9cqmin] w-[9cqmin] items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/90 shadow-lg shadow-black/40 transition-transform duration-200 group-hover:scale-125 group-hover:border-slate-500"
                    style={{ color: planet.color }}
                  >
                    <Icon className="text-[5cqmin]" />
                  </div>
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    {planet.name}
                  </span>
                </div>
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}
