// Thin-line icons (1.5px stroke) matching the reference header.
type P = { className?: string; title?: string };

const Svg = ({ className = "h-5 w-5", title, children }: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
    {title && <title>{title}</title>}
    {children}
  </svg>
);

export const SearchIcon = (p: P) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></Svg>;
export const UserIcon = (p: P) => <Svg {...p}><circle cx="12" cy="8" r="3.75" /><path d="M4.5 20.25c1.2-3.6 4-5.25 7.5-5.25s6.3 1.65 7.5 5.25" /></Svg>;
export const HomeIcon = (p: P) => <Svg {...p}><path d="M4 11 12 4.5 20 11v9H4v-9Z" /><path d="M9.5 20v-5.5h5V20" /></Svg>;
export const GridIcon = (p: P) => <Svg {...p}><rect x="4.5" y="4.5" width="6" height="6" /><rect x="13.5" y="4.5" width="6" height="6" /><rect x="4.5" y="13.5" width="6" height="6" /><rect x="13.5" y="13.5" width="6" height="6" /></Svg>;
export const PhoneIcon = (p: P) => <Svg {...p}><path d="M6 4h3.2l1.3 4.2-2 1.5a11 11 0 0 0 5.8 5.8l1.5-2L20 14.8V18a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4 6.2 2 2 0 0 1 6 4Z" /></Svg>;
export const MailIcon = (p: P) => <Svg {...p}><rect x="3.75" y="5.75" width="16.5" height="12.5" /><path d="m4 6.5 8 6.5 8-6.5" /></Svg>;
export const BagIcon = (p: P) => <Svg {...p}><path d="M5.25 8.25h13.5l-1 12H6.25l-1-12Z" /><path d="M9 8.25V7a3 3 0 0 1 6 0v1.25" /></Svg>;
export const ArrowIcon = ({ className = "h-3.5 w-4" }: P) => (
  <svg viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.3" className={className} aria-hidden><path d="M0 5h16.5M12.5 1l4 4-4 4" /></svg>
);
export const CloseIcon = (p: P) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
export const MenuIcon = (p: P) => <Svg {...p}><path d="M3.75 7h16.5M3.75 12h16.5M3.75 17h16.5" /></Svg>;
export const ChevronIcon = (p: P) => <Svg {...p}><path d="m7 10 5 5 5-5" /></Svg>;
export const MinusIcon = (p: P) => <Svg {...p}><path d="M6 12h12" /></Svg>;
export const PlusIcon = (p: P) => <Svg {...p}><path d="M12 6v12M6 12h12" /></Svg>;
export const CheckIcon = (p: P) => <Svg {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>;
export const TruckIcon = (p: P) => <Svg {...p}><path d="M2.75 6.75h11v9.5h-11zM13.75 10h4l2.5 3v3.25h-6.5" /><circle cx="7" cy="17.5" r="1.75" /><circle cx="17" cy="17.5" r="1.75" /></Svg>;
export const LockIcon = (p: P) => <Svg {...p}><rect x="5" y="10.5" width="14" height="9.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></Svg>;
export const TagIcon = (p: P) => <Svg {...p}><path d="M3.75 12.6V4.5h8.1l8.4 8.4-8.1 8.1-8.4-8.4Z" /><circle cx="8.25" cy="9" r="1.25" /></Svg>;
export const LeafIcon = (p: P) => <Svg {...p}><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" /><path d="M5 19c3-4 6-6.5 9-8" /></Svg>;

export const trustIcons = { truck: TruckIcon, lock: LockIcon, tag: TagIcon, leaf: LeafIcon };
