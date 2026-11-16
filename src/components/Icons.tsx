// Inline stroke icons; decorative, hidden from assistive technology.
export function CheckIcon({ className = 'i' }: { className?: string } = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5" /></svg>
  );
}

export function CopyIcon({ className = 'i' }: { className?: string } = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
  );
}

export function SearchIcon() {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
  );
}

export function FileTextIcon() {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
    </svg>
  );
}

export function PlugIcon() {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5" />
    </svg>
  );
}

export function ArrowUpRightIcon() {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" /></svg>
  );
}
