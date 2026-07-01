// Edit this file to customize your portfolio content.

export const profile = {
  name: 'Justine Bacurin',
  role: 'Aspiring Software & Web Developer',
  tagline:
    'IT graduate who loves turning ideas into practical, real-world solutions.',
  about:
    "I'm a Bachelor of Science in Information Technology graduate aspiring to grow as a software and web developer. I enjoy creating ideas and solving practical, real-world problems through code. I work across the stack — from building interfaces to wiring up databases — and I'm eager to keep exploring and learning new things throughout my career.",
  email: 'JustineBacurin1927@gmail.com',
  // Drop your resume PDF in the /public folder and point this at it.
  resumeUrl: `${import.meta.env.BASE_URL}resume.pdf`,
  // Put a photo in /public (e.g. /me.jpg) and set it here to replace the placeholder.
  photo: '',
  socials: {
    github: 'https://github.com/justinebacurin1927',
    linkedin: '', // coming soon — fill this in to show the LinkedIn link
  },
}

export const skills = [
  'C++',
  'Java',
  'JavaScript',
  'Python',
  'PHP',
  'React',
  'CSS',
  'Laravel',
  'Django',
  'PostgreSQL',
  'MySQL',
  'Git',
  'REST APIs',
  'Auth',
]

export type Project = {
  title: string
  description: string
  // Longer text shown in the project detail modal. Falls back to description.
  overview?: string
  tags: string[]
  // Put images in /public/projects/ and reference them like '/projects/one.png'.
  // Leave undefined to show a colored gradient placeholder instead.
  image?: string
  link?: string
  repo?: string
}

export const projects: Project[] = [
  {
    title: 'ARKO',
    description:
      'A browser tab management and navigation tool ("Tab-igator") that helps users organize, group, and quickly switch between their open tabs.',
    tags: ['JavaScript', 'Web'],
    repo: 'https://github.com/justinebacurin1927/Tab-igator',
  },
  {
    title: 'Plankton Running Graphics',
    description:
      'A graphics-driven running game project exploring real-time rendering, animation, and motion.',
    tags: ['Java', 'Graphics'],
    repo: 'https://github.com/justinebacurin1927/Plankton-Running-Graphics',
  },
  {
    title: 'Eyecare Optical Management System',
    description:
      'A management system for optical / eyecare clinics to handle patients, appointments, inventory, and records.',
    tags: ['Laravel', 'PHP', 'MySQL'],
    repo: 'https://github.com/justinebacurin1927/Eyecare-Optical-Management-System',
  },
  {
    title: 'SendFlow',
    description:
      'An email-marketing management platform for creating, sending, and tracking email campaigns.',
    tags: ['Laravel', 'PHP', 'PostgreSQL'],
    repo: 'https://github.com/justinebacurin1927/Email-Marketing',
  },
  {
    title: 'AI-Enhanced Bubble Curtain System',
    description:
      'A collaborative project applying AI to monitor and control a bubble curtain system for an environmental / engineering use case.',
    tags: ['Python', 'AI'],
    repo: 'https://github.com/ralphrowel/AI-Enhanced-BubbleCurtain-System',
  },
  {
    title: 'SendFlow Mobile',
    description:
      'The mobile companion app for SendFlow, bringing email-marketing campaign management to mobile devices.',
    tags: ['React Native', 'Mobile'],
    repo: 'https://github.com/justinebacurin1927/SendFlow-Mobile',
  },
]
