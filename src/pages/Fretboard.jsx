import { useState, useCallback } from 'react';

// ── Shared constants ──────────────────────────────────────────────────────────
const NOTES = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const TUNING = [4,9,2,7,11,4]; // low E(0) to high e(5)
const STRING_LABELS = ['E','A','D','G','B','e'];
const NUM_FRETS = 12;
const FRET_DOTS = {3:1,5:1,7:1,9:1,12:2};

function noteAt(string, fret) {
  return NOTES[(TUNING[string] + fret) % 12];
}

// ── FretboardGrid ─────────────────────────────────────────────────────────────
function FretboardGrid({ renderCell }) {
  const fretNumbers = Array.from({ length: NUM_FRETS }, (_, i) => i + 1);
  // strings rendered high e (5) → low E (0)
  const stringOrder = [5, 4, 3, 2, 1, 0];

  return (
    <div style={{ minWidth: 480, overflowX: 'auto' }}>
      {/* Fret dot position overlay row */}
      <div className="flex mb-2">
        <div className="w-6 shrink-0 pr-1 text-[11px] invisible">E</div>
        {fretNumbers.map(f => (
          <div key={f} className="flex-1 flex items-center justify-center gap-1 h-4">
            {FRET_DOTS[f] === 2 ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/50" />
              </>
            ) : FRET_DOTS[f] === 1 ? (
              <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/50" />
            ) : null}
          </div>
        ))}
      </div>

      {/* Strings */}
      {stringOrder.map((s, si) => {
        const isFirst = si === 0;
        const isLast = si === stringOrder.length - 1;
        return (
          <div key={s} className="flex items-center h-9">
            {/* String label */}
            <div className="w-6 shrink-0 text-right pr-1 text-[13px] font-mono-data text-outline-variant">
              {STRING_LABELS[s]}
            </div>
            {/* Fret cells */}
            {fretNumbers.map(f => (
              <div key={f} className="flex-1 relative flex items-center justify-center h-9">
                {/* String line */}
                <div style={{ position: 'absolute', height: 1, width: '100%', backgroundColor: 'rgba(40,42,43,0.9)' }} />
                {/* Nut line — left side of first fret */}
                {f === 1 && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    width: 2,
                    backgroundColor: 'rgba(75,85,99,0.5)',
                    top: isFirst ? '50%' : 0,
                    bottom: isLast ? '50%' : 0,
                  }} />
                )}
                {/* Fret line — top string starts at 50%, bottom string ends at 50% */}
                <div style={{
                  position: 'absolute',
                  right: 0,
                  width: 2,
                  backgroundColor: 'rgba(75,85,99,0.5)',
                  top: isFirst ? '50%' : 0,
                  bottom: isLast ? '50%' : 0,
                }} />
                {/* Cell content */}
                <div className="relative z-10">{renderCell(s, f)}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab 1: NoteExplorer ───────────────────────────────────────────────────────
function NoteExplorer() {
  const [selected, setSelected] = useState(null);

  const renderCell = useCallback((s, f) => {
    const note = noteAt(s, f);
    const isSelected = selected === note;
    if (selected !== null && !isSelected) return null;
    return (
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono-data font-bold ${
          isSelected
            ? 'bg-primary text-white shadow-[0_0_10px_rgba(4,129,255,0.5)]'
            : 'bg-outline-variant text-on-surface'
        }`}
      >
        {note}
      </div>
    );
  }, [selected]);


  return (
    <div className="space-y-6">
      {/* Note selector */}
      <div className="flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none', gap: 'calc(var(--spacing) * 2)' }}>
        <button
          onClick={() => setSelected(null)}
          className={`text-[14px] whitespace-nowrap shrink-0 transition-colors leading-none rounded-full px-2 py-1.5 ${
            selected === null
              ? 'bg-primary text-white font-bold'
              : 'text-on-surface-variant hover:text-on-surface font-normal'
          }`}
        >
          All
        </button>
        {NOTES.map(note => (
          <button
            key={note}
            onClick={() => setSelected(selected === note ? null : note)}
            className={`text-[14px] whitespace-nowrap shrink-0 transition-colors leading-none rounded-full px-2 py-1.5 ${
              selected === note
                ? 'bg-primary text-white font-bold'
                : 'text-on-surface-variant hover:text-on-surface font-normal'
            }`}
          >
            {note}
          </button>
        ))}
      </div>

      {/* Fretboard */}
      <FretboardGrid renderCell={renderCell} />
    </div>
  );
}

// ── Tab 2: NoteQuiz ───────────────────────────────────────────────────────────
function randomQuestion() {
  const string = Math.floor(Math.random() * 6);
  const fret = Math.floor(Math.random() * 12) + 1;
  const answer = noteAt(string, fret);
  const wrong = NOTES.filter(n => n !== answer).sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [answer, ...wrong].sort(() => Math.random() - 0.5);
  return { string, fret, answer, choices };
}

function NoteQuiz() {
  const [question, setQuestion] = useState(() => randomQuestion());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [status, setStatus] = useState(null); // null | 'correct' | 'wrong'
  const [wrongChoice, setWrongChoice] = useState(null);

  function handleAnswer(choice) {
    if (status) return;
    const isCorrect = choice === question.answer;
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    setStatus(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) setWrongChoice(choice);
    setTimeout(() => {
      setStatus(null);
      setWrongChoice(null);
      setQuestion(randomQuestion());
    }, 900);
  }

  function handleReset() {
    setScore({ correct: 0, total: 0 });
    setQuestion(randomQuestion());
    setStatus(null);
    setWrongChoice(null);
  }

  const renderCell = useCallback((s, f) => {
    if (s !== question.string || f !== question.fret) return null;
    let colorClass = 'bg-primary text-white';
    if (status === 'correct') colorClass = 'bg-emerald-500 text-white';
    if (status === 'wrong') colorClass = 'bg-red-500 text-white';
    return (
      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${colorClass}`}>
        {status ? question.answer : '?'}
      </div>
    );
  }, [question, status]);

  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Score bar */}
      <div className="flex flex-col items-center pt-6">
        <div className="text-center">
          <div className="text-sm text-on-surface-variant mb-2">Score</div>
          <div>
            <span className="text-4xl font-bold text-on-surface">{score.correct} / {score.total}</span>
          </div>
          <div className="text-xs text-outline mt-1">({pct}%)</div>
        </div>
      </div>

      {/* Fretboard */}
      <FretboardGrid renderCell={renderCell} />

      {/* Answer choices */}
      <div className="flex justify-center gap-3 flex-wrap">
        {question.choices.map(c => {
          let extra = 'bg-surface-container border-outline-variant text-on-surface hover:bg-primary hover:border-primary hover:text-white';
          if (status && c === question.answer) extra = 'bg-emerald-500 text-white border-emerald-500';
          else if (status && c === wrongChoice) extra = 'bg-red-500/80 text-white border-red-500';
          return (
            <button
              key={c}
              onClick={() => handleAnswer(c)}
              disabled={!!status}
              className={`w-14 h-14 rounded-full text-base font-bold border transition-colors ${extra}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <div className="fixed bottom-14 left-0 right-0 md:left-64 flex justify-center pointer-events-none">
        <button
          onClick={handleReset}
          className="pointer-events-auto flex items-center gap-1 text-[13px] text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'wght' 300, 'OPSZ' 14" }}>refresh</span>
          Reset
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Fretboard() {
  const [tab, setTab] = useState('map'); // 'map' | 'quiz'

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="bg-surface-container border-b border-outline-variant pl-4 pr-3 md:px-6 flex gap-6 shrink-0">
        {[['map','Note Map'],['quiz','Quiz']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`py-3 text-sm transition-colors border-b-2 ${
              tab === id
                ? 'text-on-surface font-bold border-primary'
                : 'text-on-surface-variant font-normal border-transparent hover:text-on-surface'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pl-4 pr-3 py-4 md:px-6 md:py-6">
        {tab === 'map' ? <NoteExplorer /> : <NoteQuiz />}
      </div>
    </div>
  );
}
