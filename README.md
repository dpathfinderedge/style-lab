# Style Lab

Upload a reference image and Style Lab breaks down its visual style — medium,
lighting, composition, palette, texture, mood — into a labeled "specimen,"
then hands you a reusable prompt template with a `[SUBJECT]` placeholder,
instantly reformattable for Midjourney, Stable Diffusion (SDXL), DALL·E, or
plain text.

## How it works

1. Upload an image (drag/drop or click)
2. Claude's vision API analyzes it once, returning purely descriptive fields
   — medium, lighting, composition, palette, texture, mood, style references
3. A prompt is assembled **client-side** from those fields, formatted for
   whichever platform you pick
4. Switching platforms afterward is instant and free — no second API call,
   since formatting logic lives entirely in the browser
5. Copy the prompt, edit it, or export the whole specimen plate as a PNG


## Architecture notes

A few decisions worth knowing if you're reading the code:

- **Prompt assembly is client-side, not model-side.** The vision call
  returns only descriptive fields; `src/utils/promptAssembly.ts` formats
  them per platform. This means switching platforms after analysis costs
  nothing — no re-running the vision call just to reformat text.
- **The `api/analyze.ts` serverless function** holds `ANTHROPIC_API_KEY` and
  is the only thing that talks to Anthropic. It validates uploaded image
  bytes against their claimed MIME type via magic-number sniffing
  (`api/_lib/validateImage.ts`) before spending a model call on them, and
  applies a soft in-memory rate limit (`api/_lib/rateLimit.ts`) per IP.
- **The rate limiter is intentionally simple.** State lives in the function
  instance's memory — it resets on cold start and isn't shared across
  concurrent instances, so it's a deterrent against casual abuse, not a hard
  guarantee.
- **History is local, not synced.** Entries live in `localStorage` as a
  downscaled JPEG thumbnail + the descriptive analysis fields — full-size
  images are never persisted, to stay well under storage quotas.