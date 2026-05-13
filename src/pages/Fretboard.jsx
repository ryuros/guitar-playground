import { useState } from 'react';
import { NOTES, SCALE_FORMULAS, getScaleNotes, SCALE_FORMULA_DISPLAY } from '../lib/music';
import FretboardViz from '../components/Fretboard';

const ROOT_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SCALE_TYPES = Object.keys(SCALE_FORMULAS);

const DEGREE_NAMES = ['루트','2도','3도','4도','5도','6도','7도'];

const PRACTICE_PROMPTS = [
  '저음 E 줄에서 시작하는 장3도(Major 3rd) 음정을 모두 찾아보세요.',
  '스케일을 3도 간격으로 오르내리며 연주해 보세요.',
  '전체 프렛보드에서 루트음을 모두 찾아보세요.',
  '포지션 2에서 A 줄 루트를 기준으로 스케일 전체를 연주하세요.',
  '포지션 1에서 포지션 2로 자연스럽게 연결해 보세요.',
];

export default function Fretboard() {
  const [root, setRoot] = useState('G');
  const [scale, setScale] = useState('Major (Ionian)');
  const [display, setDisplay] = useState('interval');
  const [promptIdx, setPromptIdx] = useState(0);

  const formula = SCALE_FORMULAS[scale];
  const scaleNotes = getScaleNotes(root, scale);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* 왼쪽: 프렛보드 */}
        <div className="flex-1 flex flex-col min-w-0 space-y-4">
          {/* 컨트롤 바 */}
          <div className="bg-surface-container rounded-lg border border-surface-variant p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-label-caps font-label-caps text-on-surface-variant">루트:</span>
              <select
                value={root}
                onChange={e => setRoot(e.target.value)}
                className="bg-surface border border-surface-variant rounded px-2 py-1 text-mono-data font-mono-data text-primary font-bold focus:border-primary outline-none"
              >
                {ROOT_NOTES.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="w-px h-6 bg-surface-variant" />
            <div className="flex items-center space-x-2">
              <span className="text-label-caps font-label-caps text-on-surface-variant">스케일:</span>
              <select
                value={scale}
                onChange={e => setScale(e.target.value)}
                className="bg-surface border border-surface-variant rounded px-2 py-1 text-mono-data font-mono-data text-on-surface focus:border-primary outline-none"
              >
                {SCALE_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="w-px h-6 bg-surface-variant hidden sm:block" />
            <div className="flex items-center space-x-2 hidden sm:flex">
              <span className="text-label-caps font-label-caps text-on-surface-variant">튜닝:</span>
              <span className="text-mono-data font-mono-data text-outline text-sm">Standard E</span>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-label-caps font-label-caps text-on-surface-variant">표시:</span>
              <div className="flex bg-surface rounded border border-surface-variant overflow-hidden">
                {[['interval','음정'],['note','음이름']].map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setDisplay(mode)}
                    className={`px-3 py-1 text-label-caps font-label-caps transition-colors ${
                      display === mode
                        ? 'bg-surface-variant text-on-surface'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 프렛보드 */}
          <div className="flex-1 bg-surface-container rounded-lg border border-surface-variant p-4 flex flex-col overflow-hidden">
            <div className="text-label-caps font-label-caps text-on-surface-variant mb-3">프렛보드 시각화</div>
            <div className="flex-1 overflow-auto">
              <FretboardViz root={root} formula={formula} showLabels={display} />
            </div>
          </div>

          {/* 연습 과제 */}
          <div className="bg-surface-container-high rounded-lg border-l-4 border-primary p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="material-symbols-outlined text-primary mt-0.5">assignment</span>
                <div>
                  <h3 className="text-label-caps font-label-caps text-primary mb-1">연습 과제</h3>
                  <p className="text-mono-data font-mono-data text-on-surface">{PRACTICE_PROMPTS[promptIdx]}</p>
                </div>
              </div>
              <button
                onClick={() => setPromptIdx((promptIdx + 1) % PRACTICE_PROMPTS.length)}
                className="text-on-surface-variant hover:text-primary transition-colors ml-4 shrink-0"
                title="다음 과제"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 이론 패널 */}
        <div className="w-full lg:w-72 bg-surface-container rounded-lg border border-surface-variant p-5 flex flex-col shrink-0 overflow-y-auto">
          <div className="border-b border-surface-variant pb-4 mb-4">
            <h2 className="text-label-caps font-label-caps text-on-surface tracking-widest">스케일 이론</h2>
            <p className="text-headline-md font-headline-md text-primary mt-1">{root} {scale.split(' ')[0]}</p>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-outline font-label-caps tracking-widest block mb-2">구성식</span>
              <div className="flex flex-wrap gap-1 bg-surface p-2 rounded border border-surface-variant">
                {scaleNotes.map((n, i) => (
                  <span key={i} className={`text-mono-data font-mono-data text-sm font-bold ${n.isRoot ? 'text-primary' : 'text-secondary'}`}>
                    {n.intervalName}{i < scaleNotes.length - 1 ? <span className="text-outline-variant mx-1">-</span> : null}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-outline font-label-caps tracking-widest block mb-2">구성음</span>
              <div className="flex flex-wrap gap-1 p-2">
                {scaleNotes.map((n, i) => (
                  <span key={i} className={`text-mono-data font-mono-data text-sm ${n.isRoot ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                    {n.note}{i < scaleNotes.length - 1 && <span className="text-outline-variant mx-1">,</span>}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-outline font-label-caps tracking-widest block mb-2">음정 공식</span>
              <p className="text-mono-data font-mono-data text-on-surface-variant text-sm">
                {SCALE_FORMULA_DISPLAY[scale]}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-outline font-label-caps tracking-widest block mb-2">음계 단계</span>
              <div className="space-y-1">
                {scaleNotes.map((n, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-surface-variant/50">
                    <span className={`text-mono-data font-mono-data text-sm ${n.isRoot ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                      {DEGREE_NAMES[i] ?? `${i+1}도`}
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
  );
}
