import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-reading space-y-6">
      <p className="font-mono text-xs uppercase tracking-label text-muted">Not Found</p>
      <h1 className="font-serif text-4xl text-text">This page is not available.</h1>
      <p className="text-sm leading-relaxed text-muted">
        The content might have moved, or the link may be outdated.
      </p>
      <Link href="/" className="text-sm text-accent hover:underline">
        Return to home
      </Link>
    </div>
  );
}
