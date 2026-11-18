// Edit this file to customize your portfolio content.

// Manual event: keep enabled until Jaycee chooses to remove the Christmas lights.
export const roomDecorations = { christmasLights: true }

export const radioStations = [
  {
    title: 'Underclocked',
    subtitle: 'underunderclocked mix',
    file: 'underclocked.mp3',
    cover: 'underclocked-pixel.png',
    coverAlt: 'Pixel art of a glowing computer and an hourglass on a quiet nighttime desk',
  },
  {
    title: 'Come and Find Me',
    subtitle: 'Resistor Anthems',
    file: 'come-and-find-me.mp3',
    cover: 'come-and-find-me-pixel.png',
    coverAlt: 'Pixel art of a lantern beside a forest path leading to a warmly lit cabin',
  },
  {
    title: 'A Night of Dizzy Spells',
    subtitle: 'Resistor Anthems',
    file: 'a-night-of-dizzy-spells.mp3',
    cover: 'a-night-of-dizzy-spells-pixel.png',
    coverAlt: 'Pixel art of a crescent moon and curling starlight above violet village rooftops',
  },
]

export const profile = {
  name: 'Justine Bacurin',
  about:
    "I'm a Bachelor of Science in Information Technology graduate aspiring to grow as a software and web developer. I enjoy creating ideas and solving practical, real-world problems through code. I work across the stack — from building interfaces to wiring up databases — and I'm eager to keep exploring and learning new things throughout my career.",
  email: 'JustineBacurin1927@gmail.com',
  pixelPhoto: `${import.meta.env.BASE_URL}photos/profile-pixel.webp`,
  githubJoinedAt: '2025-09-10',
  studio: {
    name: 'ARKO Software Studio',
    url: 'https://arkodevph.com/',
    teamUrl: 'https://arkodevph.com/#team',
    logo: `${import.meta.env.BASE_URL}brand/arko-icon.png`,
  },
  socials: {
    github: 'https://github.com/justinebacurin1927',
    facebook: 'https://www.facebook.com/share/18ZymD7Dop/',
    linkedin: 'https://www.linkedin.com/in/justine-cane-bacurin-5bb904432/',
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

export type ProjectCategory = 'website' | 'project'

export type Project = {
  title: string
  fileName: string
  fileType: string
  category: ProjectCategory
  description: string
  // Longer text shown in the desktop preview. Falls back to description.
  overview?: string
  tags: string[]
  // Prefix public/project paths with import.meta.env.BASE_URL for GitHub Pages.
  // Leave undefined to show a colored gradient placeholder instead.
  image?: string
  // Use the screenshot's width / height to preserve the complete frame.
  imageAspectRatio?: number
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
    category: 'project',
    description:
      'An interactive, image-based educational guide to the administrative regions of the Philippines built with SDL2 and SDL_bgi graphics.',
    overview:
      "A desktop application that teaches about the administrative regions of the Philippines through a point-and-click graphical interface. Browse regional information — governors, capitals, famous attractions, climate, and local cuisine — through interactive maps and clickable region buttons. Built entirely in C++ using the SDL_bgi library (an SDL2 reimplementation of Borland's classic BGI graphics), featuring custom RGB color management, real-time rendering, and event-driven navigation.",
    image: `${import.meta.env.BASE_URL}projects/arko-region-guide.png`,
    tags: ['C++', 'SDL2', 'Graphics'],
    repo: 'https://github.com/justinebacurin1927/Tab-igator',
  },
  {
    title: 'ARKO Software Studio & Workspace',
    fileName: 'arko-platform.app',
    fileType: 'APP',
    category: 'project',
    description:
      'A team-built software studio site and private operations workspace for web, mobile, automation, and AI projects.',
    overview:
      'ARKO is a Philippine software studio with a public site showcasing its services, selected projects, blog, team, and client inquiry flow. Its private member workspace brings together tasks, finance, documents, messages, resources, workflows, and an AI assistant. The current platform uses Next.js, React, TypeScript, and PostgreSQL.',
    image: `${import.meta.env.BASE_URL}projects/arko-studio-home.png`,
    tags: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Full-Stack'],
    link: profile.studio.url,
    linkLabel: 'Visit ARKO',
  },
  {
    title: 'Yuenansichu Restaurant',
    fileName: 'yuenansichu-restaurant.web',
    fileType: 'WEB',
    category: 'website',
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
    category: 'website',
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
    title: 'RM Internet Services',
    fileName: 'rm-internet-services.web',
    fileType: 'WEB',
    category: 'website',
    description:
      'A responsive internet service provider website with an animated neighborhood illustration, service information, FAQs, and a Facebook inquiry flow.',
    overview:
      'A website for RM Internet Services in Capas, Tarlac, built with React, Vite, and Tailwind CSS. Visitors can explore everyday uses for their connection, read FAQs, and prepare an inquiry about coverage and plans to send through Facebook. The site features custom isometric SVG illustrations, a cable connection loader, scroll animations, and responsive layouts with reduced-motion support.',
    image: `${import.meta.env.BASE_URL}projects/rm-internet-website.png`,
    imageAspectRatio: 8 / 5,
    tags: ['React', 'JavaScript', 'Vite', 'Tailwind CSS', 'SVG Animation'],
    link: 'https://rm-internet-website.vercel.app/',
    linkLabel: 'Visit RM Internet',
  },
  {
    title: 'Smartway Finance v2',
    fileName: 'smartway-finance-v2.web',
    fileType: 'WEB',
    category: 'website',
    description:
      'A responsive finance broker website redesign with a video hero, interactive loan options, calculators, and finance guides.',
    overview:
      'A multi-page website redesign for Smartway Finance, an Australian finance broker. Visitors can explore vehicle, leisure, personal, and business finance, use loan calculators, read finance guides, and start an enquiry. Built with HTML, CSS, and JavaScript, with a video hero, animated finance selectors, custom SVG icons, testimonials, and responsive layouts with reduced-motion support.',
    image: `${import.meta.env.BASE_URL}projects/smartway-finance-v2.webp`,
    imageAspectRatio: 8 / 5,
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'SVG Animation'],
    link: 'https://smartway-finance-version-2.vercel.app/',
    linkLabel: 'Visit Smartway v2',
    repo: 'https://github.com/justinebacurin1927/smartway-finance-v2',
  },
  {
    title: 'CloudPG v2',
    fileName: 'cloudpg-v2.web',
    fileType: 'WEB',
    category: 'website',
    description:
      'A responsive Cloud Payment Group website redesign presenting debt collection, payment management, legal services, and industry information.',
    overview:
      'A multi-page marketing website redesign for Cloud Payment Group, built with HTML, CSS, and JavaScript. The site brings together service pages, an interactive industry explorer, company information, insights, and contact details, with a video hero, custom mascot illustrations, and reduced-motion support. Client login and payment actions connect to existing external services.',
    image: `${import.meta.env.BASE_URL}projects/cloudpg-v2.webp`,
    imageAspectRatio: 8 / 5,
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'CSS Animation'],
    link: 'https://cloudpg-version-3.vercel.app/',
    linkLabel: 'Visit CloudPG v2',
  },
  {
    title: 'Water King Plumbing',
    fileName: 'waterking-plumbing.web',
    fileType: 'WEB',
    category: 'website',
    description:
      'A responsive plumbing website recreation with service and suburb pages, scroll-driven illustrations, and a booking enquiry demo.',
    overview:
      'A 36-page website recreation for Water King Plumbing, built with HTML, CSS, and JavaScript. Visitors can browse plumbing services and service areas, explore animated service illustrations, and open a booking enquiry with their selected service prefilled. The site includes a valve-and-water loader, scroll-responsive navigation, native phone and email links, and responsive layouts with reduced-motion support. The booking form validates locally as a frontend demonstration; it does not transmit bookings.',
    image: `${import.meta.env.BASE_URL}projects/waterking-plumbing.webp`,
    imageAspectRatio: 8 / 5,
    tags: ['HTML', 'CSS', 'JavaScript', 'Vite', 'Responsive Design'],
    link: 'https://waterking-plumbing.vercel.app/',
    linkLabel: 'Visit Water King',
  },
  {
    title: 'Aussie Clotheslines & Letterboxes',
    fileName: 'aussie-clotheslines.web',
    fileType: 'WEB',
    category: 'website',
    description:
      'A responsive clothesline and letterbox website recreation with animated product showcases, a product finder, support guides, and enquiry drafts.',
    overview:
      'A 17-page website recreation for Aussie Clotheslines & Letterboxes, built with HTML, CSS, and JavaScript. The site combines animated product showcases with a clothesline finder, colour and lettering previews, searchable FAQs, selection guides, and policy overviews. Its enquiry flow validates the supplied details and prepares a reviewable email draft. Shopping links open the original store; this recreation does not implement a checkout or process orders.',
    image: `${import.meta.env.BASE_URL}projects/aussie-clotheslines.webp`,
    imageAspectRatio: 8 / 5,
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'CSS Animation'],
    link: 'https://aussie-clotheslines.vercel.app/',
    linkLabel: 'Visit Aussie Clotheslines',
  },
  {
    title: 'The Margin — 2D Survival Game',
    fileName: 'the-margin-2d.game',
    fileType: 'GAME',
    category: 'project',
    description:
      'A turn-based 2D survival roguelike built with Java and libGDX, combining forest exploration, weather, combat, and companions.',
    overview:
      'A Java 17 and libGDX desktop game following Klein, a stranded knight trying to cross the occupied Herois forest. Turn-based exploration brings together hunger, thirst, temperature, day/night, weather, stealth, combat, weapon durability, and companion survival. The playable build includes the opening story, tutorial, and journal; the larger story and trading systems are still in development.',
    image: `${import.meta.env.BASE_URL}projects/the-margin-2d.png`,
    imageAspectRatio: 3 / 2,
    tags: ['Java 17', 'libGDX', 'LWJGL3', 'Maven', 'Game Development'],
    demoStatus: 'Desktop game · In development',
  },
  {
    title: 'Thornwatch — Medieval RTS',
    fileName: 'thornwatch.game',
    fileType: 'GAME',
    category: 'project',
    description:
      'A standalone medieval real-time strategy game with village building, resource gathering, army training, and defensive skirmishes.',
    overview:
      'A Java 17 and libGDX desktop strategy game in which players build a village, gather resources, train an army, and defend against raids before destroying the rival kingdom. Three skirmish maps and a guided introduction support base building, unit formations, healers, fire mages, siege weapons, upgradeable walls, and gates. Pixel-art characters and buildings, animated construction, a minimap, sound effects, and save/load controls support the playable desktop experience.',
    image: `${import.meta.env.BASE_URL}projects/thornwatch.webp`,
    imageAspectRatio: 8 / 5,
    tags: ['Java 17', 'libGDX', 'LWJGL3', 'Maven', 'Game Development'],
    demoStatus: 'Desktop game · Java 17+',
  },
  {
    title: 'Fresh Phones PH',
    fileName: 'freshphones-ph.web',
    fileType: 'WEB',
    category: 'project',
    description:
      'A mobile device storefront and paluwagan platform with phone listings, payment plans, and a customer portal.',
    overview:
      'Fresh Phones PH helps customers browse devices, understand paluwagan payment schedules, and follow their applications and payments through a portal. The wider system supports operations such as customer records, payment verification, and agent workflows. Built with Next.js, React, NestJS, Prisma, and PostgreSQL.',
    image: `${import.meta.env.BASE_URL}projects/freshphones-ph.webp`,
    imageAspectRatio: 8 / 5,
    tags: ['Next.js', 'React', 'NestJS', 'Prisma', 'PostgreSQL'],
    link: 'https://freshphonesph-web.vercel.app/',
    linkLabel: 'Visit Fresh Phones',
  },
  {
    title: 'Huntly',
    fileName: 'huntly-careers.web',
    fileType: 'WEB',
    category: 'project',
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
    category: 'project',
    description:
      'A short animated C++ scene using SDL_bgi graphics — Plankton walks across a SpongeBob-style background with custom RGB rendering.',
    overview:
      "An animated 2D scene built with C++ and SDL_bgi (the SDL2 reimplementation of Borland's classic BGI graphics library). Plankton walks across a SpongeBob-style background while Mr. Krabs accuses him of stealing the Krabby Patty. Every frame is redrawn in real-time using custom RGB color macros, with Plankton's x-position shifting each cycle to create the walking animation. Demonstrates low-level graphics programming, frame-buffer rendering, and workarounds for SDL_bgi's color management quirks.",
    image: `${import.meta.env.BASE_URL}projects/plankton.png`,
    tags: ['C++', 'SDL2', 'Graphics', 'Animation'],
    repo: 'https://github.com/justinebacurin1927/Plankton-Running-Graphics',
  },
  {
    title: 'Eyecare Optical Management System',
    fileName: 'eyecare-system.app',
    fileType: 'APP',
    category: 'project',
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
    category: 'project',
    description:
      'A collaborative research project applying AI to monitor and control a bubble curtain system for environmental protection.',
    image: `${import.meta.env.BASE_URL}projects/bubble-curtain-dashboard.png`,
    tags: ['Python', 'AI'],
    repo: 'https://github.com/ralphrowel/AI-Enhanced-BubbleCurtain-System',
  },
]

