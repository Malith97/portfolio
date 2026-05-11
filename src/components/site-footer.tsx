import Link from "next/link";

interface SiteFooterProps {
  builtWithText: string;
  navLabel: string;
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function SiteFooter({
  builtWithText,
  navLabel,
  links,
}: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-border sm:mt-20">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8 text-sm text-muted sm:px-8">
        <nav aria-label={navLabel}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Malith Ileperuma</p>
          <p>{builtWithText}</p>
        </div>
      </div>
    </footer>
  );
}
