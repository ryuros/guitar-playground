import { useState } from 'react';

// ── Visual blocks ─────────────────────────────────────────────────────────────

function NotesGrid() {
  const notes = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
  return (
    <div className="bg-surface-container rounded-xl p-6 space-y-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {notes.map(n => {
          const natural = !n.includes('#') && !n.includes('b');
          return (
            <div key={n} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
              natural ? 'bg-primary text-white' : 'bg-surface border border-outline-variant text-on-surface-variant'
            }`}>{n}</div>
          );
        })}
      </div>
      <p className="text-xs text-on-surface-variant text-center">파란색: 자연음(7개) · 회색: 반음(5개) · 합계: 12음</p>
    </div>
  );
}

function ScaleFormulaViz() {
  const steps = ['온','온','반','온','온','온','반'];
  const notes = ['C','D','E','F','G','A','B','C'];
  return (
    <div className="bg-surface-container rounded-xl p-6">
      <div className="flex items-center flex-wrap gap-y-2 justify-center">
        {notes.map((n, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              i === 0 || i === 7 ? 'bg-primary text-white' : 'bg-surface border border-outline-variant text-on-surface'
            }`}>{n}</div>
            {i < 7 && (
              <div className="px-1.5 text-center">
                <div className="text-[11px] text-primary font-bold leading-none">{steps[i]}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TriadDiagram() {
  return (
    <div className="bg-surface-container rounded-xl p-8 divide-y divide-outline-variant/40">
      <div className="pb-3">
        <p className="text-xs text-outline mb-4 text-center">C Major — 1·3·5도</p>
        <div className="flex items-end gap-3 justify-center">
          {[{n:'C',label:'1도 (근음)',hi:true},{n:'E',label:'3도',hi:false},{n:'G',label:'5도',hi:false}].map(({n,label,hi}) => (
            <div key={n} className="flex flex-col items-center gap-1">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${
                hi ? 'bg-primary text-white' : 'bg-surface border-2 border-secondary text-secondary'
              }`}>{n}</div>
              <span className="text-[10px] text-outline">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-3">
        <p className="text-xs text-outline mb-4 text-center">C Minor — 3도가 반음 낮아짐</p>
        <div className="flex items-end gap-3 justify-center">
          {[{n:'C',label:'1도',hi:true},{n:'Eb',label:'b3도',hi:false},{n:'G',label:'5도',hi:false}].map(({n,label,hi}) => (
            <div key={n} className="flex flex-col items-center gap-1">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${
                hi ? 'bg-primary text-white' : 'bg-surface border-2 border-outline text-outline'
              }`}>{n}</div>
              <span className="text-[10px] text-outline">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiatonicChords() {
  const chords = [
    { roman: 'I',    name: 'C',    type: 'M' },
    { roman: 'ii',   name: 'Dm',   type: 'm' },
    { roman: 'iii',  name: 'Em',   type: 'm' },
    { roman: 'IV',   name: 'F',    type: 'M' },
    { roman: 'V',    name: 'G',    type: 'M' },
    { roman: 'vi',   name: 'Am',   type: 'm' },
    { roman: 'vii°', name: 'Bdim', type: 'd' },
  ];
  return (
    <div className="bg-surface-container rounded-xl p-6 space-y-3">
      <div className="flex flex-wrap gap-3 justify-center">
        {chords.map(c => (
          <div key={c.roman} className="flex flex-col items-center gap-1">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold ${
              c.type === 'M' ? 'bg-primary text-white' :
              c.type === 'm' ? 'bg-surface border-2 border-secondary text-secondary' :
              'bg-surface border border-outline-variant text-outline'
            }`}>{c.name}</div>
            <span className="text-[10px] text-outline font-mono-data">{c.roman}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-[11px] text-outline pt-1 border-t border-outline-variant/40 justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> 메이저</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-secondary inline-block" /> 마이너</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-outline-variant inline-block" /> 디미니쉬드</span>
      </div>
    </div>
  );
}

function ProgressionViz({ chords, label }) {
  return (
    <div className="bg-surface-container rounded-xl p-6">
      <p className="text-xs text-outline mb-3 text-center">{label}</p>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {chords.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary font-bold text-sm">{c}</div>
            {i < chords.length - 1 && <span className="text-outline text-xs">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function MinorScaleViz() {
  const steps = ['온','반','온','온','반','온','온'];
  const notes = ['A','B','C','D','E','F','G','A'];
  return (
    <div className="bg-surface-container rounded-xl p-6 space-y-3">
      <div>
        <p className="text-xs text-outline mb-4 text-center">A 내추럴 마이너 스케일</p>
        <div className="flex items-center flex-wrap gap-y-2 justify-center">
          {notes.map((n, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 || i === 7 ? 'bg-surface border-2 border-secondary text-secondary' : 'bg-surface border border-outline-variant text-on-surface'
              }`}>{n}</div>
              {i < 7 && <div className="px-1.5 text-[11px] text-on-surface-variant font-bold leading-none">{steps[i]}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 p-3 bg-surface-container-high rounded-lg border border-outline-variant/40">
        <span className="material-symbols-outlined text-outline shrink-0" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>info</span>
        <p className="text-xs text-on-surface-variant leading-relaxed">C 메이저와 A 마이너는 같은 음(C D E F G A B)을 사용합니다. 시작음만 다를 뿐 — 이를 <span className="text-on-surface font-semibold">관계조</span>라고 합니다.</p>
      </div>
    </div>
  );
}

function SeventhChordsViz() {
  const chords = [
    { name: 'Cmaj7', notes: ['C','E','G','B'],   label: 'Major 7th',    desc: '밝고 따뜻한 느낌',        color: 'bg-primary text-white' },
    { name: 'Cm7',   notes: ['C','Eb','G','Bb'], label: 'Minor 7th',    desc: '어둡고 부드러운 느낌',    color: 'bg-surface border-2 border-secondary text-secondary' },
    { name: 'C7',    notes: ['C','E','G','Bb'],  label: 'Dominant 7th', desc: '긴장감, 해결을 원하는 느낌', color: 'bg-surface border-2 border-primary/60 text-primary' },
  ];
  return (
    <div className="bg-surface-container rounded-xl p-8 divide-y divide-outline-variant/40">
      {chords.map(ch => (
        <div key={ch.name} className="py-5 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-on-surface">{ch.name}</span>
            <span className="text-xs text-on-surface-variant">{ch.label}</span>
            <span className="text-xs text-on-surface-variant">{ch.desc}</span>
          </div>
          <div className="flex gap-2 justify-center">
            {ch.notes.map((n, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${ch.color}`}>{n}</div>
                <span className="text-[9px] text-outline">{['1도','3도','5도','7도'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PentatonicViz() {
  const minor = ['A','C','D','E','G','A'];
  const major = ['C','D','E','G','A','C'];
  return (
    <div className="bg-surface-container rounded-xl p-6 space-y-3">
      <div>
        <p className="text-xs text-outline mb-4 text-center">A 마이너 펜타토닉 (1·b3·4·5·b7)</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {minor.map((n, i) => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
              i === 0 || i === 5 ? 'bg-surface border-2 border-secondary text-secondary' : 'bg-surface border border-outline-variant text-on-surface'
            }`}>{n}</div>
          ))}
        </div>
      </div>
      <div className="border-t border-outline-variant/40 pt-3">
        <p className="text-xs text-outline mb-4 text-center">C 메이저 펜타토닉 (1·2·3·5·6)</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {major.map((n, i) => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
              i === 0 || i === 5 ? 'bg-primary text-white' : 'bg-surface border border-outline-variant text-on-surface'
            }`}>{n}</div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 p-3 bg-surface-container-high rounded-lg border border-outline-variant/40">
        <span className="material-symbols-outlined text-outline shrink-0" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>info</span>
        <p className="text-xs text-on-surface-variant leading-relaxed">A 마이너 펜타토닉과 C 메이저 펜타토닉도 같은 음을 사용합니다. 록·블루스 솔로의 90%가 마이너 펜타토닉 하나로 만들어집니다.</p>
      </div>
    </div>
  );
}

function IntervalsViz() {
  const intervals = [
    { semitones: 0,  name: '유니즌',  short: 'P1', example: 'C → C' },
    { semitones: 2,  name: '장2도',   short: 'M2', example: 'C → D' },
    { semitones: 3,  name: '단3도',   short: 'm3', example: 'C → Eb' },
    { semitones: 4,  name: '장3도',   short: 'M3', example: 'C → E' },
    { semitones: 5,  name: '완전4도', short: 'P4', example: 'C → F' },
    { semitones: 7,  name: '완전5도', short: 'P5', example: 'C → G' },
    { semitones: 8,  name: '단6도',   short: 'm6', example: 'C → Ab' },
    { semitones: 9,  name: '장6도',   short: 'M6', example: 'C → A' },
    { semitones: 10, name: '단7도',   short: 'm7', example: 'C → Bb' },
    { semitones: 11, name: '장7도',   short: 'M7', example: 'C → B' },
    { semitones: 12, name: '옥타브',  short: 'P8', example: 'C → C' },
  ];
  return (
    <div className="bg-surface-container rounded-xl overflow-hidden">
      <div className="grid grid-cols-[2.5rem_1fr_2rem_4.5rem] text-[10px] font-semibold text-outline uppercase tracking-wide px-4 py-2 bg-surface-container-high border-b border-outline-variant/40">
        <span>기호</span>
        <span>이름</span>
        <span className="text-center">반음</span>
        <span className="text-right">예시</span>
      </div>
      <div className="divide-y divide-outline-variant/30">
        {intervals.map(iv => (
          <div key={iv.short} className="grid grid-cols-[2.5rem_1fr_2rem_4.5rem] items-center px-4 py-2 text-sm">
            <span className="font-mono-data text-xs font-bold text-primary">{iv.short}</span>
            <span className="text-on-surface-variant text-xs">{iv.name}</span>
            <span className="text-center text-xs font-bold text-on-surface tabular-nums">{iv.semitones}</span>
            <span className="text-right text-xs text-outline font-mono-data">{iv.example}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModesViz() {
  const modes = [
    { name: 'Ionian',     start: 'C', formula: 'W W H W W W H', feel: '밝고 안정적',       color: 'bg-primary text-white' },
    { name: 'Dorian',     start: 'D', formula: 'W H W W W H W', feel: '어둡지만 세련된',   color: 'bg-surface border-2 border-secondary text-secondary' },
    { name: 'Phrygian',   start: 'E', formula: 'H W W W H W W', feel: '긴장감, 플라멩코',  color: 'bg-surface border border-outline-variant text-on-surface-variant' },
    { name: 'Lydian',     start: 'F', formula: 'W W W H W W H', feel: '몽환적, 공상적',    color: 'bg-surface border border-outline-variant text-on-surface-variant' },
    { name: 'Mixolydian', start: 'G', formula: 'W W H W W H W', feel: '블루지, 록',        color: 'bg-surface border-2 border-primary/60 text-primary' },
    { name: 'Aeolian',    start: 'A', formula: 'W H W W H W W', feel: '내추럴 마이너',     color: 'bg-surface border-2 border-secondary text-secondary' },
    { name: 'Locrian',    start: 'B', formula: 'H W W H W W W', feel: '불안정, 잘 안 씀', color: 'bg-surface border border-outline-variant text-outline' },
  ];
  return (
    <div className="bg-surface-container rounded-xl overflow-hidden divide-y divide-outline-variant/40">
      {modes.map((m) => (
        <div key={m.name} className="flex items-center gap-3 px-4 py-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${m.color}`}>{m.start}</div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-on-surface">{m.name}</span>
            <span className="text-xs text-on-surface-variant ml-2">{m.feel}</span>
          </div>
          <span className="text-[10px] font-mono-data text-outline bg-surface px-1.5 py-0.5 rounded border border-outline-variant/40 shrink-0 hidden sm:block">{m.formula}</span>
        </div>
      ))}
    </div>
  );
}

function TensionChordsViz() {
  const chords = [
    { name: 'Cmaj9', notes: ['C','E','G','B','D'], degrees: ['1','3','5','7','9'],    label: 'Major 9th' },
    { name: 'Am11',  notes: ['A','C','E','G','D'], degrees: ['1','b3','5','b7','11'], label: 'Minor 11th' },
    { name: 'G13',   notes: ['G','B','D','F','E'], degrees: ['1','3','5','b7','13'],  label: 'Dominant 13th' },
  ];
  return (
    <div className="bg-surface-container rounded-xl p-8 divide-y divide-outline-variant/40">
      {chords.map(ch => (
        <div key={ch.name} className="py-5 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-on-surface">{ch.name}</span>
            <span className="text-xs text-on-surface-variant">{ch.label}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {ch.notes.map((n, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 3 ? 'bg-surface border border-outline-variant text-on-surface' :
                  i === 3 ? 'bg-primary/20 border border-primary/50 text-primary' :
                  'bg-secondary/20 border border-secondary/50 text-secondary'
                }`}>{n}</div>
                <span className="text-[9px] text-outline">{ch.degrees[i]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SecondaryDominantViz() {
  const items = [
    { symbol: 'V/II',  chord: 'A7',  resolves: 'Dm', desc: 'D로 가는 도미넌트' },
    { symbol: 'V/IV',  chord: 'C7',  resolves: 'F',  desc: 'F로 가는 도미넌트' },
    { symbol: 'V/V',   chord: 'D7',  resolves: 'G',  desc: 'G로 가는 도미넌트' },
    { symbol: 'V/VI',  chord: 'E7',  resolves: 'Am', desc: 'Am으로 가는 도미넌트' },
  ];
  return (
    <div className="bg-surface-container rounded-xl overflow-hidden divide-y divide-outline-variant/40">
      {items.map(it => (
        <div key={it.symbol} className="flex items-center gap-3 px-4 py-2.5">
          <span className="text-xs font-mono-data text-outline w-10 shrink-0">{it.symbol}</span>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary font-bold text-sm">{it.chord}</div>
            <span className="text-outline text-xs">→</span>
            <div className="px-3 py-1 rounded-lg bg-surface border border-outline-variant text-on-surface font-bold text-sm">{it.resolves}</div>
          </div>
          <span className="text-xs text-on-surface-variant ml-auto hidden sm:block">{it.desc}</span>
        </div>
      ))}
    </div>
  );
}

function CAGEDViz() {
  const shapes = ['C','A','G','E','D'];
  return (
    <div className="bg-surface-container rounded-xl p-6 space-y-3">
      <div className="flex gap-3 flex-wrap justify-center">
        {shapes.map(sh => (
          <div key={sh} className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{sh}</div>
            <span className="text-[10px] text-outline">Shape</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/40 pt-3">C-A-G-E-D 5개의 오픈 코드 형태를 넥 전체에 걸쳐 이동시켜 같은 코드를 다양한 포지션에서 연주할 수 있습니다.</p>
    </div>
  );
}

function VoiceLeadingViz() {
  const progressions = [
    { from: 'C', to: 'Am', notes: [['C','E','G'],['A','E','C']], tip: 'E와 C는 유지, G→A만 반음 이동' },
    { from: 'F', to: 'G',  notes: [['C','F','A'],['B','D','G']], tip: '모든 성부가 반음 또는 온음 이동' },
  ];
  return (
    <div className="bg-surface-container rounded-xl p-8 divide-y divide-outline-variant/40">
      {progressions.map((p, pi) => (
        <div key={pi} className="py-3 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-xs font-bold text-on-surface w-10 shrink-0">{p.from} → {p.to}</span>
            <div className="flex gap-1">
              {p.notes[0].map((n,i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">{n}</div>
              ))}
            </div>
            <span className="text-outline text-xs">→</span>
            <div className="flex gap-1">
              {p.notes[1].map((n,i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-surface border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">{n}</div>
              ))}
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">{p.tip}</p>
        </div>
      ))}
    </div>
  );
}

// ── Chapter data ──────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 1,
    title: '음이름 & 반음계',
    subtitle: '음악의 기본 재료, 12개의 음',
    sections: [
      { type: 'text', heading: '12개의 음', body: '음악에서 사용하는 음은 총 12개입니다. C, C#, D, Eb, E, F, F#, G, Ab, A, Bb, B — 이 12개의 음이 높낮이만 바뀌며 반복됩니다.' },
      { type: 'notes-grid' },
      { type: 'text', heading: '반음(Semitone)과 온음(Whole Tone)', body: '기타에서 프렛 하나 이동하면 반음(半音)이 높아집니다. 반음 두 개가 모이면 온음(全音)이 됩니다. 예를 들어 C → C#은 반음, C → D는 온음입니다.' },
      { type: 'text', heading: '#(샵)과 b(플랫)', body: '# 은 반음 올린다는 뜻이고, b 은 반음 내린다는 뜻입니다. C#과 Db은 이름은 다르지만 같은 음(이명동음)입니다.' },
    ],
  },
  {
    id: 2,
    title: '메이저 스케일',
    subtitle: '도레미파솔라시의 비밀',
    sections: [
      { type: 'text', heading: '스케일(Scale)이란?', body: '스케일은 특정 규칙에 따라 선택된 음들의 순서입니다. 우리가 알고 있는 도레미파솔라시가 바로 메이저 스케일입니다.' },
      { type: 'text', heading: '메이저 스케일 공식', body: '메이저 스케일은 온-온-반-온-온-온-반(W-W-H-W-W-W-H) 간격으로 구성됩니다. 이 공식만 알면 어떤 키의 메이저 스케일도 만들 수 있습니다.' },
      { type: 'scale-formula' },
      { type: 'text', heading: 'C 메이저 스케일', body: 'C를 시작음으로 공식을 적용하면 C-D-E-F-G-A-B 가 됩니다. 검은 건반 없이 흰 건반만으로 이루어진 스케일이기 때문에 처음 배우기 좋습니다.' },
    ],
  },
  {
    id: 3,
    title: '트라이어드 코드',
    subtitle: '3개의 음으로 만드는 화음',
    sections: [
      { type: 'text', heading: '코드(Chord)란?', body: '코드는 2개 이상의 음을 동시에 연주하는 것입니다. 가장 기본이 되는 코드는 3개의 음으로 구성된 트라이어드(Triad)입니다.' },
      { type: 'text', heading: '메이저 코드와 마이너 코드', body: '트라이어드는 1도(근음), 3도, 5도로 구성됩니다. 3도가 장3도(4반음)이면 메이저, 단3도(3반음)이면 마이너가 됩니다.' },
      { type: 'triad' },
      { type: 'text', heading: '코드 공식 정리', body: '메이저: 1 + 장3도 + 완전5도 / 마이너: 1 + 단3도 + 완전5도. 이 두 가지 공식이 모든 코드의 출발점입니다.' },
    ],
  },
  {
    id: 4,
    title: '다이아토닉 코드',
    subtitle: '키 안에서 자연스럽게 만들어지는 코드',
    sections: [
      { type: 'text', heading: '다이아토닉이란?', body: '메이저 스케일의 각 음을 근음으로 삼아 스케일 안의 음으로만 코드를 만들면 7개의 코드가 생깁니다. 이것이 다이아토닉 코드입니다.' },
      { type: 'diatonic' },
      { type: 'text', heading: '코드 진행의 기초', body: 'I, IV, V 코드는 메이저 키의 핵심입니다. I → IV → V → I 진행은 가장 자연스럽게 들리는 진행이며 수천 곡에서 사용됩니다.' },
      { type: 'progression', chords: ['C','F','G','C'], label: 'I → IV → V → I (C 메이저)' },
      { type: 'progression', chords: ['C','Am','F','G'], label: 'I → vi → IV → V (팝 진행)' },
    ],
  },
  {
    id: 5,
    title: '마이너 스케일',
    subtitle: '어두운 감성의 근원',
    sections: [
      { type: 'text', heading: '내추럴 마이너 스케일', body: '마이너 스케일은 온-반-온-온-반-온-온(W-H-W-W-H-W-W) 공식으로 구성됩니다. 메이저보다 어둡고 슬픈 느낌을 줍니다.' },
      { type: 'minor-scale' },
      { type: 'text', heading: '관계조(Relative Key)', body: '모든 메이저 키에는 같은 음을 공유하는 마이너 키가 있습니다. C 메이저의 관계 단조는 A 마이너입니다. 6번째 음(vi)이 관계 단조의 으뜸음입니다.' },
      { type: 'progression', chords: ['Am','F','C','G'], label: 'i → VI → III → VII (마이너 팝 진행)' },
    ],
  },
  {
    id: 6,
    title: '7th 코드',
    subtitle: '풍부한 색채를 더하는 4음 코드',
    sections: [
      { type: 'text', heading: '7th 코드란?', body: '트라이어드에 7도 음을 하나 더 추가한 코드입니다. 재즈, 팝, R&B에서 감성적인 색채를 더하는 데 자주 사용됩니다.' },
      { type: 'seventh-chords' },
      { type: 'text', heading: '도미넌트 7th의 역할', body: 'G7(V7)처럼 도미넌트 7th는 강한 긴장감을 만들고 I 코드로 해결하려는 성질을 가집니다. 이 긴장-해결 관계가 음악에 방향감을 줍니다.' },
    ],
  },
  {
    id: 7,
    title: '펜타토닉 스케일',
    subtitle: '록·블루스의 핵심 5음 스케일',
    sections: [
      { type: 'text', heading: '펜타토닉이란?', body: '메이저 스케일 7음에서 반음 충돌이 심한 4도와 7도를 제거한 5음 스케일입니다. 어떤 코드 위에서도 안전하게 들려 즉흥 연주에 최적입니다.' },
      { type: 'pentatonic' },
      { type: 'text', heading: '기타에서의 활용', body: '마이너 펜타토닉의 5가지 포지션을 기억해두면 넥 전체에서 즉흥 연주가 가능합니다. 처음에는 1번 포지션(박스 패턴)부터 시작하세요.' },
    ],
  },
  {
    id: 8,
    title: '음정(Interval)',
    subtitle: '두 음 사이의 거리를 측정하는 언어',
    sections: [
      { type: 'text', heading: '음정이란?', body: '음정은 두 음 사이의 거리를 반음 개수로 표현한 것입니다. 코드와 스케일의 구조를 이해하는 기본 언어입니다.' },
      { type: 'intervals' },
      { type: 'text', heading: '음정을 익히는 법', body: '각 음정의 소리를 귀로 기억하는 것이 중요합니다. 완전5도(P5)는 파워 코드, 장3도(M3)는 메이저 코드의 밝은 느낌과 연결해 기억하세요.' },
    ],
  },
  {
    id: 9,
    title: '모달 스케일',
    subtitle: '7가지 색채, 하나의 음계에서',
    sections: [
      { type: 'text', heading: '모드(Mode)란?', body: 'C 메이저 스케일을 서로 다른 음부터 시작하면 7가지 다른 느낌의 스케일이 만들어집니다. 이것이 모드(선법)입니다.' },
      { type: 'modes' },
      { type: 'text', heading: '실용적인 활용', body: 'Dorian은 마이너 재즈/팝, Mixolydian은 록·블루스에서 자주 쓰입니다. 처음엔 Dorian과 Mixolydian 두 가지를 집중적으로 익혀보세요.' },
    ],
  },
  {
    id: 10,
    title: '텐션 코드',
    subtitle: '9th, 11th, 13th — 감성을 확장하다',
    sections: [
      { type: 'text', heading: '텐션이란?', body: '7th 코드에 9도, 11도, 13도를 추가하면 더욱 풍부한 색채의 코드가 됩니다. 재즈와 현대 팝에서 감성 표현의 핵심입니다.' },
      { type: 'tension-chords' },
      { type: 'text', heading: '실용 팁', body: '텐션음을 모두 연주하지 않아도 됩니다. 기타에서는 5도를 생략하고 근음, 3도, 7도, 텐션 순으로 보이싱하는 것이 일반적입니다.' },
    ],
  },
  {
    id: 11,
    title: '세컨더리 도미넌트',
    subtitle: '다른 키로 잠시 여행하는 기술',
    sections: [
      { type: 'text', heading: '세컨더리 도미넌트란?', body: '원래 키에 없는 코드를 일시적으로 빌려와 다음 코드로 향하는 강한 긴장감을 만드는 기법입니다. 진행에 극적인 변화를 줍니다.' },
      { type: 'secondary-dominant' },
      { type: 'text', heading: '활용 예시', body: 'C 메이저에서 D7 → G 진행은 세컨더리 도미넌트의 대표적인 예입니다. D7이 G를 더 강하게 당겨 음악에 방향감을 부여합니다.' },
    ],
  },
  {
    id: 12,
    title: 'CAGED 시스템',
    subtitle: '넥 전체를 지배하는 5개의 형태',
    sections: [
      { type: 'text', heading: 'CAGED란?', body: 'C, A, G, E, D — 5개의 오픈 코드 형태가 기타 넥 전체를 덮습니다. 어떤 코드든 이 5가지 형태로 넥의 모든 포지션에서 연주할 수 있습니다.' },
      { type: 'caged' },
      { type: 'text', heading: '연습 방법', body: '하나의 코드(예: C)를 CAGED 5가지 형태로 모두 연주해 보세요. 바레 코드를 사용해 같은 코드를 다른 포지션에서 찾는 연습이 가장 효과적입니다.' },
    ],
  },
  {
    id: 13,
    title: '보이스 리딩',
    subtitle: '각 음이 자연스럽게 흐르는 진행',
    sections: [
      { type: 'text', heading: '보이스 리딩이란?', body: '화음 진행에서 각 개별 음(성부)이 최소한의 움직임으로 다음 코드로 이동하는 기법입니다. 매끄럽고 자연스러운 화음 연결의 핵심입니다.' },
      { type: 'voice-leading' },
      { type: 'text', heading: '실전 적용', body: '코드를 바꿀 때 공통음은 그대로 유지하고 나머지 음은 가장 가까운 음으로 이동시키세요. 이렇게 하면 진행이 훨씬 자연스럽고 전문적으로 들립니다.' },
    ],
  },
  {
    id: 14,
    title: '모달 인터체인지',
    subtitle: '평행 조에서 코드를 빌려오다',
    sections: [
      { type: 'text', heading: '모달 인터체인지란?', body: '같은 으뜸음을 가진 다른 모드에서 코드를 빌려오는 기법입니다. C 메이저 곡에서 C 마이너의 코드를 일시적으로 사용하는 것이 대표적인 예입니다.' },
      { type: 'text', heading: '대표적인 차용 코드', body: '메이저 키에서 가장 자주 차용하는 코드는 ♭VII, ♭VI, iv 입니다. C 메이저에서 Bb, Ab, Fm이 이에 해당하며 극적인 감성 변화를 만들어냅니다.' },
      { type: 'text', heading: '유명한 사용 예', body: '비틀즈의 많은 곡에서 모달 인터체인지가 활용됩니다. "Nowhere Man"의 Dm → Fm 진행이 대표적 예로, C 메이저 키에서 마이너 iv를 차용해 감동적인 색채를 만듭니다.' },
    ],
  },
  {
    id: 15,
    title: '리하모나이제이션',
    subtitle: '기존 멜로디에 새 화음 입히기',
    sections: [
      { type: 'text', heading: '리하모나이제이션이란?', body: '기존 멜로디의 코드 진행을 다른 코드로 대체해 새로운 색채와 감성을 부여하는 기법입니다. 재즈 편곡의 핵심 기술입니다.' },
      { type: 'text', heading: '트리톤 서브스티튜션', body: '도미넌트 코드를 반음계 반대쪽(감음 = 트리톤)의 도미넌트 코드로 대체합니다. G7을 Db7으로 대체하면 반음씩 내려오는 매끄러운 베이스 라인을 만들 수 있습니다.' },
      { type: 'text', heading: '활용 방법', body: '처음엔 ii-V-I 진행에서 V 코드만 바꿔보세요. Dm7 → G7 → Cmaj7 를 Dm7 → Db7 → Cmaj7 로 바꾸면 훨씬 재지한 느낌을 얻을 수 있습니다.' },
    ],
  },
  {
    id: 16,
    title: '리듬 & 그루브',
    subtitle: '음표보다 중요한 타이밍의 예술',
    sections: [
      { type: 'text', heading: '리듬이 핵심인 이유', body: '완벽한 음정과 코드를 알아도 리듬이 잘못되면 음악이 살아나지 않습니다. 전문 연주자들은 음표보다 타이밍과 그루브를 더 중시합니다.' },
      { type: 'text', heading: '싱코페이션', body: '강박에 음을 연주하지 않고 약박에 강조를 두는 기법입니다. 예상에서 벗어나는 타이밍이 음악에 긴장감과 생동감을 부여합니다. 록, 펑크, R&B의 필수 요소입니다.' },
      { type: 'text', heading: '다운스트로크 vs 업스트로크', body: '다운스트로크는 묵직하고 강한 느낌, 업스트로크는 가볍고 밝은 느낌을 줍니다. 일정한 스트로킹 패턴(↓↓↑↓↑ 등)을 몸에 익히는 것이 그루브 향상의 기본입니다.' },
      { type: 'text', heading: '메트로놈 연습', body: '메트로놈 없는 연습은 잘못된 리듬을 고착시킬 수 있습니다. 느린 템포에서 정확하게 연주하는 것이 빠른 연주보다 훨씬 중요합니다. 꾸준한 메트로놈 연습이 전부입니다.' },
    ],
  },
];

// ── Chapter content ───────────────────────────────────────────────────────────
function ChapterContent({ chapter }) {
  function renderSection(s, i) {
    switch (s.type) {
      case 'text': return (
        <div key={i}>
          {s.heading && <h3 className="text-base font-semibold text-on-surface mb-4">{s.heading}</h3>}
          <p className="text-sm text-on-surface-variant leading-relaxed">{s.body}</p>
        </div>
      );
      case 'notes-grid':         return <NotesGrid key={i} />;
      case 'scale-formula':      return <ScaleFormulaViz key={i} />;
      case 'triad':              return <TriadDiagram key={i} />;
      case 'diatonic':           return <DiatonicChords key={i} />;
      case 'progression':        return <ProgressionViz key={i} chords={s.chords} label={s.label} />;
      case 'minor-scale':        return <MinorScaleViz key={i} />;
      case 'seventh-chords':     return <SeventhChordsViz key={i} />;
      case 'pentatonic':         return <PentatonicViz key={i} />;
      case 'intervals':          return <IntervalsViz key={i} />;
      case 'modes':              return <ModesViz key={i} />;
      case 'tension-chords':     return <TensionChordsViz key={i} />;
      case 'secondary-dominant': return <SecondaryDominantViz key={i} />;
      case 'caged':              return <CAGEDViz key={i} />;
      case 'voice-leading':      return <VoiceLeadingViz key={i} />;
      default: return null;
    }
  }

  return (
    <div>
      <div className="pb-4 border-b border-outline-variant mb-6">
        <h2 className="text-xl font-bold text-on-surface">{chapter.title}</h2>
        <p className="text-sm text-on-surface-variant mt-1">{chapter.subtitle}</p>
      </div>
      <div className="space-y-6">
        {chapter.sections.map((s, i) => renderSection(s, i))}
      </div>
    </div>
  );
}

// ── Nav groups ────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  { label: '기초', ids: [1, 2, 3, 4] },
  { label: '중급', ids: [5, 6, 7, 8] },
  { label: '고급', ids: [9, 10, 11, 12] },
  { label: '심화', ids: [13, 14, 15, 16] },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Theory() {
  const [activeId, setActiveId] = useState(1);
  const activeChapter = CHAPTERS.find(c => c.id === activeId);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Mobile chapter nav */}
      <div className="md:hidden border-b border-outline-variant flex gap-1 px-4 py-2 bg-surface-container shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {CHAPTERS.map(ch => (
          <button key={ch.id}
            onClick={() => setActiveId(ch.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              ch.id === activeId ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'
            }`}>
            {ch.title}
          </button>
        ))}
      </div>

      <div className="px-4 pt-10 pb-4 md:px-8 md:pt-14 md:pb-8 max-w-[1280px] w-full mx-auto flex gap-12">
        {/* Sidebar — desktop */}
        <div className="w-48 shrink-0 hidden md:block">
          <div className="sticky top-0 space-y-6">
            {NAV_GROUPS.map(group => (
              <div key={group.label}>
                <p className="text-xs font-bold text-on-surface mb-2">{group.label}</p>
                <div className="border-l border-outline-variant ml-1">
                  {group.ids.map(id => {
                    const ch = CHAPTERS.find(c => c.id === id);
                    const active = id === activeId;
                    return (
                      <button key={id}
                        onClick={() => setActiveId(id)}
                        className={`w-full text-left pl-4 pr-2 py-1.5 text-sm transition-colors border-l-2 -ml-px ${
                          active
                            ? 'text-primary font-semibold border-primary'
                            : 'text-on-surface-variant hover:text-on-surface border-transparent'
                        }`}>
                        {ch.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeChapter && <ChapterContent key={activeId} chapter={activeChapter} />}
        </div>
      </div>
    </div>
  );
}