export type ConversationTopic = {
  id: 'about' | 'arko' | 'skills' | 'projects' | 'contact'
  question: string
  replies: string[]
}

export const welcomeConversation: {
  greeting: string
  invitation: string
  topics: ConversationTopic[]
} = {
  greeting: `Hey! I'm ${profile.name}. Welcome to my room. Come on in!`,
  invitation: 'What would you like to know?',
  topics: [
    {
      id: 'about',
      question: 'Tell me about yourself',
      replies: [
        "I'm a Bachelor of Science in Information Technology graduate, growing as a software and web developer.",
        'I enjoy turning practical ideas into working products. That can mean building an interface, connecting an API, or working with a database.',
        `I'm also part of ${profile.studio.name}, where we design, build, and ship together.`,
        "I'm always exploring and learning as I build. You can find more about my background and skills in the About section.",
      ],
    },
    {
      id: 'arko',
      question: 'What is ARKO?',
      replies: [
        `I'm part of ${profile.studio.name}, a small software team based in the Philippines.`,
        'We design and build websites, mobile apps, automation, and AI features, working together from the first idea to launch.',
        "You'll find me on our team page as Justine Cane. Open the ARKO icon on my desktop to visit the studio.",
      ],
    },
    {
      id: 'skills',
      question: 'What do you build?',
      replies: [
        'I build responsive websites and full-stack applications, from restaurant and real estate sites to management systems and customer workspaces.',
        'My projects use tools such as JavaScript, React, PHP, Laravel, Python, and PostgreSQL. I work on interfaces, APIs, authentication, and databases.',
        'I also explore C++ graphics! My regional guide and animated Plankton scene use SDL2 and SDL_bgi. The About section has my full tech stack.',
      ],
    },
    {
      id: 'projects',
      question: 'Show me your projects',
      replies: [
        `There are ${projects.length} projects in my desktop folder, covering websites, full-stack systems, a 2D survival game, C++ graphics, and a collaborative AI research project.`,
        'You can explore RM Internet Services, The Margin, the Scarborough Real Estate concept, Yuenansichu Restaurant, ARKO, and more.',
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
