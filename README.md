# Style Lab

Upload a reference image and Style Lab catalogues its visual style — medium,
lighting, composition, palette, texture — then hands you a reusable prompt
template with a `[SUBJECT]` placeholder, formatted for Midjourney, Stable
Diffusion, DALL·E, or plain text.

## Stack

- React + TypeScript, built with Vite
- Tailwind CSS v4
- Claude API (vision) via a Vercel serverless function, so the API key never
  reaches the browser
- Deployed on Vercel

## Running locally

```bash
npm install
cp .env.example .env.local   # add your real ANTHROPIC_API_KEY
npm run dev:full             # runs `vercel dev` — serves the frontend + /api together
```

`npm run dev` alone starts Vite only, without the `/api` routes — useful for
UI-only work, but the upload → analyze flow needs `dev:full`.

## Project structure