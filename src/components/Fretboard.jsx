// Reusable interactive fretboard component
import { getFretboardNotes } from '../lib/music';

const STRING_NAMES_DISPLAY = ['e','B','G','D','A','E']; // high to low
const FRET_DOTS = { 3:1, 5:1, 7:1, 9:1, 12:2, 15:1, 17:1, 19:1, 21:1, 24:2 };
const NUM_FRETS = 15;

export default function Fretboard({ root, formula, showLabels = 'interval', onFretClick }) {
  // result[0] = low E, result[5] = high e
  const notes = getFretboardNotes(root, formula, NUM_FRETS);
  // Reverse for display (high e on top)
  const displayStrings = [...notes].reverse();

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 760 }}>
        {/* Fret numbers */}
        <div className="flex ml-10 mb-1">
          <div className="w-6 shrink-0" /> {/* nut */}
          {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map(f => (
            <div
              key={f}
              className={`flex-1 text-center text-[10px] font-mono-data ${
                FRET_DOTS[f] ? 'text-primary font-bold' : 'text-surface-variant'
              }`}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Strings */}
        <div className="relative">
          {/* Fret position dots on fretboard (between strings 2-3) */}
          <div className="absolute inset-0 ml-[52px] flex pointer-events-none z-0">
            <div className="w-5 shrink-0" />
            {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map(f => (
              <div key={f} className="flex-1 flex flex-col justify-center items-center h-full">
                {FRET_DOTS[f] === 2 ? (
                  <><div className="w-2 h-2 rounded-full bg-surface-bright/30 mb-8" />
                    <div className="w-2 h-2 rounded-full bg-surface-bright/30 mt-8" /></>
                ) : FRET_DOTS[f] === 1 ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-surface-bright/25" />
                ) : null}
              </div>
            ))}
          </div>

          {displayStrings.map((stringNotes, si) => {
            const stringIdx = 5 - si; // 5=high e, 0=low E reversed
            const stringThickness = [1, 1.5, 2, 2.5, 3, 4][5 - si];
            return (
              <div key={si} className="flex items-center mb-0.5 relative z-10">
                {/* String name */}
                <div className="w-10 text-right pr-2 text-[11px] font-mono-data text-outline-variant shrink-0">
                  {STRING_NAMES_DISPLAY[si]}
                </div>

                {/* Nut */}
                <div className="w-5 bg-surface-bright border-r border-background shrink-0 flex items-center justify-center relative h-9">
                  <div style={{ height: stringThickness, width: '100%', backgroundColor: '#374151' }} />
                  {/* Open string note */}
                  {stringNotes[0].inScale && (
                    <div
                      className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono-data font-bold z-20 ${
                        stringNotes[0].isRoot
                          ? 'bg-primary text-on-primary shadow-[0_0_8px_rgba(4,129,255,0.6)]'
                          : 'bg-surface-container border-2 border-secondary text-secondary'
                      }`}
                      style={{ left: '-2px' }}
                    >
                      {showLabels === 'interval' ? stringNotes[0].intervalName : stringNotes[0].note}
                    </div>
                  )}
                </div>

                {/* Frets */}
                {Array.from({ length: NUM_FRETS }, (_, f) => {
                  const fret = f + 1;
                  const cell = stringNotes[fret];
                  return (
                    <div
                      key={fret}
                      className={`flex-1 border-r border-surface-variant/50 h-9 flex items-center justify-center relative ${
                        onFretClick ? 'cursor-pointer hover:bg-surface-variant/20' : ''
                      }`}
                      onClick={() => onFretClick?.(si, fret, cell)}
                    >
                      <div style={{ position: 'absolute', height: stringThickness, width: '100%', backgroundColor: '#374151', left: 0 }} />
                      {cell.inScale && (
                        <div
                          className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono-data font-bold transition-transform hover:scale-110 ${
                            cell.isRoot
                              ? 'bg-primary text-on-primary shadow-[0_0_10px_rgba(4,129,255,0.5)]'
                              : 'bg-surface-container border-2 border-secondary text-secondary shadow-[0_0_6px_rgba(164,201,255,0.3)]'
                          }`}
                        >
                          {showLabels === 'interval' ? cell.intervalName : cell.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
