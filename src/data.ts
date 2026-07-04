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
  photo: `${import.meta.env.BASE_URL}photos/profile.jpeg`,
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
    title: 'A.R.K.O — Region Knowledge & Orientation',
    description:
      'An interactive, image-based educational guide to the administrative regions of the Philippines built with SDL2 and SDL_bgi graphics.',
    overview:
      'A desktop application that teaches about the administrative regions of the Philippines through a point-and-click graphical interface. Browse regional information — governors, capitals, famous attractions, climate, and local cuisine — through interactive maps and clickable region buttons. Built entirely in C++ using the SDL_bgi library (an SDL2 reimplementation of Borland\'s classic BGI graphics), featuring custom RGB color management, real-time rendering, and event-driven navigation.',
    tags: ['C++', 'SDL2', 'Graphics'],
    repo: 'https://github.com/justinebacurin1927/Tab-igator',
  },
  {
    title: 'ARKO Internal Operations',
    description:
      'A full-stack internal operations platform combining finance tracking, task management, messaging, notes, journal, ideas, and notifications into one cohesive system for small teams.',
    overview:
      'ARKO is a production-grade internal operations platform (v2.0.0) deployed on Vercel with Neon Postgres. It features a Kanban task board with drag-and-drop, finance tracking with budgets and recurring transactions, team messaging, private journal with mood tracking, R&D ideas board with one-click task spawning, resource library, file uploads via Supabase Storage, and role-based user management. Built with React 19 + TypeScript frontend and Django 6 REST API backend.',
    image: `${import.meta.env.BASE_URL}projects/arko-login.png`,
    tags: ['React', 'TypeScript', 'Django', 'PostgreSQL', 'Full-Stack'],
    link: 'https://arko-internal-system.vercel.app',
    repo: 'https://github.com/justinebacurin1927/Internal-ARKO-System',
  },
  {
    title: 'Plankton Running Graphics',
    description:
      'A short animated C++ scene using SDL_bgi graphics — Plankton walks across a SpongeBob-style background with custom RGB rendering.',
    overview:
      'An animated 2D scene built with C++ and SDL_bgi (the SDL2 reimplementation of Borland\'s classic BGI graphics library). Plankton walks across a SpongeBob-style background while Mr. Krabs accuses him of stealing the Krabby Patty. Every frame is redrawn in real-time using custom RGB color macros, with Plankton\'s x-position shifting each cycle to create the walking animation. Demonstrates low-level graphics programming, frame-buffer rendering, and workarounds for SDL_bgi\'s color management quirks.',
    image: `${import.meta.env.BASE_URL}projects/plankton.png`,
    tags: ['C++', 'SDL2', 'Graphics', 'Animation'],
    repo: 'https://github.com/justinebacurin1927/Plankton-Running-Graphics',
  },
  {
    title: 'Flower Shop Landing Page',
    description:
      'A premium floral shop landing page featuring a 3D bouquet creator, interactive shop section, and delivery animation.',
    overview:
      'An immersive web experience for a boutique flower shop built with React 19, Three.js, and Framer Motion. Features a 3D interactive flower display with customizable petals, a bouquet creator where users can arrange their own floral composition, a shop section showcasing curated blooms, and a playful delivery animation that plays on checkout. The design uses a warm earthy palette with custom cursor follower and scroll-based progress tracking.',
    image: `${import.meta.env.BASE_URL}projects/flower-shop.png`,
    tags: ['React', 'Three.js', '3D', 'Framer Motion'],
  },
  {
    title: 'Eyecare Optical Management System',
    description:
      'A clinic and point-of-sale management system for optical and eyecare clinics built with Laravel 11, Bootstrap 5, and Alpine.js.',
    overview:
      'A comprehensive management system for optical and eyecare clinics featuring patient records, appointment scheduling, inventory tracking, and point-of-sale functionality. Built with Laravel 11, Bootstrap 5, Alpine.js, and Chart.js for data visualization. Handles everything from walk-in customer transactions to multi-branch inventory management.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    repo: 'https://github.com/justinebacurin1927/Eyecare-Optical-Management-System',
  },
  {
    title: 'SendFlow — Email Marketing',
    description:
      'An email marketing application built with Laravel featuring campaign management, audience segmentation, and real email delivery via SMTP.',
    overview:
      'An original email marketing platform built during OJT, featuring campaign creation and management, audience segmentation, automation workflows, subscriber list management, and real email delivery via SMTP. Track open rates, click-through rates, and engagement metrics through an intuitive dashboard.',
    image: `${import.meta.env.BASE_URL}projects/sendflow.png`,
    tags: ['Laravel', 'PHP', 'PostgreSQL'],
    link: 'https://sendflow-email-marketing.onrender.com',
    repo: 'https://github.com/justinebacurin1927/Email-Marketing',
  },
  {
    title: 'AI-Enhanced Bubble Curtain System',
    description:
      'A collaborative research project applying AI to monitor and control a bubble curtain system for environmental protection.',
    tags: ['Python', 'AI'],
    repo: 'https://github.com/ralphrowel/AI-Enhanced-BubbleCurtain-System',
  },
  {
    title: 'SendFlow Mobile',
    description:
      'The mobile companion app for SendFlow, bringing email-marketing campaign management to mobile devices. Built with Expo and React Native.',
    tags: ['React Native', 'Expo', 'Mobile'],
    repo: 'https://github.com/justinebacurin1927/SendFlow-Mobile',
  },
]
