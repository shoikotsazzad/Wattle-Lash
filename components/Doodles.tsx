// Hand-drawn accents from the reference. Use at most one per section.
type P = { className?: string };

export const DoodleHeart = ({ className = "h-12 w-12 text-mauve" }: P) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    <path
      d="M32 54c-3-4-20-14-22-28-1.5-9 7-15 13.5-11.5C28 17 30 21 32 26c2-6 5.5-11 11-12.5 7-2 13.5 4 11.5 13-3 13-17 22-22.5 27.5Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M30 50c-5-6-14-12-15.5-22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
  </svg>
);

export const DoodleSparkle = ({ className = "h-10 w-10 text-pink" }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <path d="M20 2c1.2 9.5 5.6 15.3 18 18-12.4 2.7-16.8 8.5-18 18-1.2-9.5-5.6-15.3-18-18C14.4 17.3 18.8 11.5 20 2Z" fill="currentColor" />
  </svg>
);

export const BrushUnderline = ({ className = "h-3 w-full text-pink" }: P) => (
  <svg viewBox="0 0 300 14" preserveAspectRatio="none" className={className} aria-hidden>
    <path d="M3 9c40-5 95-7 150-5.5S258 7 297 4" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M10 11c60-3 130-4 200-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".55" />
  </svg>
);

export const Tape = ({ className = "" }: P) => (
  <span aria-hidden className={`absolute block h-6 w-20 bg-pink/80 ${className}`} style={{ clipPath: "polygon(3% 0,100% 6%,97% 100%,0 92%)" }} />
);
