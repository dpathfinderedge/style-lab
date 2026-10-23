import { Link } from "react-router-dom";
import type { ComponentProps } from "react";
import { LogoMark } from "@/components/LogoMark";

export function SiteHeader({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <header className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <Link to="/" className="font-display flex items-center gap-2 text-lg tracking-tight">
        <LogoMark className="h-6 w-6" />
        Style Lab
      </Link>
      {children ? <nav className="flex items-center gap-5">{children}</nav> : null}
    </header>
  );
}

export function HeaderLink(props: ComponentProps<typeof Link>): React.JSX.Element {
  return (
    <Link
      {...props}
      className="text-bone/80 hover:text-bone text-sm underline underline-offset-4"
    />
  );
}

export function HeaderAction(props: ComponentProps<typeof Link>): React.JSX.Element {
  return (
    <Link
      {...props}
      className="border-bone/40 hover:bg-bone hover:text-ink border px-4 py-1.5 text-sm transition-colors"
    />
  );
}