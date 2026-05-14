import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',              icon: 'av_timer',        label: 'Metronome' },
  { to: '/chord-library', icon: 'library_music',   label: 'Chord Library' },
  { to: '/fretboard',     icon: 'straighten',      label: 'Fretboard' },
  // { to: '/theory',        icon: 'school',          label: 'Theory' },
  // { to: '/scales',        icon: 'architecture',    label: 'Scale Builder' },
  // { to: '/chords',        icon: 'layers',          label: 'Chord Builder' },
  // { to: '/voicings',      icon: 'search_insights', label: 'Voicing Finder' },
];

const VERSIONS = [
  { version: 'v1.0.0', date: '2025-05-14' },
];

export default function SideNav() {
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const current = VERSIONS[0];

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low px-4 pt-8 pb-4 shrink-0 sticky top-0">
      <div className="mb-8 px-2">
        <h1 className="text-[16px] font-bold text-white tracking-wide">Guitar Playground</h1>
        <button
          onClick={() => setShowVersionPanel(p => !p)}
          className="flex items-center gap-0.5 mt-1 group"
        >
          <span className="text-[12px] font-mono-data text-outline group-hover:text-on-surface-variant transition-colors">
            {current.version}
          </span>
          <span
            className="material-symbols-outlined text-[11px] text-outline group-hover:text-on-surface-variant transition-colors"
            style={{ fontVariationSettings: "'wght' 300" }}
          >
            {showVersionPanel ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showVersionPanel && (
          <div className="mt-2 bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
            {VERSIONS.map(v => (
              <div key={v.version} className="px-3 py-2 flex items-center justify-between border-b border-outline-variant last:border-0">
                <span className="text-[11px] font-bold text-on-surface">{v.version}</span>
                <span className="text-[10px] text-outline font-mono-data">{v.date}</span>
              </div>
            ))}
          </div>
        )}
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
                <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-normal'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
