import { useState } from 'react';

const STRING_SETS = ['4-3-2-1','5-4-3-2','6-5-4-3','Any'];
const VOICING_TYPES = ['Drop 2','Drop 3','Close','Shell'];

const DIFFICULTY_KO = { EASY: '쉬움', MED: '보통', HARD: '어려움' };

const VOICING_DATA = {
  D7: [
    { id:1, name:'D7 Root Inv', formula:'1-5-b7-3', fingers:'1-3-4-2', fret:5, difficulty:'EASY',
      markers:[{string:1,pos:0.2,label:'5'},{string:2,pos:0.6,label:'3'},{string:3,pos:0.4,label:'b7'},{string:4,pos:0.8,label:'1',isRoot:true}] },
    { id:2, name:'D7 1st Inv', formula:'3-b7-1-5', fingers:'2-1-4-3', fret:4, difficulty:'MED',
      markers:[{string:1,pos:0.2,label:'3'},{string:2,pos:0.8,label:'5'},{string:3,pos:0.6,label:'b7'},{string:4,pos:0.4,label:'1',isRoot:true}] },
    { id:3, name:'D7 2nd Inv', formula:'b7-3-5-1', fingers:'1-2-3-4', fret:7, difficulty:'MED',
      markers:[{string:1,pos:0.6,label:'b7'},{string:2,pos:0.2,label:'1',isRoot:true},{string:3,pos:0.8,label:'3'},{string:4,pos:0.4,label:'5'}] },
    { id:4, name:'D7 Shell', formula:'1-3-b7', fingers:'1-2-4', fret:3, difficulty:'EASY',
      markers:[{string:1,pos:0.3,label:'3'},{string:2,pos:0.7,label:'b7'},{string:4,pos:0.5,label:'1',isRoot:true}] },
  ],
  Cmaj7: [
    { id:1, name:'Cmaj7 Drop2', formula:'1-5-7-3', fingers:'1-3-4-2', fret:3, difficulty:'MED',
      markers:[{string:1,pos:0.2,label:'7'},{string:2,pos:0.5,label:'3'},{string:3,pos:0.7,label:'5'},{string:4,pos:0.9,label:'1',isRoot:true}] },
    { id:2, name:'Cmaj7 Shell', formula:'1-3-7', fingers:'1-2-4', fret:3, difficulty:'EASY',
      markers:[{string:1,pos:0.3,label:'3'},{string:2,pos:0.7,label:'7'},{string:3,pos:0.5,label:'1',isRoot:true}] },
  ],
  Am7: [
    { id:1, name:'Am7 Drop2', formula:'1-5-b7-b3', fingers:'1-2-3-4', fret:5, difficulty:'MED',
      markers:[{string:1,pos:0.2,label:'b3'},{string:2,pos:0.6,label:'b7'},{string:3,pos:0.4,label:'5'},{string:4,pos:0.8,label:'1',isRoot:true}] },
  ],
};

