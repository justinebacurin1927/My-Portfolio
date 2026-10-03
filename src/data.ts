// Edit this file to customize your portfolio content.

export const profile = {
  name: 'Justine Bacurin',
  role: 'Software & Web Developer · BSIT Graduate',
  tagline:
    'I turn practical ideas into working products — from responsive interfaces to APIs, databases, and full-stack systems.',
  about:
    "I'm a Bachelor of Science in Information Technology graduate aspiring to grow as a software and web developer. I enjoy creating ideas and solving practical, real-world problems through code. I work across the stack — from building interfaces to wiring up databases — and I'm eager to keep exploring and learning new things throughout my career.",
  email: 'JustineBacurin1927@gmail.com',
  // Set this to `${import.meta.env.BASE_URL}resume.pdf` to show the resume button.
  resumeUrl: null,
  // Put a photo in /public (e.g. /me.jpg) and set it here to replace the placeholder.
  photo: `${import.meta.env.BASE_URL}photos/new.jpeg`,
  pixelPhoto: `${import.meta.env.BASE_URL}photos/profile-pixel.webp`,
  socials: {
    github: 'https://github.com/justinebacurin1927',
    linkedin: 'https://www.linkedin.com/in/justine-bacurin',
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
  fileName: string
  fileType: string
  description: string
  // Longer text shown in the project detail modal. Falls back to description.
  overview?: string
  tags: string[]
  // Put images in /public/projects/ and reference them like '/projects/one.png'.
  // Leave undefined to show a colored gradient placeholder instead.
  image?: string
  link?: string
  linkLabel?: string
  // Keeps a future demo URL on record while showing a non-clickable placeholder.
  demoStatus?: string
  repo?: string
}

export const projects: Project[] = [
  {
    title: 'A.R.K.O — Region Knowledge & Orientation',
    fileName: 'arko-region-guide.cpp',
    fileType: 'CPP',
    description:
      'An interactive, image-based educational guide to the administrative regions of the Philippines built with SDL2 and SDL_bgi graphics.',
    overview:
      'A desktop application that teaches about the administrative regions of the Philippines through a point-and-click graphical interface. Browse regional information — governors, capitals, famous attractions, climate, and local cuisine — through interactive maps and clickable region buttons. Built entirely in C++ using the SDL_bgi library (an SDL2 reimplementation of Borland\'s classic BGI graphics), featuring custom RGB color management, real-time rendering, and event-driven navigation.',
    image: `${import.meta.env.BASE_URL}projects/arko-region-guide.png`,
    tags: ['C++', 'SDL2', 'Graphics'],
    repo: 'https://github.com/justinebacurin1927/Tab-igator',
  },
  {
    title: 'ARKO Software Studio & Workspace',
    fileName: 'arko-platform.app',
    fileType: 'APP',
    description:
      'A team-built software studio site and private operations workspace for web, mobile, automation, and AI projects.',
    overview:
      'ARKO is a Philippine software studio with a public site showcasing its services, selected projects, blog, team, and client inquiry flow. Its private member workspace brings together tasks, finance, documents, messages, resources, workflows, and an AI assistant. The current platform uses Next.js, React, TypeScript, and PostgreSQL.',
    image: `${import.meta.env.BASE_URL}projects/arko-studio-home.png`,
    tags: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Full-Stack'],
    link: 'https://arkodevph.com/',
    linkLabel: 'Visit ARKO',
  },
  {
    title: 'Yuenansichu Restaurant',
    fileName: 'yuenansichu-restaurant.web',
    fileType: 'WEB',
    description:
      'A restaurant website with an animated food showcase, browsable menu, reservation flow, and contact form.',
    overview:
      'A responsive restaurant website built with HTML, CSS, and JavaScript. Visitors can explore featured dishes, filter the menu, make a reservation with a confirmation ticket, and contact the restaurant. The live site presents Yuenansichu’s food and hospitality through a bold visual design.',
    image: `${import.meta.env.BASE_URL}projects/yuenansichu-restaurant.png`,
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    link: 'https://yuenansichu-restaurant.arkodevph.com/',
    linkLabel: 'Visit restaurant site',
  },
  {
    title: 'Scarborough Real Estate',
    fileName: 'scarborough-real-estate.web',
    fileType: 'WEB',
    description:
      'A responsive commercial real estate website concept with property listings, company and team profiles, and animated page transitions.',
    overview:
      'A website redesign concept for Scarborough Real Estate, presenting its commercial retail services and properties across Houston and South Texas. The site includes a dedicated listings page with available and sold property filters, company and team sections, and a front-end inquiry form prototype. Built with HTML, CSS, and JavaScript, with responsive layouts, keyboard-accessible navigation, scroll animations, and reduced-motion support.',
    image: `${import.meta.env.BASE_URL}projects/scarborough-real-estate.png`,
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    link: 'https://scarborough-real-estate.vercel.app/',
    linkLabel: 'Visit Scarborough site',
  },
  {
    title: 'Fresh Phones PH',
    fileName: 'freshphones-ph.web',
    fileType: 'WEB',
    description:
      'A mobile device storefront and paluwagan platform with phone listings, payment plans, and a customer portal.',
    overview:
      'Fresh Phones PH helps customers browse devices, understand paluwagan payment schedules, and follow their applications and payments through a portal. The wider system supports operations such as customer records, payment verification, and agent workflows. Built with Next.js, React, NestJS, Prisma, and PostgreSQL.',
    image: `${import.meta.env.BASE_URL}projects/freshphones-ph.png`,
    tags: ['Next.js', 'React', 'NestJS', 'Prisma', 'PostgreSQL'],
    link: 'https://freshphonesph.vercel.app/',
    linkLabel: 'Visit Fresh Phones',
  },
  {
    title: 'Huntly',
    fileName: 'huntly-careers.web',
    fileType: 'WEB',
    description:
      'A career support platform for organizing a job search, tailoring materials, and tracking applications.',
    overview:
      'Huntly gives job seekers a place to plan their search, tailor career materials, and track applications and follow-ups with support along the way. The platform includes a customer workspace and uses React, NestJS, PostgreSQL, and Clerk authentication.',
    image: `${import.meta.env.BASE_URL}projects/huntly.png`,
    tags: ['React', 'NestJS', 'PostgreSQL', 'Clerk'],
    link: 'https://www.gohuntly.com/',
    linkLabel: 'Visit Huntly',
  },
  {
    title: 'Plankton Running Graphics',
    fileName: 'plankton-run.cpp',
    fileType: 'CPP',
    description:
      'A short animated C++ scene using SDL_bgi graphics — Plankton walks across a SpongeBob-style background with custom RGB rendering.',
    overview:
      'An animated 2D scene built with C++ and SDL_bgi (the SDL2 reimplementation of Borland\'s classic BGI graphics library). Plankton walks across a SpongeBob-style background while Mr. Krabs accuses him of stealing the Krabby Patty. Every frame is redrawn in real-time using custom RGB color macros, with Plankton\'s x-position shifting each cycle to create the walking animation. Demonstrates low-level graphics programming, frame-buffer rendering, and workarounds for SDL_bgi\'s color management quirks.',
    image: `${import.meta.env.BASE_URL}projects/plankton.png`,
    tags: ['C++', 'SDL2', 'Graphics', 'Animation'],
    repo: 'https://github.com/justinebacurin1927/Plankton-Running-Graphics',
  },
  {
    title: 'Eyecare Optical Management System',
    fileName: 'eyecare-system.app',
    fileType: 'APP',
    description:
      'A clinic and point-of-sale management system for optical and eyecare clinics built with Laravel 11, Bootstrap 5, and Alpine.js.',
    overview:
      'A comprehensive management system for optical and eyecare clinics featuring patient records, appointment scheduling, inventory tracking, and point-of-sale functionality. Built with Laravel 11, Bootstrap 5, Alpine.js, and Chart.js for data visualization. Handles everything from walk-in customer transactions to multi-branch inventory management.',
    image: `${import.meta.env.BASE_URL}projects/eyecare-login.png`,
    tags: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    repo: 'https://github.com/justinebacurin1927/Eyecare-Optical-Management-System',
  },
  {
    title: 'AI-Enhanced Bubble Curtain System',
    fileName: 'bubble-curtain.ai',
    fileType: 'AI',
    description:
      'A collaborative research project applying AI to monitor and control a bubble curtain system for environmental protection.',
    image: `${import.meta.env.BASE_URL}projects/bubble-curtain-dashboard.png`,
    tags: ['Python', 'AI'],
    repo: 'https://github.com/ralphrowel/AI-Enhanced-BubbleCurtain-System',
  },
]

export type ConversationTopic = {
  id: 'about' | 'skills' | 'projects' | 'contact'
  question: string
  replies: string[]
}

export const welcomeConversation: { greeting: string; invitation: string; topics: ConversationTopic[] } = {
  greeting: `Hey! I'm ${profile.name}. Welcome to my room. Come on in!`,
  invitation: 'What would you like to know?',
  topics: [
    {
      id: 'about',
      question: 'Tell me about yourself',
      replies: [
        "I'm a Bachelor of Science in Information Technology graduate, growing as a software and web developer.",
        "I enjoy turning practical ideas into working products. That can mean building an interface, connecting an API, or working with a database.",
        "I'm always exploring and learning as I build. You can find more about my background and skills in the About section.",
      ],
    },
    {
      id: 'skills',
      question: 'What do you build?',
      replies: [
        'I build responsive websites and full-stack applications, from restaurant and real estate sites to management systems and customer workspaces.',
        'My projects use tools such as JavaScript, React, PHP, Laravel, Python, and PostgreSQL. I work on interfaces, APIs, authentication, and databases.',
        "I also explore C++ graphics! My regional guide and animated Plankton scene use SDL2 and SDL_bgi. The About section has my full tech stack.",
      ],
    },
    {
      id: 'projects',
      question: 'Show me your projects',
      replies: [
        `There are ${projects.length} projects in my desktop folder, covering websites, full-stack systems, C++ graphics, and a collaborative AI research project.`,
        'You can explore the Scarborough Real Estate concept, Yuenansichu Restaurant, ARKO, Fresh Phones PH, Huntly, and more.',
        'Open a project file to see its screenshot, what it does, and the tools behind it. Live sites and source links are included where available.',
      ],
    },
    {
      id: 'contact',
      question: 'How can I reach you?',
      replies: [
        'Have a project idea, a question about my work, or just want to say hello? Head over to the Contact section.',
        `You can send a message through the form or email me at ${profile.email}.`,
        "You'll also find my GitHub and LinkedIn profiles there. I'd be happy to hear from you!",
      ],
    },
  ],
}
