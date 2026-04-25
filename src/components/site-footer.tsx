interface SiteFooterProps {
  builtWithText: string;
}

export function SiteFooter({ builtWithText }: SiteFooterProps) {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:px-8 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Malith Ileperuma</p>
        <p>{builtWithText}</p>
      </div>
    </footer>
  );
}
