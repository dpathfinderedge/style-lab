import { Link } from "react-router-dom";

export default function NotFoundPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-pencil font-mono text-xs uppercase">404</p>
      <h1 className="font-display text-2xl">There's nothing catalogued here.</h1>
      <Link to="/" className="text-index mt-2 text-sm underline underline-offset-4">
        ← Back to Style Lab
      </Link>
    </div>
  );
}