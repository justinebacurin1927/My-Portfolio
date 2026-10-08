import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const contentSecurityPolicy = [
  "default-src 'none'",
  "script-src 'self'",
  // React uses inline styles for sprite positions and the contribution grid.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io https://github-contributions-api.jogruber.de",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
  "base-uri 'none'",
  'form-action https://formspree.io',
].join('; ')

const productionSecurity: Plugin = {
  name: 'production-security',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
        injectTo: 'head-prepend',
      },
    ],
  },
}

export default defineConfig({
  base: '/My-Portfolio/',
  plugins: [react(), tailwindcss(), productionSecurity],
})
