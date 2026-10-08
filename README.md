# Justine Bacurin — Portfolio

A responsive, interactive pixel-room portfolio showcasing my background, technical skills, and selected software projects.

The room starts at night on every page load. Click the moon to switch the whole room to daylight, then click the sun to return to night. Open About from the lower-right picture frame on the left wall, which holds a pixel-art Paramore band portrait. The artwork follows the room's lighting and turns gray during conversations. Compact room controls provide these actions on portrait and wide screens.

The browser tab uses a pixel moon and stars favicon matching the night room.

The pixel calendar below the right shelf opens a yearly contribution graph in a plum pixel window, with the same pixel font, beveled controls, and warm yellow highlights as the room. The default view shows the last year in square tiles with a contrasting green-to-yellow activity scale and slate inactive days, with month labels, Monday/Wednesday/Friday rows, a total, and a Less/More legend. Select an earlier year from the beveled tabs above the graph to view January through December. Hover or focus a square for the daily count; click or tap to keep its details visible below the graph. Arrow keys follow the grid: left/right move a week, up/down move a day, and Home/End move within a week. On small screens, the graph scrolls horizontally and opens at the most recent activity. Weekday labels stay visible while scrolling.

Activity loads only when the calendar opens. It prefers a signed-in contribution snapshot at `public/github-activity.json`, including both public and private activity, and shows its update date. The snapshot contains only the GitHub username, dates, daily counts, and activity levels; repository names, commit messages, and authentication credentials are never exported. Its last-year range ends on the snapshot date so old data is not presented as newly loaded activity. Missing or invalid snapshots fall back to the public [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api). Loaded periods are cached in memory for an hour; Refresh rereads the snapshot or retries the public feed. Failed or incomplete data shows unavailable values rather than zero activity, and requests time out after 12 seconds or cancel when the calendar closes. Close with ×, Escape, or a click outside the panel; keyboard focus stays inside and returns to its trigger. The GitHub username follows `profile.socials.github`, and the earliest year follows `profile.githubJoinedAt` in `src/data.ts`.

To include private contribution counts, sign into GitHub CLI as the portfolio owner and authorize the `read:user` scope:

```bash
gh auth refresh -h github.com -s read:user
npm run sync:activity
```

The sync queries GitHub's authenticated contribution calendar and writes aggregate counts atomically only after validating every date and total. It requires an explicitly verified `read:user` or `user` scope and the correct account. Temporary exports use unique private directories outside `public/` and are cleaned up after the complete file is published. Builds also try to refresh the snapshot using the locally authorized account; if access or the network is unavailable, the existing snapshot is preserved. Published private counts update when a new snapshot is built and deployed. This does not change the account's contribution-visibility settings or make any repository public.

Calendar responses are limited to 1 MiB and at most 371 days per period. Invalid dates, duplicate days, unsafe numeric totals, mismatched accounts, or incomplete snapshots are rejected. Production HTML includes a content security policy restricting scripts to the site's own files and network connections to the site, Formspree, and the public contribution API. Inline styles remain allowed for React's sprite positions and grid sizing. Local development keeps Vite's refresh support.

Daylight brings a gentle breeze outside both windows: small green and gold pixel leaves drift, flutter, and tumble past pale wind streaks. The effects are clipped to all eight glass panes, keeping the wooden frames and room clear. Day and night effects fade with the room lighting and pause while their theme is hidden. Reduced-motion preferences leave the daytime scenery still.

The tall frame on the far left holds a pixel-art portrait of Orange, my orange tabby cat, keeping her tongue-out expression and raised paw from the original photo. The small upper frame beside it shows Orange cuddling Zoro, my gray tabby cat. The cat names appear only beneath their enlarged portraits, leaving the room's wall frames free of nameplates. Both pictures match the room lighting and turn gray with the room during conversations. Click either frame to view its complete portrait full screen; close it with ×, Escape, or a click outside the enlarged frame. The viewer preserves each picture's proportions and keeps its caption visible on small screens. Panther and Chopper have pixel nameplates above them; Panther's nameplate disappears while he explores and returns with him.

The small wooden frame on the bookshelf displays a pixel-art version of ARKO's logo on a dark purple background matching the room wall. Click it to enlarge the artwork in the same full-screen viewer as the cat portraits; close with ×, Escape, or a click outside the picture. Its artwork follows the room's day/night lighting and turns gray with the background during conversations. Hover and keyboard focus trace the visible wooden edges of all four picture frames; the calendar highlight follows its stepped silhouette and binding tabs. Highlights stay aligned without moving the artwork, while the larger click areas remain available. The ARKO desktop shortcut opens the studio website.

The ARKO frame artwork is saved at `public/brand/arko-frame-pixel-wall.png` (1122 × 1402).

Chopper sleeps curled up on the right, replacing the large floor plant, with a pixel cloud and zZZ above his head. Click him to lift his head for two seconds; the cloud disappears while he is awake and returns when he settles back to sleep. Panther sits on the left watching the monitor. Click him to walk toward the viewer on all four legs using a four-frame gait, then out through the bottom of the screen. Each walk takes 1.8 seconds; as soon as his scratch effect finishes, he walks away from the viewer back to his spot. The room clock stays clear of his path. Repeat clicks during a reaction are ignored. Both pets cast layered, stepped shadows beneath their bodies and paws, with stronger, slightly wider shadows in daylight. Panther's shadow narrows for walking and follows him off-screen and back. Both pets match the room lighting and turn gray with the background during conversations. Keyboard activation and reduced-motion preferences are supported.

