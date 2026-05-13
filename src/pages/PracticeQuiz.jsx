import { useState, useEffect } from 'react';
import { NOTES, STANDARD_TUNING } from '../lib/music';

const STRING_NAMES_KO = ['저음 E 줄','A 줄','D 줄','G 줄','B 줄','고음 e 줄'];
const INTERVAL_NAMES_FULL = [
  'Perfect Unison','Minor 2nd','Major 2nd','Minor 3rd',
  'Major 3rd','Perfect 4th','Tritone','Perfect 5th',
  'Minor 6th','Major 6th','Minor 7th','Major 7th',
];

function generateQuestion() {
  const types = ['interval', 'note', 'chord_tone'];
  const type = types[Math.floor(Math.random() * types.length)];
  const stringIdx = Math.floor(Math.random() * 6);
  const stringName = STRING_NAMES_KO[stringIdx];
  const openNote = STANDARD_TUNING[stringIdx];

  if (type === 'note') {
    const fret = Math.floor(Math.random() * 13) + 1;
    const correctNote = NOTES[(openNote + fret) % 12];
    const wrong = NOTES.filter(n => n !== correctNote);
    const options = [correctNote, ...wrong.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    return {
      type: 'note',
      text: `${stringName} ${fret}번 프렛의 음이름은 무엇인가요?`,
      fret, stringIdx, correctAnswer: correctNote, options,
    };
  }

  if (type === 'interval') {
    const rootFret = Math.floor(Math.random() * 8);
    const rootNote = NOTES[(openNote + rootFret) % 12];
    const targetFret = Math.floor(Math.random() * 8) + 1;
    const targetNote = NOTES[(openNote + targetFret) % 12];
    const targetInterval = (NOTES.indexOf(targetNote) - NOTES.indexOf(rootNote) + 12) % 12;
    const intervalName = INTERVAL_NAMES_FULL[targetInterval];
    const wrong = INTERVAL_NAMES_FULL.filter(n => n !== intervalName);
    const options = [intervalName, ...wrong.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    return {
      type: 'interval',
      text: `${stringName}에서 ${rootNote}(${rootFret}번 프렛)를 기준으로 ${targetNote}(${targetFret}번 프렛)의 음정 관계는?`,
      fret: targetFret, stringIdx,
      correctAnswer: intervalName, options,
    };
  }

  // chord_tone: 특정 음정이 위치한 프렛 찾기
  const roots = ['C','D','E','F','G','A','B'];
  const root = roots[Math.floor(Math.random() * roots.length)];
  const intervals = ['Major 3rd','Perfect 5th','Minor 7th','Major 7th','Minor 3rd'];
  const intName = intervals[Math.floor(Math.random() * intervals.length)];
  const intSemi = INTERVAL_NAMES_FULL.indexOf(intName);
  const rootSemi = NOTES.indexOf(root);
  const targetSemi = (rootSemi + intSemi) % 12;
  const validFrets = [];
  for (let f = 0; f <= 12; f++) {
    if ((openNote + f) % 12 === targetSemi) validFrets.push(f);
  }
  const correctFret = validFrets[Math.floor(Math.random() * validFrets.length)] ?? 5;
  const wrongFrets = [correctFret - 1, correctFret + 1, correctFret + 2, correctFret - 2]
    .filter(f => f >= 0 && f <= 12 && f !== correctFret)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [correctFret, ...wrongFrets].sort(() => Math.random() - 0.5).map(String);
  return {
    type: 'chord_tone',
    text: `${stringName}에서 ${root}의 ${intName}은 몇 번 프렛인가요?`,
    fret: correctFret, stringIdx,
    correctAnswer: String(correctFret), options,
  };
}

const HISTORY = [40, 60, 50, 75, 65, 85, 80];
const DAYS = ['월','화','수','목','금','토','오늘'];

const TYPE_LABEL = {
  note: '음이름 맞추기',
  interval: '음정 인식',
  chord_tone: '코드 구성음 찾기',
};

export default function PracticeQuiz() {
  const [question, setQuestion] = useState(() => generateQuestion());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (feedback !== null) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFeedback('timeout');
          setStreak(0);
          setScore(s => ({ ...s, total: s.total + 1 }));
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [question, feedback]);

  const handleAnswer = (opt) => {
    if (feedback !== null) return;
    setSelected(opt);
    const isCorrect = opt === question.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    setStreak(s => isCorrect ? s + 1 : 0);
    setTimeout(() => {
      setQuestion(generateQuestion());
      setSelected(null);
      setFeedback(null);
      setTimeLeft(45);
    }, 1200);
  };

  const formatTime = t => `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;

  const nextQuestion = () => {
    setQuestion(generateQuestion());
    setSelected(null);
    setFeedback(null);
    setTimeLeft(45);
  };

  const resetSession = () => {
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setTimeLeft(45);
    setFeedback(null);
    setSelected(null);
    setQuestion(generateQuestion());
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="p-4 md:p-8 flex-1 flex flex-col space-y-4 max-w-[1280px] mx-auto w-full">
        {/* 통계 + 문제 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 통계 */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 bg-surface-container p-4 rounded-lg border border-surface-variant">
            <div className="flex-1 bg-surface flex flex-col justify-center items-center p-3 rounded border border-outline-variant">
              <span className="text-[10px] font-label-caps text-on-surface-variant mb-1">점수</span>
              <span className="text-headline-md font-headline-md text-primary">{score.correct}/{score.total}</span>
            </div>
            <div className="flex-1 bg-surface flex flex-col justify-center items-center p-3 rounded border border-outline-variant">
              <span className="text-[10px] font-label-caps text-on-surface-variant mb-1">연속 정답</span>
              <span className="text-headline-md font-headline-md text-secondary">{streak}</span>
            </div>
            <div className="flex-1 bg-surface flex flex-col justify-center items-center p-3 rounded border border-outline-variant">
              <span className="text-[10px] font-label-caps text-on-surface-variant mb-1">타이머</span>
              <span className={`text-headline-md font-headline-md ${timeLeft <= 10 ? 'text-error' : 'text-error'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* 문제 카드 */}
          <div className="lg:col-span-9 bg-surface-container rounded-lg border border-outline-variant p-8 flex flex-col justify-center items-center min-h-[180px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <h2 className="text-[10px] font-label-caps text-secondary mb-4 tracking-widest">
              {TYPE_LABEL[question.type]}
            </h2>
            <p className="text-lg md:text-xl font-headline-lg text-center leading-snug text-on-surface">
              {question.text}
            </p>

            {/* 보기 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
              {question.options.map((opt, i) => {
                let cls = 'bg-surface border-surface-variant text-on-surface hover:border-secondary hover:text-secondary';
                if (feedback !== null) {
                  if (opt === question.correctAnswer) cls = 'bg-surface border-primary text-primary';
                  else if (opt === selected && feedback === 'wrong') cls = 'bg-error-container/20 border-error text-error';
                  else cls = 'bg-surface border-surface-variant text-on-surface-variant opacity-50';
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={feedback !== null}
                    className={`py-3 px-4 rounded border font-mono-data text-sm font-bold transition-all ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className={`mt-4 text-sm font-label-caps font-bold tracking-widest ${
                feedback === 'correct' ? 'text-primary' : feedback === 'wrong' ? 'text-error' : 'text-on-surface-variant'
              }`}>
                {feedback === 'correct' ? '✓ 정답!' : feedback === 'wrong' ? '✗ 오답' : '시간 초과!'}
              </div>
            )}
          </div>
        </div>

        {/* 연습 기록 */}
        <div className="bg-surface-container rounded-lg border border-outline-variant p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-label-caps font-label-caps text-on-surface">연습 기록</h3>
            <span className="text-mono-data font-mono-data text-secondary text-sm">최근 7세션</span>
          </div>
          <div className="h-28 flex items-end justify-between space-x-2 border-b border-l border-surface-variant pl-2 pb-2">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-colors"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 6 ? '#0481FF' : '#333535',
                    boxShadow: i === 6 ? '0 0 8px rgba(4,129,255,0.4)' : 'none',
                  }}
                />
                <span className={`text-[10px] font-mono-data ${i === 6 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {DAYS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={nextQuestion}
            className="px-6 py-3 bg-surface-variant border border-outline-variant text-on-surface rounded text-label-caps font-label-caps hover:bg-surface-bright transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">skip_next</span>
            건너뛰기
          </button>
          <button
            onClick={resetSession}
            className="px-6 py-3 bg-primary text-on-primary rounded text-label-caps font-label-caps font-bold hover:bg-primary-fixed transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            새 세션
          </button>
        </div>
      </div>
    </div>
  );
}
