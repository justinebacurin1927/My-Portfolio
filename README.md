# Justine Bacurin — Portfolio

A responsive, space-themed portfolio showcasing my background, technical skills, and selected software projects.

The room starts at night on every page load. Click the moon to switch the whole room to daylight, then click the sun to return to night. Open About from the lower-right picture frame on the left wall. Compact room controls provide these actions on portrait and wide screens.

The browser tab uses a pixel moon and stars favicon matching the night room.

The tall frame on the far left holds a pixel-art portrait of my orange tabby cat, keeping her tongue-out expression and raised paw from the original photo. The small upper frame beside it shows her cuddling a gray tabby cat. Both pictures match the room lighting and turn gray with the room during conversations. Click either frame to view its complete portrait full screen; close it with ×, Escape, or a click outside the enlarged frame. The viewer preserves each picture's proportions.

Chopper sleeps curled up on the right, replacing the large floor plant, with a pixel cloud and zZZ above his head. Click him to lift his head for two seconds; the cloud disappears while he is awake and returns when he settles back to sleep. Panther sits on the left watching the monitor. Click him to walk toward the viewer on all four legs using a four-frame gait, then out through the bottom of the screen. Each walk takes 1.8 seconds; as soon as his scratch effect finishes, he walks away from the viewer back to his spot. The room clock stays clear of his path. Repeat clicks during a reaction are ignored. Both pets match the room lighting and turn gray with the background during conversations. Keyboard activation and reduced-motion preferences are supported.

Click the pixel portrait to start a conversation, then click the dialogue or surrounding area to advance from the greeting to the questions. Choose a question about my background, what I build, projects, or contact details; click the dialogue or surrounding area to read each reply. Clicking after the last reply returns to the questions. Press Enter or Space while the dialogue is focused to advance. The character waves, thinks, speaks, and invites you to explore as the conversation progresses. Close it with × or Escape.

When Panther leaves the screen, he scratches the viewer: a single brief impact frame and three curved, tapered pixel claw slashes play across the screen and fade. Each slash has jagged edges, a dark cut, and a thin pale rim. The effect allows clicks through it and starts his return immediately when it finishes, after 1.1 seconds. Reduced motion shows three brief static marks without the flash or swipe animation, then brings him back after 0.6 seconds.

## Built with

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- React Icons
- Formspree for contact-form delivery
- GitHub Pages for hosting

## Local development

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Commands

```bash
npm run dev      # Start the development server
npm run lint     # Run Oxlint
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
npm run deploy   # Publish dist/ to the gh-pages branch
```

## Updating content

Most portfolio copy, profile links, skills, projects, screenshots, and résumé paths are configured in [`src/data.ts`](src/data.ts).

Edit `welcomeConversation` in that file to change the greeting, questions, and replies.

- Put project screenshots in `public/projects/`.
- Put the profile photo in `public/photos/`.
- Pet sprites live in `public/pets/`; their interactions are in `src/components/RoomPets.tsx`.
- Replace `public/resume.pdf`, then set `resumeUrl` in `src/data.ts` to enable the résumé button.
- Update `FORMSPREE_URL` in `src/components/Contact.tsx` if the contact form changes.

Because the site is hosted under `/My-Portfolio/`, public asset paths should use `import.meta.env.BASE_URL` when referenced from TypeScript.

## Deployment

Create and verify the production build before publishing:

```bash
npm run lint
npm run build
npm run deploy
```

The live site is available at [justinebacurin1927.github.io/My-Portfolio](https://justinebacurin1927.github.io/My-Portfolio/).
