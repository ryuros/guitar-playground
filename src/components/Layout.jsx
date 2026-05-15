import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SideNav from './SideNav';

const NAV_ITEMS = [
  { to: '/',              icon: 'av_timer',        label: 'Metronome' },
  { to: '/chord-library', icon: 'library_music',   label: 'Chord Library' },
  { to: '/fretboard',     icon: 'straighten',      label: 'Fretboard' },
  { to: '/theory',        icon: 'school',          label: 'Theory' },
  // { to: '/scales',        icon: 'architecture',    label: 'Scale Builder' },
  // { to: '/chords',        icon: 'layers',          label: 'Chord Builder' },
  // { to: '/voicings',      icon: 'search_insights', label: 'Voicing Finder' },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden flex">
      <SideNav />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col p-4 space-y-1">
            <div className="mb-6 px-2 flex justify-between items-center">
              <h1 className="text-label-caps font-label-caps text-on-surface-variant tracking-widest">Guitar Playground</h1>
              <button onClick={() => setMobileOpen(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {NAV_ITEMS.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-full transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-on-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                <span className="text-label-caps font-label-caps">{label}</span>
              </NavLink>
            ))}
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex justify-between items-center px-4 h-16 bg-surface-container shrink-0 sticky top-0 z-10">
          <span className="text-[16px] font-bold text-white tracking-wide">Guitar Playground</span>
          <div className="flex items-center space-x-3">
            <button onClick={() => setMobileOpen(true)} className="text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
