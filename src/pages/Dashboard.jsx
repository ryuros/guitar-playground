import { useNavigate } from 'react-router-dom';

const PRACTICE_DAYS = [
  { day: '월', pct: 30 },
  { day: '화', pct: 45 },
  { day: '수', pct: 25 },
  { day: '목', pct: 60 },
  { day: '금', pct: 50 },
  { day: '토', pct: 85, today: true },
  { day: '일', pct: 0 },
];

const SUGGESTIONS = [
  { title: '6도 음정 전체 찾기', context: '조성: F MAJOR • INTERVALS', to: '/fretboard' },
  { title: 'ii-V-I 아르페지오 연주', context: '조성: G MAJOR • CHORDS', to: '/chords' },
  { title: 'G Major Pentatonic 연습', context: 'SCALE: PENTATONIC', to: '/scales' },
];

const SAVED_SCALES = ['A Mixolydian', 'G# Locrian', 'C Major Pentatonic'];
const SAVED_VOICINGS = [
  { name: 'E7#9', tag: 'JAZZ' },
  { name: 'Bbmaj13', tag: 'EXT' },
  { name: 'Dm9', tag: 'JAZZ' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="flex-1 p-4 md:p-8 max-w-[1280px] mx-auto w-full space-y-6">
        {/* 벤토 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* 현재 세션 (span 8) */}
          <div className="md:col-span-8 bg-surface-container-high border border-surface-variant rounded-lg p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-label-caps font-label-caps text-secondary flex items-center space-x-2 mb-2">
                  <span className="indicator-on" />
                  <span>현재 세션</span>
                </span>
                <h3 className="text-headline-md font-headline-md text-on-surface">C Major Pentatonic</h3>
                <p className="text-mono-data font-mono-data text-on-surface-variant mt-1">포지션 2 • A 줄 루트</p>
              </div>
              <button
                onClick={() => navigate('/scales')}
                className="bg-primary text-on-primary w-12 h-12 rounded flex items-center justify-center hover:bg-primary-container transition-colors shadow-[0_0_15px_rgba(4,129,255,0.2)]"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>

            {/* 미니 프렛보드 */}
            <div className="bg-surface border border-outline-variant h-20 rounded overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col justify-evenly py-2">
                {[1,1,2,2,3,3].map((h,i) => (
                  <div key={i} style={{ height: h, backgroundColor: '#444', width: '100%' }} />
                ))}
              </div>
              <div className="absolute inset-0 flex justify-evenly">
                {[...Array(5)].map((_,i) => (
                  <div key={i} className="h-full w-px bg-outline-variant" />
                ))}
              </div>
              <div className="absolute top-[20%] left-[22%] w-6 h-6 bg-primary rounded-full border border-surface flex items-center justify-center shadow-[0_0_12px_rgba(4,129,255,0.7)] z-10">
                <span className="text-[10px] text-on-primary font-bold">C</span>
              </div>
              <div className="absolute top-[48%] left-[42%] w-5 h-5 bg-surface border-2 border-secondary rounded-full z-10" />
              <div className="absolute top-[68%] left-[62%] w-5 h-5 bg-surface border-2 border-secondary rounded-full z-10" />
            </div>
          </div>

          {/* 추천 연습 (span 4) */}
          <div className="md:col-span-4 bg-surface-container border border-surface-variant rounded-lg p-6 flex flex-col">
            <span className="text-label-caps font-label-caps text-on-surface-variant border-b border-surface-variant pb-2 mb-4 block">추천 연습</span>
            <div className="flex-1 space-y-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => navigate(s.to)}
                  className="w-full text-left p-3 bg-surface border border-outline-variant rounded hover:border-secondary transition-colors group"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-mono-data font-mono-data text-on-surface group-hover:text-secondary transition-colors">{s.title}</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
                  </div>
                  <p className="text-[10px] font-label-caps text-on-surface-variant opacity-70">{s.context}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 저장 목록 */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low border border-surface-variant rounded p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-label-caps font-label-caps text-on-surface-variant">저장된 스케일</h4>
                <button onClick={() => navigate('/scales')} className="text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAVED_SCALES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => navigate('/scales')}
                    className="bg-surface border border-outline-variant px-3 py-2 rounded flex items-center space-x-2 hover:border-secondary transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-mono-data font-mono-data text-on-surface text-sm">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low border border-surface-variant rounded p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-label-caps font-label-caps text-on-surface-variant">저장된 보이싱</h4>
                <button onClick={() => navigate('/voicings')} className="text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAVED_VOICINGS.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => navigate('/voicings')}
                    className="bg-surface border border-outline-variant px-3 py-2 rounded flex items-center space-x-2 hover:border-secondary transition-colors"
                  >
                    <span className="text-mono-data font-mono-data text-on-surface text-sm">{v.name}</span>
                    <span className="text-[10px] font-label-caps text-outline px-1 bg-surface-variant rounded">{v.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 진도 차트 */}
          <div className="md:col-span-12 bg-surface-container border border-surface-variant rounded p-6">
            <div className="flex justify-between items-center border-b border-surface-variant pb-4 mb-4">
              <h4 className="text-label-caps font-label-caps text-on-surface-variant">학습 진도 기록</h4>
              <span className="text-mono-data font-mono-data text-secondary text-sm">주간 변화량: +4%</span>
            </div>
            <div className="h-32 flex items-end justify-between space-x-2 px-2">
              {PRACTICE_DAYS.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t transition-all ${d.today ? 'shadow-[0_0_10px_rgba(4,129,255,0.2)]' : ''}`}
                    style={{
                      height: `${d.pct}%`,
                      backgroundColor: d.today ? '#0481FF' : `rgba(4,129,255,${d.pct / 200 + 0.05})`,
                    }}
                  />
                  <span className={`text-[10px] font-label-caps ${d.today ? 'text-primary' : 'text-outline-variant'}`}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
