import { useState } from "react";
import { Link } from "react-router-dom";
import { HeaderAction, HeaderLink, SiteHeader } from "@/components/SiteHeader";
import { Controls } from "@/components/landing/Controls";
import { PromptPanel } from "@/components/landing/PromptPanel";
import { SpecimenDemo } from "@/components/landing/SpecimenDemo";

const STEPS = [
  {
    title: "Upload a reference",
    body: "Drop in any image whose look you want to reuse. PNG, JPEG, WebP or GIF.",
  },
  {
    title: "Read the style",
    body: "The vision model describes medium, lighting, composition, palette, texture and camera, and ignores what the picture is of.",
  },
  {
    title: "Take the template",
    body: "Pick Midjourney, SDXL, DALL·E or plain text. Switching costs nothing, because the prompt is rebuilt in your browser.",
  },
];

export default function LandingPage(): React.JSX.Element {
  const [styleId, setStyleId] = useState("film");
  const [subjectId, setSubjectId] = useState("lighthouse");
  const [touched, setTouched] = useState(false);

  const choose = (setter: (id: string) => void) => (id: string) => {
    setTouched(true);
    setter(id);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <SiteHeader className="py-6">
        <HeaderLink to="/history">History</HeaderLink>
        <HeaderAction to="/lab">Open the lab</HeaderAction>
      </SiteHeader>

      <main>
        <section className="grid gap-10 pt-8 pb-24 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 lg:pt-12 lg:pb-32">
          <div className="order-1 lg:order-none lg:col-span-5 lg:row-start-1 lg:pt-6">
            <h1 className="font-display text-[clamp(2.75rem,1.4rem+5.4vw,5.5rem)] leading-[0.98] font-normal tracking-[-0.02em] text-balance">
              Lift the style out of any image.
            </h1>
            <p className="text-bone/75 mt-7 max-w-md text-lg leading-relaxed">
              Upload a reference and Style Lab catalogues how it looks: the medium, the light, the
              palette, the texture. You get a prompt with the subject left blank.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                to="/lab"
                className="bg-index text-bone px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
              >
                Analyze an image
              </Link>
              <a
                href="#template"
                className="text-bone/80 hover:text-bone text-sm underline underline-offset-4"
              >
                See the template
              </a>
            </div>
          </div>

          <div className="order-3 lg:order-none lg:col-span-5 lg:row-start-2 lg:mt-10">
            <Controls
              styleId={styleId}
              subjectId={subjectId}
              onStyle={choose(setStyleId)}
              onSubject={choose(setSubjectId)}
            />
          </div>

          <div className="order-2 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0">
            <SpecimenDemo styleId={styleId} subjectId={subjectId} firstReveal={!touched} />
          </div>
        </section>

        <section id="template" className="border-pencil scroll-mt-8 border-t py-20 lg:py-28">
          <h2 className="font-display max-w-xl text-3xl leading-tight tracking-tight sm:text-4xl">
            One style, written for four tools.
          </h2>
          <p className="text-bone/75 mt-4 max-w-lg">
            The prompt keeps a slot open for the subject. Fill it in with anything and the style
            comes along.
          </p>
          <div className="mt-12">
            <PromptPanel styleId={styleId} subjectId={subjectId} />
          </div>
        </section>

        <section
          aria-label="The subject is yours"
          className="grid items-center gap-12 py-24 lg:min-h-[70vh] lg:grid-cols-12"
        >
          <p className="font-display text-[clamp(1.75rem,1rem+3vw,3.25rem)] leading-[1.1] tracking-tight text-balance lg:col-span-7">
            Everything on this page is style. The subject is left blank, and it&rsquo;s yours to
            fill.
          </p>
          <div
            aria-hidden="true"
            className="border-ochre/70 text-ochre flex aspect-4/5 w-full max-w-60 items-center justify-center border border-dashed font-mono text-sm lg:col-span-3 lg:col-start-9"
          >
            [SUBJECT]
          </div>
        </section>

        <section className="border-pencil grid gap-10 border-t py-20 lg:grid-cols-12 lg:py-28">
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl lg:col-span-5">
            From reference to template in three steps.
          </h2>
          <ol className="m-0 flex list-none flex-col gap-10 p-0 lg:col-span-6 lg:col-start-7">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="text-ochre font-mono text-sm leading-7" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl">{step.title}</h3>
                  <p className="text-bone/75 mt-1.5 max-w-md text-[15px] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-pencil flex flex-col items-start gap-6 border-t py-20 lg:py-28">
          <h2 className="font-display max-w-2xl text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Bring a reference you can&rsquo;t quite put into words.
          </h2>
          <Link
            to="/lab"
            className="bg-index text-bone px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
          >
            Analyze an image
          </Link>
        </section>
      </main>

      <footer className="border-pencil text-bone/60 flex flex-wrap justify-between gap-3 border-t py-8 text-sm">
        <span>Style Lab</span>
     
        <Link to="/history" className="hover:text-bone underline underline-offset-4">
          Your saved Analyses
        </Link>
      </footer>
    </div>
  );
}