Click the pixel portrait to start a conversation, then click the dialogue or surrounding area to advance from the greeting to the questions. Choose a question about my background, ARKO, what I build, projects, or contact details; click the dialogue or surrounding area to read each reply. The introduction mentions my ARKO team affiliation, and "What is ARKO?" explains the studio, its work, and how to find my team profile through the desktop shortcut. Clicking after the last reply returns to the questions. Press Enter or Space while the dialogue is focused to advance. The character waves, thinks, speaks, and invites you to explore as the conversation progresses. Close it with × or Escape.

Click the desk pencil holder to write a letter, or use the compact envelope control on portrait and wide screens. The contact form opens on cream pixel paper with a moon stamp, sender details, and writing lines. Sending uses the existing Formspree endpoint; only a successful response starts the paper-fold animation and reveals a sealed envelope. Failed sends keep the draft for retrying. Write another letter from the confirmation, or use the direct email and social links. Close with ×, Escape, or a click outside the paper. Keyboard focus stays inside the letter and returns to its trigger when closed. Small screens can scroll while keeping the close button visible; reduced motion skips the folding animation.

When Panther leaves the screen, he scratches the viewer: a single brief impact frame and three curved, tapered pixel claw slashes play across the screen and fade. Each slash has jagged edges, a dark cut, and a thin pale rim. The effect allows clicks through it and starts his return immediately when it finishes, after 1.1 seconds. Reduced motion shows three brief static marks without the flash or swipe animation, then brings him back after 0.6 seconds.

The room computer opens a desktop with the Projects folder, three games, Facebook and LinkedIn profile icons, and an ARKO shortcut that opens the studio website in a new tab. ARKO uses the studio's official lime-and-black logo inside the same pixel frame as the other desktop icons. About includes a team card linking to ARKO's team section. The studio and social links are configured in `src/data.ts`; the logo in `public/brand/arko-icon.png` comes from `https://arkodevph.com/icon.png`. Desktop icons scroll when needed to keep every shortcut accessible above the tips and taskbar on small screens. Snake collects golden stars, tracks the current score, and remembers the best score in local storage when available. Use arrows or WASD, swipe the board, or tap the direction controls. Space pauses or resumes; Restart begins a fresh game.

Nightshift is an original Doom-style maze shooter with pixel brick walls, five pursuing sentinels, a blaster, health, and a minimap. Clear all sentinels to unlock the exit marked on the map. Use WASD to move, the left/right arrows or mouse to aim, and Space or the Fire button to shoot. Desktop play captures the mouse when supported; Escape releases it and pauses the game. Drag the view to aim on touchscreens, and hold the movement/fire controls. Both games have their own desktop windows and taskbar buttons, pause when minimized or the tab is hidden, and stop their timers and input listeners when closed. Game code loads only when its icon is opened.

Tinycraft is an original Minecraft-style creative sandbox: a 28 × 28 block island with trees, a starter cabin, and six unlimited building materials. Walk with WASD, jump with Space, aim with the mouse or arrow keys, mine with left click/E, and place with right click/Q. Select materials with 1–6 or the hotbar. On touchscreens, drag to look and use the movement, Mine, Place, and Jump buttons. Escape pauses and releases the mouse. Minimize pauses the world; the taskbar restores it without losing the current session. Back to spawn moves you to a safe spot, and New world asks before replacing the session. Closing the game or reloading starts fresh: Tinycraft has no saved worlds, storage, or backend. Its Three.js renderer loads only when the game is opened and releases its resources when closed.

## Built with

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- React Icons
- Three.js for the Tinycraft block world
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
npm run sync:activity # Refresh aggregate public + private contribution counts
npm run lint     # Run Oxlint
npm run format   # Format source, scripts, and configuration
npm run format:check # Check formatting without changing files
npm run test:security # Check private-export permissions, data limits, and file safety
npm audit        # Check known dependency advisories
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
npm run deploy   # Publish dist/ to the gh-pages branch
```

## Updating content

Portfolio copy, profile links, skills, projects, and screenshot paths are configured in [`src/data.ts`](src/data.ts).

Edit `welcomeConversation` in that file to change the greeting, questions, and replies.

- Put project screenshots in `public/projects/`.
- Put room portraits and dialogue sprites in `public/photos/`. The social-preview photo is configured in `index.html`.
- Pet sprites live in `public/pets/`; their interactions are in `src/components/RoomPets.tsx`.
- Game rules and maze rendering live in `src/games/`; game interfaces are in `src/components/games/`.
- `public/resume.pdf` remains available as a direct download; the room has no résumé button.
- Update `FORMSPREE_URL` in `src/components/Contact.tsx` if the contact form changes.

Because the site is hosted under `/My-Portfolio/`, public asset paths should use `import.meta.env.BASE_URL` when referenced from TypeScript.

## Code structure

- `src/App.tsx` manages room lighting and hash-based app navigation.
- `src/components/` contains the room, desktop, dialogue, and overlays. About and Projects render only inside room windows.
- `src/hooks/useDialogFocus.ts` shares dialog focus, keyboard containment, and focus restoration.
- `src/games/` contains game rules and renderers; `src/components/games/` contains their interfaces, loaded on demand.
- `src/lib/github-activity.ts` validates, fetches, and caches contribution data.
- `src/index.css` imports Tailwind and focused stylesheets in `src/styles/`, keeping their cascade order explicit.
- `scripts/` contains the activity exporter and its security regression checks.

The retired scrolling-site components, styles, and artwork variants have been removed. TypeScript strict mode and formatting checks apply to the maintained code.

## Deployment

`gh-pages` is pinned to 6.1.1 to avoid the unpatched `braces` dependency in later releases ([advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)). Recheck `npm audit` before upgrading it.

Create and verify the production build before publishing:

```bash
npm run lint
npm run build
npm run deploy
```

The live site is available at [justinebacurin1927.github.io/My-Portfolio](https://justinebacurin1927.github.io/My-Portfolio/).
