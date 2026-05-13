import { useState, useEffect, useRef, useCallback } from 'react';

const TEMPO_OPTIONS = [
  { name: 'Grave',       bpm: 30,  range: '20–40'   },
  { name: 'Largo',       bpm: 50,  range: '40–60'   },
  { name: 'Larghetto',   bpm: 63,  range: '60–66'   },
  { name: 'Adagio',      bpm: 71,  range: '66–76'   },
  { name: 'Adagietto',   bpm: 75,  range: '70–80'   },
  { name: 'Andante',     bpm: 92,  range: '76–108'  },
  { name: 'Andantino',   bpm: 94,  range: '80–108'  },
  { name: 'Moderato',    bpm: 114, range: '108–120' },
  { name: 'Allegretto',  bpm: 116, range: '112–120' },
  { name: 'Allegro',     bpm: 144, range: '120–168' },
  { name: 'Vivace',      bpm: 172, range: '168–176' },
  { name: 'Presto',      bpm: 184, range: '168–200' },
  { name: 'Prestissimo', bpm: 210, range: '200+'    },
];

const NOTE_VALUES = [
  { id: 'q',  symbol: '♩',  label: '4분음표'      },
  { id: 'e',  symbol: '♫',  label: '8분음표'      },
  { id: 's',  symbol: '♬',  label: '16분음표'     },
  { id: 'qt', symbol: '³♩', label: '4분 셋잇단'   },
  { id: 'et', symbol: '³♫', label: '8분 셋잇단'   },
  { id: 'st', symbol: '³♬', label: '16분 셋잇단'  },
];

const TIME_SIGNATURES = [
  { label: '1/4',  beats: 1,  unit: 4 },
  { label: '2/4',  beats: 2,  unit: 4 },
  { label: '3/4',  beats: 3,  unit: 4 },
  { label: '4/4',  beats: 4,  unit: 4 },
  { label: '3/8',  beats: 3,  unit: 8 },
  { label: '6/8',  beats: 6,  unit: 8 },
  { label: '9/8',  beats: 9,  unit: 8 },
  { label: '12/8', beats: 12, unit: 8 },
];

function getTempoName(bpm) {
  return TEMPO_OPTIONS.reduce((a, b) =>
    Math.abs(b.bpm - bpm) < Math.abs(a.bpm - bpm) ? b : a
  ).name;
}

