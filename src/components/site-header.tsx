import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/story", label: "Story" },
  { href: "/work-education", label: "Work & Education" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/beyond-work", label: "Beyond Work" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-6 sm:px-8">
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="quiet-link pb-0.5 transition-colors hover:text-text">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
