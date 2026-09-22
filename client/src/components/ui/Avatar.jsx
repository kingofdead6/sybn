import { useState } from 'react';

/**
 * A person's photo, with initials standing in when there isn't one.
 *
 * Most team members have no real photograph — the seed points them at
 * placeholder paths that do not exist — so a plain `<img>` renders as a broken
 * icon. This shows the person's initials on a tinted plate instead, and falls
 * back to the same plate if a real photo URL fails to load.
 */
export default function Avatar({ src, name = '', className = '', rounded = 'rounded-md' }) {
  const [failed, setFailed] = useState(false);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center bg-accent-wash font-display text-accent ${rounded} ${className}`}
      >
        {initials || '—'}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`shrink-0 object-cover bg-sunk ${rounded} ${className}`}
    />
  );
}