function VoicingCard({ voicing }) {
  return (
    <div className="bg-surface-container border border-surface-variant rounded flex flex-col group hover:border-outline transition-colors duration-200">
      <div className="p-4 border-b border-surface-variant flex justify-between items-start">
        <div>
          <h3 className="text-headline-md font-headline-md text-on-surface text-base">{voicing.name}</h3>
          <p className="text-mono-data font-mono-data text-secondary mt-1 text-sm">{voicing.formula}</p>
        </div>
        <div className={`w-2 h-2 rounded-full mt-2 ${voicing.difficulty === 'EASY' ? 'bg-primary' : 'bg-surface-bright'}`} />
      </div>

      {/* 미니 프렛보드 다이어그램 */}
      <div className="p-4 flex-grow flex items-center justify-center bg-surface relative min-h-[160px]">
        <div className="w-full h-36 relative">
          {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
            <div key={i} className="absolute w-full" style={{ top: `${pos*100}%`, height: 1, backgroundColor: '#374151' }} />
          ))}
          {[20, 40, 60, 80].map((pct, i) => (
            <div key={i} className="absolute h-full" style={{ left: `${pct}%`, width: 1, backgroundColor: '#333535' }} />
          ))}
          <div className="absolute -left-5 top-[20%] text-[10px] font-mono-data text-on-surface-variant">{voicing.fret}</div>
          {voicing.markers.map((m, i) => (
            <div
              key={i}
              className={`absolute w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 text-[10px] font-mono-data font-bold ${
                m.isRoot
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface border-secondary text-secondary'
              }`}
              style={{
                left: `${m.pos * 100}%`,
                top: `${[0.2,0.4,0.6,0.8][m.string - 1] * 100 - 8}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-surface-container-low flex justify-between items-center border-t border-surface-variant">
        <div>
          <div className="text-[10px] font-label-caps text-on-surface-variant">운지</div>
          <div className="text-mono-data font-mono-data text-on-surface text-sm">{voicing.fingers}</div>
        </div>
        <div className="px-2 py-1 border border-outline-variant rounded bg-surface text-on-surface-variant text-[10px] font-label-caps">
          {DIFFICULTY_KO[voicing.difficulty] ?? voicing.difficulty}
        </div>
      </div>
    </div>
  );
}

export default function VoicingFinder() {
  const [chordInput, setChordInput] = useState('D7');
  const [fretMin, setFretMin] = useState(5);
  const [fretMax, setFretMax] = useState(8);
  const [stringSet, setStringSet] = useState('4-3-2-1');
  const [voicingType, setVoicingType] = useState('Drop 2');
  const [viewMode, setViewMode] = useState('grid');
  const [query, setQuery] = useState('D7');

  const voicings = VOICING_DATA[query] || [];

  const handleApply = () => {
    const key = Object.keys(VOICING_DATA).find(k =>
      k.toLowerCase() === chordInput.toLowerCase()
    );
    setQuery(key || chordInput.replace(/\s/g,''));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* 필터 패널 */}
      <section className="bg-surface-container border-b border-surface-variant p-4 md:p-8 shrink-0">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-[26px] md:text-[32px] font-headline-lg text-on-surface mb-1">Voicing Finder</h1>
              <p className="text-mono-data font-mono-data text-on-surface-variant text-sm">
                검색: {query} | {voicingType} | 현 {stringSet}
              </p>
            </div>
            <div className="hidden md:flex gap-4">
              <button
                onClick={() => { setChordInput('D7'); setQuery('D7'); }}
                className="px-4 py-2 bg-surface-variant border border-outline-variant rounded hover:border-primary text-on-surface text-label-caps font-label-caps transition-colors"
              >
                초기화
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-primary text-on-primary rounded text-label-caps font-label-caps font-bold hover:bg-primary-fixed transition-colors shadow-[0_0_8px_rgba(4,129,255,0.2)]"
              >
                필터 적용
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">코드</label>
              <input
                type="text"
                value={chordInput}
                onChange={e => setChordInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleApply()}
                placeholder="예: D7, Cmaj7, Am7"
                className="w-full bg-surface rounded-full px-4 py-2 text-on-surface font-mono-data text-sm focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">프렛 범위</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" max="24" value={fretMin} onChange={e => setFretMin(+e.target.value)}
                  className="w-full bg-surface rounded-full px-3 py-2 text-on-surface font-mono-data text-sm text-center outline-none" />
                <span className="text-on-surface-variant">-</span>
                <input type="number" min="0" max="24" value={fretMax} onChange={e => setFretMax(+e.target.value)}
                  className="w-full bg-surface rounded-full px-3 py-2 text-on-surface font-mono-data text-sm text-center outline-none" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">현 조합</label>
              <select value={stringSet} onChange={e => setStringSet(e.target.value)}
                className="w-full bg-surface rounded-full px-4 py-2 text-on-surface font-mono-data text-sm outline-none appearance-none">
                {STRING_SETS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant">보이싱 유형</label>
              <select value={voicingType} onChange={e => setVoicingType(e.target.value)}
                className="w-full bg-surface rounded-full px-4 py-2 text-on-surface font-mono-data text-sm outline-none appearance-none">
                {VOICING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="md:hidden flex gap-4">
            <button onClick={() => { setChordInput('D7'); setQuery('D7'); }}
              className="flex-1 py-3 bg-surface-variant border border-outline-variant rounded text-on-surface text-label-caps font-label-caps">초기화</button>
            <button onClick={handleApply}
              className="flex-1 py-3 bg-primary text-on-primary rounded text-label-caps font-label-caps font-bold">필터 적용</button>
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className="flex-grow overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-mono-data font-mono-data text-on-surface-variant text-sm">
              {voicings.length > 0
                ? `${voicings.length}개 보이싱 검색됨`
                : `결과 없음 — "D7", "Cmaj7", "Am7" 로 시도해 보세요`}
            </span>
            <div className="flex gap-2">
              {['grid','list'].map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === m
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {m === 'grid' ? 'grid_view' : 'view_list'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {voicings.length > 0 ? (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-3'
            }>
              {voicings.map(v => (
                viewMode === 'grid'
                  ? <VoicingCard key={v.id} voicing={v} />
                  : (
                    <div key={v.id} className="bg-surface-container border border-surface-variant rounded p-4 flex items-center justify-between hover:border-outline transition-colors">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-mono-data font-mono-data text-on-surface font-semibold">{v.name}</div>
                          <div className="text-[11px] font-mono-data text-secondary">{v.formula}</div>
                        </div>
                        <div className="hidden md:block">
                          <div className="text-[10px] text-on-surface-variant font-label-caps">운지</div>
                          <div className="text-mono-data text-sm text-on-surface">{v.fingers}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-label-caps text-mono-data text-on-surface-variant">{v.fret}번 프렛</span>
                        <span className="px-2 py-1 border border-outline-variant rounded text-[10px] font-label-caps text-on-surface-variant">
                          {DIFFICULTY_KO[v.difficulty] ?? v.difficulty}
                        </span>
                      </div>
                    </div>
                  )
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-4 block">search</span>
              <p className="text-mono-data font-mono-data">보이싱을 찾을 수 없습니다. 다른 코드 이름을 입력해 보세요.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