export default function Metronome() {
  const [bpm, setBpm] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [timeSig, setTimeSig] = useState(TIME_SIGNATURES[3]); // 4/4
  const [showTempoMenu, setShowTempoMenu] = useState(false);
  const [showTimeSigMenu, setShowTimeSigMenu] = useState(false);
  const [showNoteMenu, setShowNoteMenu] = useState(false);
  const [noteValue, setNoteValue] = useState(NOTE_VALUES[0]);
  const [isEditingBpm, setIsEditingBpm] = useState(false);
  const [bpmInput, setBpmInput] = useState('');

  const audioCtxRef = useRef(null);
  const nextBeatTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const schedulerRef = useRef(null);
  const bpmRef = useRef(bpm);
  const beatsRef = useRef(timeSig.beats);
  const tapTimesRef = useRef([]);
  const scheduledNodesRef = useRef([]);
  const generationRef = useRef(0);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { beatsRef.current = timeSig.beats; }, [timeSig]);

  const scheduleClick = useCallback((beatIndex, time) => {
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = beatIndex === 0 ? 1050 : 750;
    gain.gain.setValueAtTime(beatIndex === 0 ? 0.9 : 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    osc.start(time);
    osc.stop(time + 0.05);
    scheduledNodesRef.current.push(osc);
  }, []);

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gen = generationRef.current;
    while (nextBeatTimeRef.current < ctx.currentTime + 0.12) {
      const beat = currentBeatRef.current % beatsRef.current;
      scheduleClick(beat, nextBeatTimeRef.current);
      const delay = Math.max(0, (nextBeatTimeRef.current - ctx.currentTime) * 1000);
      const b = beat;
      setTimeout(() => {
        if (generationRef.current !== gen) return;
        setCurrentBeat(b);
      }, delay);
      nextBeatTimeRef.current += 60 / bpmRef.current;
      currentBeatRef.current++;
    }
  }, [scheduleClick]);

  const start = useCallback(() => {
    // 기존 interval이 남아있으면 반드시 먼저 정리
    clearInterval(schedulerRef.current);
    generationRef.current += 1;
    scheduledNodesRef.current.forEach(osc => {
      try { osc.stop(audioCtxRef.current?.currentTime ?? 0); } catch (_) {}
    });
    scheduledNodesRef.current = [];

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    currentBeatRef.current = 0;
    nextBeatTimeRef.current = ctx.currentTime + 0.05;
    schedulerRef.current = setInterval(scheduler, 25);
  }, [scheduler]);

  const stop = useCallback(() => {
    generationRef.current += 1;
    clearInterval(schedulerRef.current);
    const ctx = audioCtxRef.current;
    scheduledNodesRef.current.forEach(osc => {
      try { osc.stop(ctx?.currentTime ?? 0); } catch (_) {}
    });
    scheduledNodesRef.current = [];
    setCurrentBeat(-1);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying(prev => {
      if (prev) { stop(); return false; }
      else { start(); return true; }
    });
  }, [start, stop]);


  useEffect(() => () => clearInterval(schedulerRef.current), []);

  const adjustBpm = (delta) => {
    setBpm(prev => Math.max(20, Math.min(240, prev + delta)));
  };

  const startBpmEdit = () => {
    setBpmInput(String(bpm));
    setIsEditingBpm(true);
  };

  const commitBpmEdit = () => {
    const v = parseInt(bpmInput, 10);
    if (!isNaN(v)) setBpm(Math.max(20, Math.min(240, v)));
    setIsEditingBpm(false);
  };

  const handleBpmKeyDown = (e) => {
    if (e.key === 'Enter') commitBpmEdit();
    if (e.key === 'Escape') setIsEditingBpm(false);
  };

  const handleTap = () => {
    const now = Date.now();
    const recent = [...tapTimesRef.current, now].filter(t => now - t < 3000).slice(-8);
    tapTimesRef.current = recent;
    if (recent.length >= 2) {
      const intervals = recent.slice(1).map((t, i) => t - recent[i]);
      const avg = intervals.reduce((a, b) => a + b) / intervals.length;
      setBpm(Math.max(20, Math.min(240, Math.round(60000 / avg))));
    }
  };

  const selectTempo = (opt) => {
    setBpm(opt.bpm);
    setShowTempoMenu(false);
  };

  const selectTimeSig = (ts) => {
    setTimeSig(ts);
    setShowTimeSigMenu(false);
    if (isPlaying) {
      // beatsRef를 먼저 업데이트한 뒤 재시작
      beatsRef.current = ts.beats;
      start();
    }
  };

  const tempoName = getTempoName(bpm);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" onClick={() => { setShowTempoMenu(false); setShowTimeSigMenu(false); setShowNoteMenu(false); }}>
      {/* 비트 시각화 영역 */}
      <div className="flex-1 flex items-center justify-center bg-[#0e1010]">
        <div className="flex gap-6 flex-wrap justify-center px-4">
          {Array.from({ length: timeSig.beats }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center transition-all duration-75 shrink-0"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#0481FF',
                boxShadow: currentBeat === i ? '0 0 28px rgba(4,129,255,0.75)' : 'none',
                opacity: currentBeat === i ? 1 : 0.25,
              }}
            >
              {i === 0 && (
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: 'rgba(0,0,0,0.1)' }}
                >
                  expand_less
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 컨트롤 영역 */}
      <div className="bg-[#252828] border-t border-[#343737] shrink-0" onClick={e => e.stopPropagation()}>
        {/* BPM 조절 */}
        <div className="flex items-center justify-center gap-2 py-3 md:py-5 px-8">
          {/* −10 */}
          <button
            onClick={() => adjustBpm(-10)}
            className="text-[10px] text-white/50 flex items-center justify-center font-bold select-none transition-colors shrink-0"
            style={{ width: 29, height: 29, borderRadius: '50%', background: 'rgba(138,180,216,0.1)' }}
          >−10</button>

          {/* −1 */}
          <button
            onClick={() => adjustBpm(-1)}
            onMouseDown={e => { e.currentTarget._iv = setInterval(() => adjustBpm(-1), 80); }}
            onMouseUp={e => clearInterval(e.currentTarget._iv)}
            onMouseLeave={e => clearInterval(e.currentTarget._iv)}
            className="text-xl text-[#e2e2e2] hover:text-white flex items-center justify-center font-bold select-none transition-colors shrink-0"
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(138,180,216,0.1)' }}
          >−</button>

          {/* BPM 표시 / 직접 입력 */}
          <div className="flex items-center gap-2">
            <span className="text-[#6b7280] text-sm">{noteValue.symbol} =</span>
            {isEditingBpm ? (
              <input
                autoFocus
                type="number"
                value={bpmInput}
                onChange={e => setBpmInput(e.target.value)}
                onBlur={commitBpmEdit}
                onKeyDown={handleBpmKeyDown}
                className="text-[52px] md:text-[72px] font-bold text-on-surface leading-none w-32 md:w-40 text-center tabular-nums bg-transparent outline-none border-b-2 border-primary"
                style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
              />
            ) : (
              <span
                onClick={startBpmEdit}
                className="text-[52px] md:text-[72px] font-bold text-on-surface leading-none w-32 md:w-40 text-center tabular-nums cursor-text"
                title="클릭하여 직접 입력"
              >
                {bpm}
              </span>
            )}
            <span className="text-[#6b7280] text-sm">BPM</span>
          </div>

          {/* +1 */}
          <button
            onClick={() => adjustBpm(1)}
            onMouseDown={e => { e.currentTarget._iv = setInterval(() => adjustBpm(1), 80); }}
            onMouseUp={e => clearInterval(e.currentTarget._iv)}
            onMouseLeave={e => clearInterval(e.currentTarget._iv)}
            className="text-xl text-[#e2e2e2] hover:text-white flex items-center justify-center font-bold select-none transition-colors shrink-0"
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(138,180,216,0.1)' }}
          >+</button>

          {/* +10 */}
          <button
            onClick={() => adjustBpm(10)}
            className="text-[10px] text-white/50 flex items-center justify-center font-bold select-none transition-colors shrink-0"
            style={{ width: 29, height: 29, borderRadius: '50%', background: 'rgba(138,180,216,0.1)' }}
          >+10</button>
        </div>

        <div className="mx-8 h-px bg-[#343737]" />

        {/* 하단: 템포명 / 재생 / TAP */}
        <div className="relative flex items-center px-8 py-4" style={{ minHeight: 80 + 32 + 16 }}>
          {/* 템포명 + 박자 — 선택 가능 */}
          <div className="flex-1 flex flex-row items-center gap-3 relative">
            {/* 템포명 */}
            <button
              onClick={e => { e.stopPropagation(); setShowTempoMenu(p => !p); setShowTimeSigMenu(false); }}
              className="text-[#6b7280] text-sm hover:text-[#e2e2e2] transition-colors"
            >
              {tempoName}
            </button>

            <span className="text-[#444]">|</span>

            {/* 박자 */}
            <button
              onClick={e => { e.stopPropagation(); setShowTimeSigMenu(p => !p); setShowTempoMenu(false); }}
              className="text-[#6b7280] text-sm hover:text-[#e2e2e2] transition-colors"
            >
              {timeSig.label}
            </button>

            {/* 템포 선택 팝업 */}
            {showTempoMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1e2020] border border-[#343737] rounded-lg overflow-hidden shadow-xl z-20 w-56">
                {TEMPO_OPTIONS.map(opt => (
                  <button
                    key={opt.name}
                    onClick={() => selectTempo(opt)}
                    className={`w-full flex justify-between items-center px-4 py-2.5 text-left hover:bg-[#2e3131] transition-colors ${
                      tempoName === opt.name ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    <span className="text-base" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                      {opt.name}
                    </span>
                    <span className="text-mono-data font-mono-data text-xs text-outline">
                      {opt.range}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* 박자 선택 팝업 */}
            {showTimeSigMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1e2020] border border-[#343737] rounded-lg overflow-hidden shadow-xl z-20">
                <div className="flex flex-wrap gap-2 p-3">
                  {TIME_SIGNATURES.map(ts => (
                    <button
                      key={ts.label}
                      onClick={() => selectTimeSig(ts)}
                      className={`w-14 h-10 rounded border font-mono-data text-sm font-bold transition-colors ${
                        timeSig.label === ts.label
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-[#2e3131] border-[#343737] text-on-surface-variant hover:text-on-surface hover:border-outline'
                      }`}
                    >
                      {ts.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 재생 버튼 */}
          <button
            onClick={toggle}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 shrink-0 z-10"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: isPlaying ? '#0481FF' : '#343737',
              border: `2px solid ${isPlaying ? '#0481FF' : '#454848'}`,
              boxShadow: isPlaying ? '0 0 24px rgba(4,129,255,0.5)' : 'none',
            }}
          >
            <span
              className="material-symbols-outlined text-[36px] transition-colors"
              style={{
                fontVariationSettings: "'FILL' 1",
                color: isPlaying ? '#ffffff' : '#e0e0e0',
              }}
            >
              {isPlaying ? 'stop' : 'play_arrow'}
            </span>
          </button>

          <div className="flex-1 flex justify-end items-center gap-2 relative">
            <button
              onClick={handleTap}
              className="text-label-caps font-label-caps text-[#6b7280] hover:text-[#e2e2e2] transition-colors tracking-widest text-sm"
            >
              TAP
            </button>

            {/* 음표 선택 버튼 */}
            <button
              onClick={e => { e.stopPropagation(); setShowNoteMenu(p => !p); setShowTempoMenu(false); setShowTimeSigMenu(false); }}
              className="text-[#6b7280] hover:text-[#e2e2e2] transition-colors text-xl leading-none"
              style={{ fontFamily: 'serif' }}
            >
              {noteValue.symbol}
            </button>

            {/* 음표 선택 팝업 */}
            {showNoteMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-[#1e2020] border border-[#343737] rounded-lg shadow-xl z-20 p-3">
                <div className="grid grid-cols-3 gap-2">
                  {NOTE_VALUES.map(nv => (
                    <button
                      key={nv.id}
                      onClick={e => { e.stopPropagation(); setNoteValue(nv); setShowNoteMenu(false); }}
                      className="flex flex-col items-center justify-center gap-1 w-16 h-16 rounded border transition-colors"
                      style={{
                        backgroundColor: noteValue.id === nv.id ? 'rgba(4,129,255,0.15)' : '#2e3131',
                        borderColor: noteValue.id === nv.id ? '#0481FF' : '#343737',
                      }}
                    >
                      <span
                        className="text-2xl leading-none"
                        style={{
                          color: noteValue.id === nv.id ? '#0481FF' : '#a0a0a0',
                          fontFamily: 'serif',
                        }}
                      >
                        {nv.symbol}
                      </span>
                      <span className="text-[9px] text-outline font-mono-data">{nv.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
