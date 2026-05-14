import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',              icon: 'av_timer',        label: 'Metronome' },
  { to: '/chord-library', icon: 'library_music',   label: 'Chord Library' },
  { to: '/fretboard',     icon: 'straighten',      label: 'Fretboard' },
  { to: '/scales',        icon: 'architecture',    label: 'Scale Builder' },
  { to: '/chords',        icon: 'layers',          label: 'Chord Builder' },
  { to: '/voicings',      icon: 'search_insights', label: 'Voicing Finder' },
  { to: '/quiz',          icon: 'quiz',            label: 'Quiz' },
];

export default function SideNav() {
  return (
    <nav className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low p-4 shrink-0 sticky top-0">
      <div className="mb-8 px-2">
        <h1 className="text-label-caps font-label-caps text-on-surface-variant tracking-widest">Guitar Playground</h1>
        <p className="text-[10px] font-mono-data text-outline mt-1">V2.0.4</p>
      </div>

      <div className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-full transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-on-primary font-bold glowing-border translate-x-1'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                <span className="text-label-caps font-label-caps">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
