import { useState, useEffect, useRef, useCallback } from 'react';
import NoteIcon from '../components/NoteIcon';

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
  { id: 'q',  label: '4',         mult: 1,   sub: 1, accent: [0]    },
  { id: 'e',  label: '8',         mult: 1/2, sub: 2, accent: [0]    },
  { id: 'et', label: '8T',        mult: 1/3, sub: 3, accent: [0]    },
  { id: 'qt', label: '4T',        mult: 2/3, sub: 3, accent: [0]    },
  { id: 's',  label: '16',        mult: 1/4, sub: 4, accent: [0]    },
  { id: 'st', label: '16Pattern', mult: 1/4, sub: 4, accent: [0, 2] },
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

// ── Drum patterns (16-step 16th-note grid, 4/4) ─────────────────────────────
const DRUM_PATTERNS = [
  {
    id: 'rock', label: 'Rock',
    kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    open:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
  },
  {
    id: 'funk', label: 'Funk',
    kick:  [1,0,0,1, 0,0,1,0, 1,0,0,0, 0,1,0,0],
    snare: [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0],
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    open:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
  },
  {
    id: 'jazz', label: 'Jazz',
    kick:  [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    hihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    ride:  [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,1,0,0],
    open:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  {
    id: 'bossa', label: 'Bossa',
    kick:  [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    snare: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    open:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
];

function synthKick(ctx, time, masterGain) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g); g.connect(masterGain);
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
  g.gain.setValueAtTime(1.2, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
  osc.start(time); osc.stop(time + 0.3);
}

function synthSnare(ctx, time, masterGain) {
  const len = Math.floor(ctx.sampleRate * 0.2);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = 'bandpass'; flt.frequency.value = 2500; flt.Q.value = 0.7;
  const g = ctx.createGain();
  src.connect(flt); flt.connect(g); g.connect(masterGain);
  g.gain.setValueAtTime(0.9, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  src.start(time); src.stop(time + 0.2);
}

function synthHihat(ctx, time, masterGain, open = false) {
  const dur = open ? 0.35 : 0.06;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = 'highpass'; flt.frequency.value = 8000;
  const g = ctx.createGain();
  src.connect(flt); flt.connect(g); g.connect(masterGain);
  g.gain.setValueAtTime(open ? 0.25 : 0.2, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + dur);
  src.start(time); src.stop(time + dur);
}

function synthRide(ctx, time, masterGain) {
  const len = Math.floor(ctx.sampleRate * 0.5);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = 'bandpass'; flt.frequency.value = 6000; flt.Q.value = 2;
  const g = ctx.createGain();
  src.connect(flt); flt.connect(g); g.connect(masterGain);
  g.gain.setValueAtTime(0.18, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
  src.start(time); src.stop(time + 0.5);
}

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
  const [backingOn, setBackingOn] = useState(false);
  const [drumPattern, setDrumPattern] = useState(DRUM_PATTERNS[0]);
  const [drumVolume, setDrumVolume] = useState(0.7);

  const audioCtxRef = useRef(null);
  const nextBeatTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const schedulerRef = useRef(null);
  const bpmRef = useRef(bpm);
  const beatsRef = useRef(timeSig.beats);
  const noteValueRef = useRef(noteValue);
  const tapTimesRef = useRef([]);
  const scheduledNodesRef = useRef([]);
  const generationRef = useRef(0);
  const drumPosRef = useRef(0);
  const nextDrumTimeRef = useRef(0);
  const drumSchedulerRef = useRef(null);
  const drumGainRef = useRef(null);
  const backingOnRef = useRef(false);
  const drumPatternRef = useRef(DRUM_PATTERNS[0]);
  const drumVolumeRef = useRef(0.7);
  const isPlayingRef = useRef(false);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => {
    bpmRef.current = bpm;
    if (isPlayingRef.current) start();
  }, [bpm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { beatsRef.current = timeSig.beats; }, [timeSig]);
  useEffect(() => { noteValueRef.current = noteValue; }, [noteValue]);
  useEffect(() => { backingOnRef.current = backingOn; }, [backingOn]);
  useEffect(() => { drumPatternRef.current = drumPattern; }, [drumPattern]);
  useEffect(() => {
    drumVolumeRef.current = drumVolume;
    if (drumGainRef.current) drumGainRef.current.gain.value = drumVolume;
  }, [drumVolume]);

  const scheduleClick = useCallback((type, time) => {
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'downbeat') {
      osc.frequency.value = 1050;
      gain.gain.setValueAtTime(0.9, time);
    } else if (type === 'beat') {
      osc.frequency.value = 750;
      gain.gain.setValueAtTime(0.6, time);
    } else {
      osc.frequency.value = 600;
      gain.gain.setValueAtTime(0.25, time);
    }
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    osc.start(time);
    osc.stop(time + 0.05);
    scheduledNodesRef.current.push(osc);
  }, []);

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    const gen = generationRef.current;
    while (nextBeatTimeRef.current < ctx.currentTime + 0.12) {
      const nv = noteValueRef.current;
      const subIndex = currentBeatRef.current % nv.sub;
      const beatIndex = Math.floor(currentBeatRef.current / nv.sub) % beatsRef.current;
      const isOnBeat = subIndex === 0;
      const isAccented = nv.accent.includes(subIndex);
      const type = isOnBeat
        ? (beatIndex === 0 ? 'downbeat' : 'beat')
        : isAccented ? 'beat' : 'sub';
      scheduleClick(type, nextBeatTimeRef.current);
      if (isOnBeat) {
        const delay = Math.max(0, (nextBeatTimeRef.current - ctx.currentTime) * 1000);
        const b = beatIndex;
        setTimeout(() => {
          if (generationRef.current !== gen) return;
          setCurrentBeat(b);
        }, delay);
      }
      nextBeatTimeRef.current += (60 / bpmRef.current) * nv.mult;
      currentBeatRef.current++;
    }
  }, [scheduleClick]);

  const drumScheduler = useCallback(() => {
    if (!backingOnRef.current) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const interval = (60 / bpmRef.current) * (1 / 4); // 16th note
    while (nextDrumTimeRef.current < ctx.currentTime + 0.12) {
      const pos = drumPosRef.current % 16;
      const pat = drumPatternRef.current;
      const mg = drumGainRef.current;
      if (!mg) break;
      if (pat.kick?.[pos])  synthKick(ctx, nextDrumTimeRef.current, mg);
      if (pat.snare?.[pos]) synthSnare(ctx, nextDrumTimeRef.current, mg);
      if (pat.hihat?.[pos]) synthHihat(ctx, nextDrumTimeRef.current, mg, !!pat.open?.[pos]);
      if (pat.ride?.[pos])  synthRide(ctx, nextDrumTimeRef.current, mg);
      nextDrumTimeRef.current += interval;
      drumPosRef.current++;
    }
  }, []);

  const startDrum = useCallback(() => {
    clearInterval(drumSchedulerRef.current);
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (!drumGainRef.current) {
      const g = ctx.createGain();
      g.gain.value = drumVolumeRef.current;
      g.connect(ctx.destination);
      drumGainRef.current = g;
    }
    drumPosRef.current = 0;
    nextDrumTimeRef.current = ctx.currentTime + 0.05;
    drumSchedulerRef.current = setInterval(drumScheduler, 25);
  }, [drumScheduler]);

  const stopDrum = useCallback(() => {
    clearInterval(drumSchedulerRef.current);
  }, []);

  const start = useCallback(() => {
    clearInterval(schedulerRef.current);
    generationRef.current += 1;
    scheduledNodesRef.current.forEach(osc => {
      try { osc.stop(audioCtxRef.current?.currentTime ?? 0); } catch (_) {}
    });
    scheduledNodesRef.current = [];

    const ctx = audioCtxRef.current;
    currentBeatRef.current = 0;
    nextBeatTimeRef.current = ctx.currentTime + 0.05;
    schedulerRef.current = setInterval(scheduler, 25);
    if (backingOnRef.current) startDrum();
  }, [scheduler, startDrum]);

  const stop = useCallback(() => {
    generationRef.current += 1;
    clearInterval(schedulerRef.current);
    stopDrum();
    const ctx = audioCtxRef.current;
    scheduledNodesRef.current.forEach(osc => {
      try { osc.stop(ctx?.currentTime ?? 0); } catch (_) {}
    });
    scheduledNodesRef.current = [];
    setCurrentBeat(-1);
  }, []);

  const toggle = useCallback(() => {
    // iOS Safari: AudioContext must be created/resumed synchronously in user gesture
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    setIsPlaying(prev => {
      if (prev) { stop(); return false; }
      else { start(); return true; }
    });
  }, [start, stop]);


  useEffect(() => () => { clearInterval(schedulerRef.current); clearInterval(drumSchedulerRef.current); }, []);

  const toggleBacking = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    if (!drumGainRef.current) {
      const g = ctx.createGain();
      g.gain.value = drumVolumeRef.current;
      g.connect(ctx.destination);
      drumGainRef.current = g;
    }
    setBackingOn(prev => {
      const next = !prev;
      backingOnRef.current = next;
      if (next && isPlaying) startDrum();
      else stopDrum();
      return next;
    });
  };

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
      {/* Backing Track */}
      <div className="bg-[#1a1c1c] border-b border-[#343737] shrink-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 px-6 h-12">
          <button
            onClick={toggleBacking}
            className={`shrink-0 text-sm font-mono-data transition-colors ${
              backingOn ? 'text-primary' : 'text-[#6b7280] hover:text-[#e2e2e2]'
            }`}
          >
            Drum {backingOn ? 'On' : 'Off'}
          </button>

          {backingOn && (
            <>
              <div className="flex gap-1.5">
                {DRUM_PATTERNS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setDrumPattern(p)}
                    className={`h-7 px-3 rounded-full text-xs font-bold border transition-colors ${
                      drumPattern.id === p.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-[#2e3131] border-[#343737] text-[#6b7280] hover:text-white hover:border-outline'
                    }`}
                  >{p.label}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto shrink-0">
                <span className="material-symbols-outlined text-[14px] text-[#6b7280]" style={{ fontVariationSettings: "'wght' 300" }}>volume_up</span>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={drumVolume}
                  onChange={e => setDrumVolume(parseFloat(e.target.value))}
                  className="w-14 volume-slider"
                  style={{ background: `linear-gradient(to right, #fff 0%, #fff ${drumVolume * 100}%, #444 ${drumVolume * 100}%, #444 100%)` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

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
            className="text-[10px] flex items-center justify-center font-bold select-none shrink-0"
            style={{ width: 29, height: 29, borderRadius: '50%', background: 'rgba(138,180,216,0.1)', color: 'rgba(255,255,255,0.5)' }}
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
            <span className="inline-flex items-center text-[#6b7280] leading-none">
              <NoteIcon id="q" color="#6b7280" size={18} />
              <span className="text-sm ml-0.5">=</span>
            </span>
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
            className="text-[10px] flex items-center justify-center font-bold select-none shrink-0"
            style={{ width: 29, height: 29, borderRadius: '50%', background: 'rgba(138,180,216,0.1)', color: 'rgba(255,255,255,0.5)' }}
          >+10</button>
        </div>

        <div className="mx-8 h-px bg-[#343737]" />

        {/* 하단: 템포명 / 재생 / TAP */}
        <div className="relative flex items-center px-8 py-4" style={{ minHeight: 80 + 32 + 16 }}>
          {/* 템포명 + 박자 — 선택 가능 */}
          <div className="flex-1 flex flex-row items-center gap-1.5 relative">
            {/* 템포명 */}
            <button
              onClick={e => { e.stopPropagation(); setShowTempoMenu(p => !p); setShowTimeSigMenu(false); }}
              className="text-[#6b7280] text-sm hover:text-[#e2e2e2] transition-colors"
            >
              {tempoName}
            </button>

            <span className="inline-block w-px h-3 bg-[#444]" />

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
                      className={`w-14 h-10 rounded-full border font-mono-data text-sm font-bold transition-colors ${
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

            <span className="inline-block w-px h-3 bg-[#444]" />

            {/* 음표 선택 버튼 */}
            <button
              onClick={e => { e.stopPropagation(); setShowNoteMenu(p => !p); setShowTempoMenu(false); setShowTimeSigMenu(false); }}
              className="text-[#6b7280] hover:text-[#e2e2e2] transition-colors text-sm font-mono-data"
            >
              {noteValue.label}
            </button>

            {/* 음표 선택 팝업 */}
            {showNoteMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-[#1e2020] border border-[#343737] rounded-lg overflow-hidden shadow-xl z-20">
                <div className="flex flex-wrap gap-2 p-3">
                  {NOTE_VALUES.map(nv => (
                    <button
                      key={nv.id}
                      onClick={e => { e.stopPropagation(); setNoteValue(nv); setShowNoteMenu(false); }}
                      className={`${nv.id === 'st' ? 'h-10 px-3' : 'w-10 h-10'} rounded-full border font-mono-data text-sm font-bold transition-colors whitespace-nowrap flex items-center justify-center ${
                        noteValue.id === nv.id
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-[#2e3131] border-[#343737] text-on-surface-variant hover:text-on-surface hover:border-outline'
                      }`}
                    >
                      {nv.label}
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
