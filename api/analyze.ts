import type { VercelRequest, VercelResponse } from "@vercel/node";
import type {
  AnalyzeRequestBody,
  AnalyzeErrorBody,
  StyleAnalysis,
} from "../src/types/style-analysis";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // base64 payload ceiling, matches client-side check

const SYSTEM_PROMPT = `You are a visual style analyst. Given an image, describe its STYLE, not its literal subject matter in detail. Focus on medium, composition, lighting, color, texture, and technique — the qualities someone would need to reproduce this look on a different subject.

Respond with ONLY a JSON object, no markdown code fences, no preamble, matching exactly this shape:
{
  "medium": string,
  "subject_description": string (one short clause on literal contents),
  "composition": string,
  "lighting": string,
  "color_palette": [{ "name": string, "hex": string }] (4-6 entries),
  "mood_atmosphere": string,
  "texture_and_detail": string,
  "camera_or_render_settings": string,
  "style_references": string[] (2-4 movements, genres, or techniques — not living artists)
}`;

function isValidBody(body: unknown): body is AnalyzeRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.imageBase64 === "string" && b.imageBase64.length > 0 && typeof b.mediaType === "string"
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" } satisfies AnalyzeErrorBody);
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res
      .status(500)
      .json({ error: "Server is missing ANTHROPIC_API_KEY" } satisfies AnalyzeErrorBody);
    return;
  }

  if (!isValidBody(req.body)) {
    res.status(400).json({ error: "Missing imageBase64 or mediaType" } satisfies AnalyzeErrorBody);
    return;
  }

  const { imageBase64, mediaType } = req.body;

  if (imageBase64.length > MAX_IMAGE_BYTES) {
    res.status(413).json({
      error: "Image is too large. Please use an image under ~4MB.",
    } satisfies AnalyzeErrorBody);
    return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: imageBase64 },
              },
              { type: "text", text: "Analyze this image's visual style." },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      res
        .status(502)
        .json({ error: `Vision model request failed: ${detail}` } satisfies AnalyzeErrorBody);
      return;
    }

    const data = (await response.json()) as { content: { type: string; text?: string }[] };
    const textBlock = data.content.find((block) => block.type === "text");

    if (!textBlock?.text) {
      res
        .status(502)
        .json({ error: "Vision model returned no text content" } satisfies AnalyzeErrorBody);
      return;
    }

    let parsed: StyleAnalysis;
    try {
      const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned) as StyleAnalysis;
    } catch {
      res.status(502).json({
        error: "Could not parse the vision model's response as JSON",
      } satisfies AnalyzeErrorBody);
      return;
    }

    res.status(200).json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ error: `Unexpected server error: ${message}` } satisfies AnalyzeErrorBody);
  }
}