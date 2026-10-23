import { Link } from "react-router-dom";
import { LogoMark } from "@/components/LogoMark";

export default function NotFoundPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <LogoMark className="h-8 w-8" />
      <h1 className="font-display text-2xl">There&rsquo;s nothing catalogued here.</h1>
      <p className="text-bone/70 text-sm">That page doesn&rsquo;t exist.</p>
      <Link to="/" className="text-index mt-2 text-sm underline underline-offset-4">
        Back to Style Lab
      </Link>
    </div>
  );
}