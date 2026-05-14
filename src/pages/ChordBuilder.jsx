import { useState } from 'react';
import { NOTES, CHORD_FORMULAS, getChordNotes, CHORD_SYMBOL, CHORD_INTERVAL_DISPLAY, getFretboardNotes } from '../lib/music';

const ROOT_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const QUALITIES = Object.keys(CHORD_FORMULAS);
const STRING_NAMES = ['e','B','G','D','A','E'];

function ChordFretboard({ root, quality }) {
  const formula = CHORD_FORMULAS[quality] || CHORD_FORMULAS['Major'];
  const allNotes = getFretboardNotes(root, formula.map(i => i % 12), 12);
  const display = [...allNotes].reverse();

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 520 }}>
        <div className="flex ml-8 mb-1">
          <div className="w-4 shrink-0" />
          {['0','3','5','7','9','12'].map((f,i) => (
            <div key={i} className="flex-1 text-center text-[10px] font-mono-data text-outline-variant">{f}</div>
          ))}
        </div>
        {display.map((stringNotes, si) => {
          const thickness = [1,1.5,2,2.5,3,4][5-si];
          return (
            <div key={si} className="flex items-center mb-0.5">
              <div className="w-8 text-right pr-2 text-[11px] font-mono-data text-outline-variant shrink-0">
                {STRING_NAMES[si]}
              </div>
              <div className="flex-1 relative h-8 flex items-center">
                <div style={{ position:'absolute', height: thickness, width:'100%', backgroundColor:'#374151' }} />
                {[0,3,5,7,9,12].map((fret, fi) => {
                  const cell = stringNotes[fret];
                  if (!cell) return <div key={fi} className="flex-1" />;
                  return (
                    <div key={fi} className="flex-1 flex justify-center items-center relative z-10">
                      {cell.inScale && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono-data font-bold ${
                          cell.isRoot
                            ? 'bg-primary text-on-primary shadow-[0_0_8px_rgba(4,129,255,0.5)]'
                            : 'bg-surface-container border-2 border-secondary text-secondary'
                        }`}>
                          {cell.isRoot ? 'R' : cell.intervalName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChordBuilder() {
  const [root, setRoot] = useState('C');
  const [quality, setQuality] = useState('Major 7th');
  const [accidental, setAccidental] = useState('');
  const [ext7, setExt7] = useState(true);
  const [extTension, setExtTension] = useState(false);
  const [extSlash, setExtSlash] = useState(false);

  const actualRoot = accidental === '♭'
    ? NOTES[(NOTES.indexOf(root) - 1 + 12) % 12]
    : accidental === '♯'
    ? NOTES[(NOTES.indexOf(root) + 1) % 12]
    : root;

  const chordNotes = getChordNotes(actualRoot, quality);
  const symbol = CHORD_SYMBOL[quality] || quality;
  const chordName = `${actualRoot}${symbol}`;
  const intervalDisplay = CHORD_INTERVAL_DISPLAY[quality] || [];

  const Toggle = ({ label, active, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer group py-1">
      <span className={`text-mono-data font-mono-data text-sm transition-colors ${active ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
        {label}
      </span>
      <div
        onClick={onChange}
        className={`relative inline-flex items-center h-5 w-9 rounded-full border transition-colors ${
          active ? 'bg-surface-variant border-primary' : 'bg-surface-variant border-outline-variant'
        }`}
      >
        <span className={`inline-block w-3 h-3 rounded-full transition-transform ${
          active ? 'translate-x-5 bg-primary shadow-[0_0_6px_rgba(4,129,255,0.6)]' : 'translate-x-1 bg-on-surface-variant'
        }`} />
      </div>
    </label>
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 p-4 md:p-8 max-w-[1280px] w-full mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-surface-variant">
          <div>
            <h2 className="text-[26px] md:text-[32px] font-headline-lg text-primary tracking-tight">Chord Builder</h2>
            <p className="text-mono-data font-mono-data text-on-surface-variant mt-2 uppercase">
              {chordName} ({actualRoot} {quality})
            </p>
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="space-y-0 border border-surface-variant rounded-xl overflow-hidden">
          {/* 루트음 */}
          <div className="flex items-center px-4 py-2 border-b border-surface-variant">
            <span className="text-[11px] font-label-caps text-on-surface-variant shrink-0 w-14">Root</span>
            <div className="flex items-center overflow-x-auto min-w-0 flex-1" style={{ scrollbarWidth: 'none', gap: 'calc(var(--spacing) * 2)' }}>
              {ROOT_NOTES.map(n => (
                <button
                  key={n}
                  onClick={() => { setRoot(n); setAccidental(''); }}
                  className={`text-[14px] whitespace-nowrap shrink-0 transition-colors leading-none rounded-full px-2 py-1.5 ${
                    root === n && accidental === ''
                      ? 'bg-primary text-white font-bold'
                      : 'text-on-surface-variant hover:text-on-surface font-normal'
                  }`}
                >{n}</button>
              ))}
            </div>
          </div>
          {/* 코드 종류 */}
          <div className="flex items-center px-4 py-2">
            <span className="text-[11px] font-label-caps text-on-surface-variant shrink-0 w-14">Quality</span>
            <div className="flex items-center overflow-x-auto min-w-0 flex-1" style={{ scrollbarWidth: 'none', gap: 'calc(var(--spacing) * 2)' }}>
              {QUALITIES.map(q => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`text-[14px] whitespace-nowrap shrink-0 transition-colors leading-none rounded-full px-2 py-1.5 ${
                    quality === q
                      ? 'bg-primary text-white font-bold'
                      : 'text-on-surface-variant hover:text-on-surface font-normal'
                  }`}
                >{q}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 왼쪽: 컨트롤 (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 확장 및 변형 */}
            <div className="bg-surface-container p-6 rounded-xl border border-surface-variant space-y-3">
              <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-3">확장 및 변형</h3>
              <Toggle label="7화음 추가" active={ext7} onChange={() => setExt7(!ext7)} />
              <Toggle label="텐션 (9, 11, 13)" active={extTension} onChange={() => setExtTension(!extTension)} />
              <Toggle label="슬래시 코드 (전위형)" active={extSlash} onChange={() => setExtSlash(!extSlash)} />
            </div>
          </div>

          {/* 오른쪽: 프렛보드 + 구성 분석 (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 프렛보드 */}
            <div className="bg-surface-container rounded-xl border border-surface-variant overflow-hidden flex flex-col">
              <div className="p-4 border-b border-surface-variant bg-surface-container-high flex justify-between items-center">
                <h3 className="text-label-caps font-label-caps text-on-surface-variant">프렛보드 맵</h3>
                <div className="flex gap-4 text-[11px] font-mono-data">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary block" /> 루트
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-secondary bg-surface-variant block" /> 음정
                  </span>
                </div>
              </div>
              <div className="p-6 bg-surface">
                <ChordFretboard root={actualRoot} quality={quality} />
              </div>
            </div>

            {/* 구성 분석 */}
            <div className="bg-surface-container p-6 rounded-xl border border-surface-variant relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2 bg-surface-variant rounded border border-outline-variant shrink-0 mt-1">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                </div>
                <div>
                  <h4 className="text-mono-data font-mono-data text-on-surface font-semibold mb-2 uppercase tracking-wide text-sm">
                    구성 분석: {chordName}
                  </h4>
                  <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed text-sm">
                    {chordName}은(는){' '}
                    {chordNotes.map((n, i) => (
                      <span key={i}>
                        <span className="text-secondary font-mono-data">{n.intervalName}</span>
                        {i < chordNotes.length - 1 ? ', ' : ''}
                      </span>
                    ))}{' '}
                    음정으로 구성됩니다.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {chordNotes.map((n, i) => (
                      <div key={i} className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded border border-surface-variant">
                        <span className="text-[10px] font-label-caps text-outline-variant">
                          {intervalDisplay[i]?.label ?? n.intervalName.toUpperCase()}
                        </span>
                        <span className={`text-mono-data font-mono-data font-bold text-sm ${n.isRoot ? 'text-primary' : 'text-secondary'}`}>
                          {n.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
