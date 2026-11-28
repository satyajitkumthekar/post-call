import type { ReactNode } from 'react';

// Small building blocks shared by every section of the homepage.

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`mb-4 block font-label text-xs font-medium uppercase tracking-[0.1em] ${dark ? 'text-volt' : 'text-accent'}`}
    >
      {children}
    </span>
  );
}

type Direction = 'right' | 'left' | 'up' | 'down' | 'out';
const turn: Record<Direction, string> = { right: '', left: 'rotate-180', up: '-rotate-90', down: 'rotate-90', out: '-rotate-45' };

export function ListIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`${className} flex-none`}>
      <path d="M6 4h8M6 8h8M6 12h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="2.5" cy="4" r="1.1" fill="currentColor" />
      <circle cx="2.5" cy="8" r="1.1" fill="currentColor" />
      <circle cx="2.5" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function ArrowIcon({ direction = 'right', className = 'h-4 w-4' }: { direction?: Direction; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`${className} ${turn[direction]} flex-none`}>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 30" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M25 13.27a2 2 0 0 1 0 3.46L3.5 29.3A2 2 0 0 1 .5 27.57V2.43A2 2 0 0 1 3.5.7Z" />
    </svg>
  );
}

export function TextLink({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex items-center gap-2 rounded font-display text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        dark ? 'text-volt focus-visible:outline-paper' : 'text-accent focus-visible:outline-accent'
      }`}
    >
      {children}
      <ArrowIcon direction={external ? 'out' : 'right'} />
    </a>
  );
}
