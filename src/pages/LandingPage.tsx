import { Link } from "react-router-dom";
import { SpecimenPlate } from "@/components/specimen/SpecimenPlate";
import type { SpecimenAttribute } from "@/types/specimen";

const DEMO_ATTRIBUTES: SpecimenAttribute[] = [
  { id: "medium", letter: "A", title: "Medium", value: "35mm film photograph" },
  { id: "lighting", letter: "B", title: "Lighting", value: "Low, golden-hour side light" },
  { id: "composition", letter: "C", title: "Composition", value: "Rule-of-thirds, negative space" },
  { id: "palette", letter: "D", title: "Palette", value: "Slate, rust, bone", swatch: "#B8863B" },
  { id: "texture", letter: "E", title: "Texture", value: "Visible grain, soft contrast" },
];

const STEPS = [
  {
    number: "01",
    title: "Upload a reference",
    body: "Drop in any image whose visual style you want to capture.",
  },
  {
    number: "02",
    title: "Style Lab catalogues it",
    body: "Medium, lighting, composition, palette, and texture, pinned and labeled.",
  },
  {
    number: "03",
    title: "Get a reusable prompt",
    body: "Formatted for Midjourney, SDXL, DALL·E, or plain text — swap the subject, keep the style.",
  },
];

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-16 flex flex-wrap items-center justify-between gap-4">
        <span className="font-display text-lg tracking-tight">Style Lab</span>
        <Link
          to="/lab"
          className="border-bone/40 hover:bg-bone hover:text-ink border px-4 py-1.5 text-sm transition-colors"
        >
          Open the lab
        </Link>
      </header>

      <section className="mb-24 grid items-center gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl leading-tight text-balance md:text-5xl">
            Catalogue an image's style. Reuse it on anything.
          </h1>
          <p className="text-bone/70 mt-5 max-w-md text-base">
            Upload a reference, and Style Lab breaks its visual style down into a labeled specimen —
            then hands you a prompt template ready for your subject.
          </p>
          <Link
            to="/lab"
            className="bg-index text-bone mt-8 inline-block px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            Try it with an image →
          </Link>
        </div>

        <SpecimenPlate attributes={DEMO_ATTRIBUTES} image={{ kind: "placeholder" }} />
      </section>

      <section className="border-pencil grid gap-10 border-t pt-12 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number}>
            <div className="text-ochre font-mono text-xs">{step.number}</div>
            <h2 className="font-display mt-2 text-xl">{step.title}</h2>
            <p className="text-bone/70 mt-2 text-sm">{step.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}