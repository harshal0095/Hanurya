'use client';

import { useEffect, useRef, useState } from 'react';

const LOADER_SESSION_KEY = 'hanurya:storefront-loader-shown';

export default function FirstEntryLoader() {
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'leaving'>('hidden');
  const initializedRef = useRef(false);
  const shownRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };

    const scheduleLoader = () => {
      clearTimers();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const visibleDuration = reducedMotion ? 220 : 1500;
      const leavingDuration = reducedMotion ? 100 : 420;

      timersRef.current = [
        window.setTimeout(() => setPhase('leaving'), visibleDuration),
        window.setTimeout(
          () => setPhase('hidden'),
          visibleDuration + leavingDuration,
        ),
      ];
    };

    if (!initializedRef.current) {
      initializedRef.current = true;

      try {
        if (!window.sessionStorage.getItem(LOADER_SESSION_KEY)) {
          window.sessionStorage.setItem(LOADER_SESSION_KEY, 'true');
          shownRef.current = true;
          setPhase('visible');
          scheduleLoader();
        }
      } catch {
        // Storage can be unavailable; still show once for this mount.
        shownRef.current = true;
        setPhase('visible');
        scheduleLoader();
      }
    } else if (shownRef.current) {
      scheduleLoader();
    }

    return clearTimers;
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`hanurya-loader${phase === 'leaving' ? ' hanurya-loader--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Hanurya"
    >
      <div className="hanurya-loader__content" aria-hidden="true">
        <div className="hanurya-loader__mark">
          <span className="hanurya-loader__orbit" />
          <span className="hanurya-loader__wax" />
          <span className="hanurya-loader__wick" />
          <span className="hanurya-loader__flame" />
        </div>
        <p className="hanurya-loader__name">HANURYA</p>
        <p className="hanurya-loader__welcome">Handcrafted with warmth.</p>
        <span className="hanurya-loader__sweep" />
      </div>
    </div>
  );
}
