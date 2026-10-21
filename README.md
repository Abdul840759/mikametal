# MIKAMETAL website (private development)
React + Vite + TypeScript + Tailwind v4 + Lucide + Framer Motion + React Router.
## Run
`npm install` · `npm run dev` · `npm run build` · `npm run preview`
## MIKA chat assistant
The floating MIKA chat uses the Vercel serverless function at `api/chat.ts` and NVIDIA NIM's `nvidia/nemotron-3.5-lightning-30b-a3b` model. Copy `.env.example` to `.env.local` and set `NVIDIA_API_KEY` there. Use `vercel dev` (with the Vercel CLI installed) to run the site and API together locally. In Vercel, add `NVIDIA_API_KEY` under Project Settings → Environment Variables, then redeploy. Keep this key private; it is only read by the server function. MIKA streams reply text to the chat while keeping model reasoning private.
## Edit content
Everything lives in `src/config/company.ts`: contacts, description, services, principles, process, projects. Use `null` for unknown values; the UI hides them. Nothing here is a verified company claim. Draft copy is marked.
## Replace assets
Photos: `public/images/photos/pNN.webp` (listed in the `projects` array in `src/config/company.ts`; add `location` and `date` when known). Videos and posters: `public/images/video/`. Logo: `public/images/logo.png` (path set by `logoPath`). Favicon: `public/favicon.svg`. Hero/About/premises images: `src/config/images.ts`. Photos with third-party names or screenshots (originals 75 and 80) were left out on purpose.
## Navigation
Desktop uses the top bar. Below 1024px a fixed bottom tab bar is used (`src/components/layout/Layout.tsx`), with Quote as the highlighted action and call/WhatsApp buttons in the header.
## Contact page
Three tap-to-open tiles (WhatsApp via wa.me, Call via tel:, Email via mailto:) come from `src/config/company.ts`; blank values hide the tile. The quote form validates, then opens WhatsApp or the email app with the details pre-filled, so no backend is needed.
## Before deploying (not done yet)
Add the domain to canonical/og:url in `index.html`, `public/sitemap.xml` and `public/robots.txt`; configure SPA fallback (serve index.html for all routes) on the host.
