interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <header className="mb-12 space-y-4 border-b border-border pb-8">
      <p className="font-mono text-xs uppercase tracking-label text-muted">{label}</p>
      <h1 className="max-w-4xl font-serif text-4xl leading-tight text-text sm:text-5xl">{title}</h1>
      {description ? <p className="max-w-reading text-base leading-relaxed text-muted">{description}</p> : null}
    </header>
  );
}
