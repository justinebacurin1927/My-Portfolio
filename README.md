# Justine Bacurin — Portfolio

A responsive, space-themed portfolio showcasing my background, technical skills, and selected software projects.

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

- Put project screenshots in `public/projects/`.
- Put the profile photo in `public/photos/`.
- Replace `public/resume.pdf` when the résumé changes.
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
