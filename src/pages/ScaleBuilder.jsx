import { useState } from 'react';
import { NOTES, SCALE_FORMULAS, getScaleNotes, SCALE_FORMULA_DISPLAY } from '../lib/music';
import FretboardViz from '../components/Fretboard';

const ROOT_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SCALE_TYPES = Object.keys(SCALE_FORMULAS);
const VIEW_MODES = ['FULL','CAGED','3 NPS','SINGLE'];

const INTERVAL_DEGREE_KO = [
  '완전1도 (루트)','장2도','단2도','단3도',
  '장3도','완전4도','트라이톤','완전5도',
  '단6도','장6도','단7도','장7도',
];

export default function ScaleBuilder() {
  const [root, setRoot] = useState('G');
  const [scaleType, setScaleType] = useState('Major (Ionian)');
  const [viewMode, setViewMode] = useState('FULL');
  const [display, setDisplay] = useState('interval');

  const formula = SCALE_FORMULAS[scaleType] || SCALE_FORMULAS['Major (Ionian)'];
  const scaleNotes = getScaleNotes(root, scaleType);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 모바일 탭 */}
      <div className="md:hidden flex w-full bg-surface-container border-b border-outline-variant px-4 overflow-x-auto shrink-0">
        {['Dashboard','Scale Builder','Chord Builder'].map((item, i) => (
          <span
            key={i}
            className={`px-4 py-3 font-label-caps text-label-caps whitespace-nowrap ${
              i === 1 ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'
            }`}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 메인: 컨트롤 + 프렛보드 (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 페이지 제목 */}
            <div className="pb-4 border-b border-surface-variant">
              <h2 className="text-[26px] md:text-[32px] font-headline-lg text-primary tracking-tight">Scale Builder</h2>
              <p className="text-mono-data font-mono-data text-on-surface-variant mt-1">
                {root} {scaleType}
              </p>
            </div>

            {/* 컨트롤 */}
            <div className="bg-surface-container p-6 rounded-xl border border-surface-variant flex flex-col sm:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">루트음</label>
                <div className="relative">
                  <select
                    value={root}
                    onChange={e => setRoot(e.target.value)}
                    className="w-full bg-surface-container-low text-mono-data font-mono-data text-on-surface rounded-full p-3 appearance-none focus:outline-none transition-colors"
                  >
                    {ROOT_NOTES.map(n => <option key={n}>{n}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="flex-[2] w-full">
                <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">스케일 유형</label>
                <div className="relative">
                  <select
                    value={scaleType}
                    onChange={e => setScaleType(e.target.value)}
                    className="w-full bg-surface-container-low text-mono-data font-mono-data text-on-surface rounded-full p-3 appearance-none focus:outline-none transition-colors"
                  >
                    {SCALE_TYPES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 프렛보드 컨테이너 */}
            <div className="bg-surface-container rounded-xl border border-surface-variant overflow-hidden flex flex-col">
              <div className="p-4 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                <h2 className="text-label-caps font-label-caps text-on-surface-variant">프렛보드 뷰</h2>
                <div className="flex items-center gap-0.5 bg-surface p-1 rounded-full">
                  {VIEW_MODES.map(m => (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className={`px-3 py-1 text-label-caps font-label-caps rounded-full transition-colors text-sm ${
                        viewMode === m
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 overflow-x-auto bg-[#181a1b] min-h-[200px]">
                <FretboardViz root={root} formula={formula} showLabels={display} />
              </div>
              <div className="p-4 bg-surface-container-low border-t border-surface-variant flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-label-caps font-label-caps text-on-surface-variant">구성식:</span>
                  <span className="text-mono-data font-mono-data text-on-surface tracking-widest text-sm">
                    {SCALE_FORMULA_DISPLAY[scaleType]}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 bg-surface p-1 rounded-full">
                  {[['interval','음정'],['note','음이름']].map(([mode, label]) => (
                    <button
                      key={mode}
                      onClick={() => setDisplay(mode)}
                      className={`px-3 py-1 text-label-caps font-label-caps transition-colors rounded-full ${
                        display === mode ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 이론 패널 (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container rounded-xl border border-surface-variant flex flex-col shadow-sm">
              <div className="p-4 border-b border-surface-variant bg-surface-container-low flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_5px_rgba(164,201,255,0.8)]" />
                <h2 className="text-label-caps font-label-caps text-on-surface-variant">이론 데이터</h2>
              </div>
              <div className="p-5 flex flex-col gap-5">
                {/* 구성음 */}
                <div>
                  <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-3">구성음</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {scaleNotes.map((n, i) => (
                      <div
                        key={i}
                        className={`py-2 rounded-full text-center font-mono-data font-bold text-sm border ${
                          n.isRoot
                            ? 'bg-primary text-on-primary border-primary-container shadow-sm'
                            : 'bg-surface text-secondary border-surface-variant'
                        }`}
                      >
                        {n.note}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 음정 구성 */}
                <div>
                  <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-3">음정 구성</h3>
                  <div className="space-y-1">
                    {scaleNotes.map((n, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-surface-variant/50">
                        <span className={`text-mono-data font-mono-data text-sm ${n.isRoot ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                          {INTERVAL_DEGREE_KO[n.interval] ?? `${i+1}도`}
                        </span>
                        <span className={`text-mono-data font-mono-data text-sm font-bold ${n.isRoot ? 'text-primary' : 'text-secondary'}`}>
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
