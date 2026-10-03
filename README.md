# Justine Bacurin — Portfolio

A responsive, space-themed portfolio showcasing my background, technical skills, and selected software projects.

The room starts at night on every page load. Click the moon to switch the whole room to daylight, then click the sun to return to night. Open About from the lower-right picture frame on the left wall. Compact room controls provide these actions on portrait and wide screens.

The browser tab uses a pixel moon and stars favicon matching the night room.

The tall frame on the far left holds a pixel-art portrait of my orange tabby cat, keeping her tongue-out expression and raised paw from the original photo. The small upper frame beside it shows her cuddling a gray tabby cat. Both pictures match the room lighting and turn gray with the room during conversations. Click either frame to view its complete portrait full screen; close it with ×, Escape, or a click outside the enlarged frame. The viewer preserves each picture's proportions.

Chopper sleeps curled up on the right, replacing the large floor plant, with a pixel cloud and zZZ above his head. Click him to lift his head for two seconds; the cloud disappears while he is awake and returns when he settles back to sleep. Panther sits on the left watching the monitor. Click him to walk toward the viewer on all four legs using a four-frame gait, then out through the bottom of the screen. Each walk takes 1.8 seconds; as soon as his scratch effect finishes, he walks away from the viewer back to his spot. The room clock stays clear of his path. Repeat clicks during a reaction are ignored. Both pets match the room lighting and turn gray with the background during conversations. Keyboard activation and reduced-motion preferences are supported.

Click the pixel portrait to start a conversation, then click the dialogue or surrounding area to advance from the greeting to the questions. Choose a question about my background, what I build, projects, or contact details; click the dialogue or surrounding area to read each reply. Clicking after the last reply returns to the questions. Press Enter or Space while the dialogue is focused to advance. The character waves, thinks, speaks, and invites you to explore as the conversation progresses. Close it with × or Escape.

Click the desk pencil holder to write a letter, or use the compact envelope control on portrait and wide screens. The contact form opens on cream pixel paper with a moon stamp, sender details, and writing lines. Sending uses the existing Formspree endpoint; only a successful response starts the paper-fold animation and reveals a sealed envelope. Failed sends keep the draft for retrying. Write another letter from the confirmation, or use the direct email and social links. Close with ×, Escape, or a click outside the paper. Keyboard focus stays inside the letter and returns to its trigger when closed. Small screens can scroll while keeping the close button visible; reduced motion skips the folding animation.

When Panther leaves the screen, he scratches the viewer: a single brief impact frame and three curved, tapered pixel claw slashes play across the screen and fade. Each slash has jagged edges, a dark cut, and a thin pale rim. The effect allows clicks through it and starts his return immediately when it finishes, after 1.1 seconds. Reduced motion shows three brief static marks without the flash or swipe animation, then brings him back after 0.6 seconds.

The room computer opens a desktop with the Projects folder and two games. Snake collects golden stars, tracks the current score, and remembers the best score in local storage when available. Use arrows or WASD, swipe the board, or tap the direction controls. Space pauses or resumes; Restart begins a fresh game.

Nightshift is an original Doom-style maze shooter with pixel brick walls, five pursuing sentinels, a blaster, health, and a minimap. Clear all sentinels to unlock the exit marked on the map. Use WASD to move, the left/right arrows or mouse to aim, and Space or the Fire button to shoot. Desktop play captures the mouse when supported; Escape releases it and pauses the game. Drag the view to aim on touchscreens, and hold the movement/fire controls. Both games have their own desktop windows and taskbar buttons, pause when minimized or the tab is hidden, and stop their timers and input listeners when closed. Game code loads only when its icon is opened.

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
- Game rules and maze rendering live in `src/games/`; game interfaces are in `src/components/games/`.
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
