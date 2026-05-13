import { useState } from 'react';

// ── SVG diagram constants ──────────────────────────────────────────────────
const FRET_COUNT = 4;
const STR_COUNT = 6;
const SS = 22;   // string spacing
const FH = 32;   // fret height
const ML = 18;   // horizontal margin
const MT = 28;   // top margin (string indicators)
const CR = 10;   // finger circle radius

const SVG_W = ML * 2 + SS * (STR_COUNT - 1); // 146
const SVG_H = MT + FH * FRET_COUNT + 10;      // 166

const sx = i => ML + i * SS;
const dotY = (fret, sf) => MT + (fret - sf + 0.5) * FH;

function ChordDiagram({ strings, fingers, barre, startFret = 1 }) {
  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
    >
      {/* String indicators (X / O / dot) */}
      {strings.map((s, i) => {
        if (s === 'x') return (
          <text key={i} x={sx(i)} y={MT - 10} textAnchor="middle" fontSize="10" fill="#6b7280">✕</text>
        );
        if (s === 0) return (
          <circle key={i} cx={sx(i)} cy={MT - 12} r={4} fill="none" stroke="#6b7280" strokeWidth="1.5" />
        );
        return <text key={i} x={sx(i)} y={MT - 10} textAnchor="middle" fontSize="7" fill="#3a3d3d">•</text>;
      })}

      {/* Nut */}
      {startFret === 1 && (
        <line x1={sx(0)} y1={MT} x2={sx(5)} y2={MT} stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* Strings */}
      {Array.from({ length: STR_COUNT }, (_, i) => (
        <line key={i} x1={sx(i)} y1={MT} x2={sx(i)} y2={MT + FH * FRET_COUNT}
          stroke="#2e3131" strokeWidth="1" />
      ))}

      {/* Frets */}
      {Array.from({ length: FRET_COUNT + 1 }, (_, i) => (
        <line key={i} x1={sx(0)} y1={MT + i * FH} x2={sx(5)} y2={MT + i * FH}
          stroke="#2e3131" strokeWidth="1" />
      ))}

      {/* Barre */}
      {barre && (
        <rect
          x={sx(barre.fromString) - CR + 2}
          y={dotY(barre.fret, startFret) - CR}
          width={sx(barre.toString) - sx(barre.fromString) + (CR - 2) * 2}
          height={CR * 2}
          rx={CR}
          fill="rgba(164,201,255,0.15)"
          stroke="rgba(164,201,255,0.4)"
          strokeWidth="1.2"
        />
      )}

      {/* Finger dots — skip dots that sit on the barre (already drawn as a rect) */}
      {fingers
        .filter(f => !(barre && f.fret === barre.fret && f.string >= barre.fromString && f.string <= barre.toString))
        .map((f, i) => {
          const cy = dotY(f.fret, startFret);
          return (
            <g key={i}>
              <circle cx={sx(f.string)} cy={cy} r={CR}
                fill="rgba(164,201,255,0.2)" stroke="rgba(164,201,255,0.6)" strokeWidth="1.2" />
              <text x={sx(f.string)} y={cy + 3.5} textAnchor="middle"
                fontSize="10" fill="white" fontWeight="600">{f.finger}</text>
            </g>
          );
        })}
    </svg>
  );
}

// ── Chord data ──────────────────────────────────────────────────────────────
// strings: index 0 = low E … 5 = high e  |  'x' = muted, 0 = open, n = fret
const STATIC_CHORDS = [
  {
    id: 'c-major', name: 'C Major', formula: '1-3-5', category: 'STANDARD', type: 'Major',
    strings: ['x', 3, 2, 0, 1, 0], startFret: 1, barre: null,
    fingers: [{ string: 4, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 }, { string: 1, fret: 3, finger: 3 }],
  },
  {
    id: 'd-minor', name: 'D Minor', formula: '1-♭3-5', category: 'STANDARD', type: 'minor',
    strings: ['x', 'x', 0, 2, 3, 1], startFret: 1, barre: null,
    fingers: [{ string: 5, fret: 1, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 3, finger: 3 }],
  },
  {
    id: 'g7', name: 'G7', formula: '1-3-5-♭7', category: 'DOMINANT', type: 'dom7',
    strings: [3, 2, 0, 0, 0, 1], startFret: 1, barre: null,
    fingers: [{ string: 5, fret: 1, finger: 1 }, { string: 1, fret: 2, finger: 2 }, { string: 0, fret: 3, finger: 3 }],
  },
  {
    id: 'amaj7', name: 'Amaj7', formula: '1-3-5-7', category: 'MAJOR 7TH', type: 'maj7',
    strings: ['x', 0, 2, 1, 2, 0], startFret: 1, barre: null,
    fingers: [{ string: 3, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 3 }],
  },
  {
    id: 'e-major', name: 'E Major', formula: '1-3-5', category: 'STANDARD', type: 'Major',
    strings: [0, 2, 2, 1, 0, 0], startFret: 1, barre: null,
    fingers: [{ string: 3, fret: 1, finger: 1 }, { string: 1, fret: 2, finger: 2 }, { string: 2, fret: 2, finger: 3 }],
  },
{
    id: 'd-major', name: 'D Major', formula: '1-3-5', category: 'STANDARD', type: 'Major',
    strings: ['x', 'x', 0, 2, 3, 2], startFret: 1, barre: null,
    fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 5, fret: 2, finger: 2 }, { string: 4, fret: 3, finger: 3 }],
  },
  {
    id: 'g-major', name: 'G Major', formula: '1-3-5', category: 'STANDARD', type: 'Major',
    strings: [3, 2, 0, 0, 3, 3], startFret: 1, barre: null,
    fingers: [
      { string: 1, fret: 2, finger: 1 }, { string: 0, fret: 3, finger: 2 },
      { string: 4, fret: 3, finger: 3 }, { string: 5, fret: 3, finger: 4 },
    ],
  },
  {
    id: 'a-major', name: 'A Major', formula: '1-3-5', category: 'STANDARD', type: 'Major',
    strings: ['x', 0, 2, 2, 2, 0], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 3 }],
  },
  {
    id: 'a-minor', name: 'A Minor', formula: '1-♭3-5', category: 'STANDARD', type: 'minor',
    strings: ['x', 0, 2, 2, 1, 0], startFret: 1, barre: null,
    fingers: [{ string: 4, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 }, { string: 3, fret: 2, finger: 3 }],
  },
  {
    id: 'e-minor', name: 'E Minor', formula: '1-♭3-5', category: 'STANDARD', type: 'minor',
    strings: [0, 2, 2, 0, 0, 0], startFret: 1, barre: null,
    fingers: [{ string: 1, fret: 2, finger: 2 }, { string: 2, fret: 2, finger: 3 }],
  },
  {
    id: 'cmaj7', name: 'Cmaj7', formula: '1-3-5-7', category: 'MAJOR 7TH', type: 'maj7',
    strings: ['x', 3, 2, 0, 0, 0], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 2 }, { string: 1, fret: 3, finger: 3 }],
  },
  {
    id: 'am7', name: 'Am7', formula: '1-♭3-5-♭7', category: 'MINOR 7TH', type: 'm7',
    strings: ['x', 0, 2, 0, 1, 0], startFret: 1, barre: null,
    fingers: [{ string: 4, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 }],
  },
  {
    id: 'cmaj9', name: 'Cmaj9', formula: '1-3-5-7-9', category: 'MAJOR 9TH', type: 'maj7',
    strings: ['x', 3, 2, 0, 3, 0], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 2 }, { string: 1, fret: 3, finger: 3 }, { string: 4, fret: 3, finger: 4 }],
  },
  {
    id: 'dm9', name: 'Dm9', formula: '1-♭3-5-♭7-9', category: 'MINOR 9TH', type: 'm7',
    strings: ['x', 5, 7, 5, 6, 5], startFret: 5,
    barre: { fret: 5, fromString: 1, toString: 5 },
    fingers: [{ string: 4, fret: 6, finger: 2 }, { string: 2, fret: 7, finger: 4 }],
  },
  {
    id: 'g7sharp9', name: 'G7#9', formula: '1-3-5-♭7-#9', category: 'DOMINANT ALT', type: 'dom7',
    strings: ['x', 'x', 3, 4, 3, 'x'], startFret: 3,
    barre: { fret: 3, fromString: 2, toString: 4 },
    fingers: [{ string: 3, fret: 4, finger: 3 }],
  },
  {
    id: 'em7b5', name: 'Em7♭5', formula: '1-♭3-♭5-♭7', category: 'HALF DIM', type: 'm7b5',
    strings: [0, 1, 2, 0, 3, 0], startFret: 1, barre: null,
    fingers: [{ string: 1, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 }, { string: 4, fret: 3, finger: 3 }],
  },
  {
    id: 'am7b5', name: 'Am7♭5', formula: '1-♭3-♭5-♭7', category: 'HALF DIM', type: 'm7b5',
    strings: ['x', 0, 1, 1, 1, 3], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 1, finger: 1 }, { string: 3, fret: 1, finger: 2 }, { string: 4, fret: 1, finger: 3 }, { string: 5, fret: 3, finger: 4 }],
  },
  {
    id: 'bdim', name: 'Bdim', formula: '1-♭3-♭5', category: 'DIMINISHED', type: 'dim7',
    strings: ['x', 2, 3, 4, 3, 'x'], startFret: 1, barre: null,
    fingers: [{ string: 1, fret: 2, finger: 1 }, { string: 2, fret: 3, finger: 2 }, { string: 4, fret: 3, finger: 3 }, { string: 3, fret: 4, finger: 4 }],
  },
  {
    id: 'adim7', name: 'Adim7', formula: '1-♭3-♭5-𝄫7', category: 'DIMINISHED', type: 'dim7',
    strings: ['x', 0, 1, 2, 1, 2], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 1, finger: 1 }, { string: 4, fret: 1, finger: 2 }, { string: 3, fret: 2, finger: 3 }, { string: 5, fret: 2, finger: 4 }],
  },
  // ── add9 ──
  {
    id: 'cadd9', name: 'Cadd9', formula: '1-3-5-9', category: 'ADD 9', type: 'add9',
    strings: ['x', 3, 2, 0, 3, 0], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 2 }, { string: 1, fret: 3, finger: 3 }, { string: 4, fret: 3, finger: 4 }],
  },
  {
    id: 'dadd9', name: 'Dadd9', formula: '1-3-5-9', category: 'ADD 9', type: 'add9',
    strings: ['x', 'x', 0, 2, 3, 0], startFret: 1, barre: null,
    fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 4, fret: 3, finger: 2 }],
  },
  {
    id: 'gadd9', name: 'Gadd9', formula: '1-3-5-9', category: 'ADD 9', type: 'add9',
    strings: [3, 'x', 0, 2, 3, 3], startFret: 1, barre: null,
    fingers: [{ string: 0, fret: 3, finger: 2 }, { string: 3, fret: 2, finger: 1 }, { string: 4, fret: 3, finger: 3 }, { string: 5, fret: 3, finger: 4 }],
  },
  {
    id: 'eadd9', name: 'Eadd9', formula: '1-3-5-9', category: 'ADD 9', type: 'add9',
    strings: [0, 2, 2, 1, 0, 2], startFret: 1, barre: null,
    fingers: [{ string: 3, fret: 1, finger: 1 }, { string: 1, fret: 2, finger: 2 }, { string: 2, fret: 2, finger: 3 }, { string: 5, fret: 2, finger: 4 }],
  },
  {
    id: 'aadd9', name: 'Aadd9', formula: '1-3-5-9', category: 'ADD 9', type: 'add9',
    strings: ['x', 0, 2, 4, 2, 0], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 1 }, { string: 4, fret: 2, finger: 2 }, { string: 3, fret: 4, finger: 4 }],
  },
  // ── sus4 ──
  {
    id: 'csus4', name: 'Csus4', formula: '1-4-5', category: 'SUS4', type: 'sus4',
    strings: ['x', 3, 3, 0, 1, 1], startFret: 1,
    barre: { fret: 1, fromString: 4, toString: 5 },
    fingers: [{ string: 1, fret: 3, finger: 3 }, { string: 2, fret: 3, finger: 4 }, { string: 4, fret: 1, finger: 1 }, { string: 5, fret: 1, finger: 1 }],
  },
  {
    id: 'dsus4', name: 'Dsus4', formula: '1-4-5', category: 'SUS4', type: 'sus4',
    strings: ['x', 'x', 0, 2, 3, 3], startFret: 1, barre: null,
    fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 4, fret: 3, finger: 2 }, { string: 5, fret: 3, finger: 3 }],
  },
  {
    id: 'esus4', name: 'Esus4', formula: '1-4-5', category: 'SUS4', type: 'sus4',
    strings: [0, 2, 2, 2, 0, 0], startFret: 1, barre: null,
    fingers: [{ string: 1, fret: 2, finger: 1 }, { string: 2, fret: 2, finger: 2 }, { string: 3, fret: 2, finger: 3 }],
  },
  {
    id: 'asus4', name: 'Asus4', formula: '1-4-5', category: 'SUS4', type: 'sus4',
    strings: ['x', 0, 2, 2, 3, 0], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 3, finger: 3 }],
  },
  {
    id: 'gsus4', name: 'Gsus4', formula: '1-4-5', category: 'SUS4', type: 'sus4',
    strings: [3, 'x', 0, 0, 1, 3], startFret: 1, barre: null,
    fingers: [{ string: 0, fret: 3, finger: 3 }, { string: 4, fret: 1, finger: 1 }, { string: 5, fret: 3, finger: 4 }],
  },
  // ── 7sus4 ──
  {
    id: 'a7sus4', name: 'A7sus4', formula: '1-4-5-♭7', category: '7SUS4', type: '7sus4',
    strings: ['x', 0, 2, 0, 3, 0], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 2 }, { string: 4, fret: 3, finger: 3 }],
  },
  {
    id: 'd7sus4', name: 'D7sus4', formula: '1-4-5-♭7', category: '7SUS4', type: '7sus4',
    strings: ['x', 'x', 0, 2, 1, 3], startFret: 1, barre: null,
    fingers: [{ string: 4, fret: 1, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 5, fret: 3, finger: 4 }],
  },
  {
    id: 'g7sus4', name: 'G7sus4', formula: '1-4-5-♭7', category: '7SUS4', type: '7sus4',
    strings: [3, 'x', 0, 0, 1, 1], startFret: 1,
    barre: { fret: 1, fromString: 4, toString: 5 },
    fingers: [{ string: 0, fret: 3, finger: 3 }, { string: 4, fret: 1, finger: 1 }, { string: 5, fret: 1, finger: 1 }],
  },
  {
    id: 'e7sus4', name: 'E7sus4', formula: '1-4-5-♭7', category: '7SUS4', type: '7sus4',
    strings: [0, 2, 2, 2, 3, 0], startFret: 1, barre: null,
    fingers: [{ string: 1, fret: 2, finger: 1 }, { string: 2, fret: 2, finger: 2 }, { string: 3, fret: 2, finger: 3 }, { string: 4, fret: 3, finger: 4 }],
  },
  // ── aug ──
  {
    id: 'caug', name: 'Caug', formula: '1-3-#5', category: 'AUGMENTED', type: 'aug',
    strings: ['x', 3, 2, 1, 1, 0], startFret: 1,
    barre: { fret: 1, fromString: 3, toString: 4 },
    fingers: [{ string: 1, fret: 3, finger: 3 }, { string: 2, fret: 2, finger: 2 }, { string: 3, fret: 1, finger: 1 }, { string: 4, fret: 1, finger: 1 }],
  },
  {
    id: 'eaug', name: 'Eaug', formula: '1-3-#5', category: 'AUGMENTED', type: 'aug',
    strings: [0, 3, 2, 1, 1, 0], startFret: 1,
    barre: { fret: 1, fromString: 3, toString: 4 },
    fingers: [{ string: 1, fret: 3, finger: 3 }, { string: 2, fret: 2, finger: 2 }, { string: 3, fret: 1, finger: 1 }, { string: 4, fret: 1, finger: 1 }],
  },
  {
    id: 'aaug', name: 'Aaug', formula: '1-3-#5', category: 'AUGMENTED', type: 'aug',
    strings: ['x', 0, 3, 2, 2, 1], startFret: 1, barre: null,
    fingers: [{ string: 5, fret: 1, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 3 }, { string: 2, fret: 3, finger: 4 }],
  },
  {
    id: 'daug', name: 'Daug', formula: '1-3-#5', category: 'AUGMENTED', type: 'aug',
    strings: ['x', 'x', 0, 3, 3, 2], startFret: 1, barre: null,
    fingers: [{ string: 5, fret: 2, finger: 1 }, { string: 3, fret: 3, finger: 2 }, { string: 4, fret: 3, finger: 3 }],
  },
  // ── power (5) ──
  {
    id: 'e5', name: 'E5', formula: '1-5', category: 'POWER', type: 'power',
    strings: [0, 2, 2, 'x', 'x', 'x'], startFret: 1, barre: null,
    fingers: [{ string: 1, fret: 2, finger: 1 }, { string: 2, fret: 2, finger: 2 }],
  },
  {
    id: 'a5', name: 'A5', formula: '1-5', category: 'POWER', type: 'power',
    strings: ['x', 0, 2, 2, 'x', 'x'], startFret: 1, barre: null,
    fingers: [{ string: 2, fret: 2, finger: 1 }, { string: 3, fret: 2, finger: 2 }],
  },
  {
    id: 'd5', name: 'D5', formula: '1-5', category: 'POWER', type: 'power',
    strings: ['x', 'x', 0, 2, 3, 'x'], startFret: 1, barre: null,
    fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 4, fret: 3, finger: 2 }],
  },
  {
    id: 'g5', name: 'G5', formula: '1-5', category: 'POWER', type: 'power',
    strings: [3, 5, 5, 'x', 'x', 'x'], startFret: 3, barre: null,
    fingers: [{ string: 0, fret: 3, finger: 1 }, { string: 1, fret: 5, finger: 3 }, { string: 2, fret: 5, finger: 4 }],
  },
  {
    id: 'c5', name: 'C5', formula: '1-5', category: 'POWER', type: 'power',
    strings: ['x', 3, 5, 5, 'x', 'x'], startFret: 3, barre: null,
    fingers: [{ string: 1, fret: 3, finger: 1 }, { string: 2, fret: 5, finger: 3 }, { string: 3, fret: 5, finger: 4 }],
  },
  {
    id: 'b5', name: 'B5', formula: '1-5', category: 'POWER', type: 'power',
    strings: ['x', 2, 4, 4, 'x', 'x'], startFret: 2, barre: null,
    fingers: [{ string: 1, fret: 2, finger: 1 }, { string: 2, fret: 4, finger: 3 }, { string: 3, fret: 4, finger: 4 }],
  },
  // ── dim7 ──
  {
    id: 'cdim7', name: 'Cdim7', formula: '1-♭3-♭5-𝄫7', category: 'DIMINISHED', type: 'dim7',
    strings: ['x', 3, 4, 2, 4, 3], startFret: 2, barre: null,
    fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 1, fret: 3, finger: 2 }, { string: 5, fret: 3, finger: 3 }, { string: 2, fret: 4, finger: 4 }],
  },
  {
    id: 'fdim7', name: 'Fdim7', formula: '1-♭3-♭5-𝄫7', category: 'DIMINISHED', type: 'dim7',
    strings: ['x', 'x', 3, 4, 3, 4], startFret: 2, barre: null,
    fingers: [{ string: 2, fret: 3, finger: 1 }, { string: 4, fret: 3, finger: 2 }, { string: 3, fret: 4, finger: 3 }, { string: 5, fret: 4, finger: 4 }],
  },
];

// ── CAGED barre chord generator ─────────────────────────────────────────────
// E-shape: root on low-E string  |  A-shape: root on A string
const BARRE_CHORDS = (() => {
  const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  // fret on low-E string where each root sits
  const eF = { C:8,'C#':9,D:10,'D#':11,E:0,F:1,'F#':2,G:3,'G#':4,A:5,'A#':6,B:7 };
  // fret on A string where each root sits
  const aF = { C:3,'C#':4,D:5,'D#':6,E:7,F:8,'F#':9,G:10,'G#':11,A:0,'A#':1,B:2 };

  const out = [];

  roots.forEach(root => {
    const ef = eF[root];
    const af = aF[root];
    const rid = root.replace('#','s').toLowerCase();

    // ── E-shape (root on low-E, frets 1–10) ──────────────────────────────
    if (ef >= 1 && ef <= 10) {
      const B = { fret: ef, fromString: 0, toString: 5 };

      // Major  [N N+2 N+2 N+1 N N]
      out.push({ id:`${rid}-maj-e`, name:`${root} Major`, formula:'1-3-5', category:'BARRE', type:'Major',
        strings:[ef,ef+2,ef+2,ef+1,ef,ef], startFret:ef, barre:B,
        fingers:[{string:3,fret:ef+1,finger:2},{string:2,fret:ef+2,finger:3},{string:1,fret:ef+2,finger:4}] });

      // Minor  [N N+2 N+2 N N N]
      out.push({ id:`${rid}-min-e`, name:`${root} Minor`, formula:'1-♭3-5', category:'BARRE', type:'minor',
        strings:[ef,ef+2,ef+2,ef,ef,ef], startFret:ef, barre:B,
        fingers:[{string:1,fret:ef+2,finger:3},{string:2,fret:ef+2,finger:4}] });

      // Dom7   [N N+2 N N+1 N N]
      out.push({ id:`${rid}-7-e`, name:`${root}7`, formula:'1-3-5-♭7', category:'DOMINANT', type:'dom7',
        strings:[ef,ef+2,ef,ef+1,ef,ef], startFret:ef, barre:B,
        fingers:[{string:1,fret:ef+2,finger:3},{string:3,fret:ef+1,finger:2}] });

      // Maj7   [N N+2 N+1 N+1 N N]
      out.push({ id:`${rid}-maj7-e`, name:`${root}maj7`, formula:'1-3-5-7', category:'MAJOR 7TH', type:'maj7',
        strings:[ef,ef+2,ef+1,ef+1,ef,ef], startFret:ef, barre:B,
        fingers:[{string:1,fret:ef+2,finger:3},{string:2,fret:ef+1,finger:2},{string:3,fret:ef+1,finger:2}] });

      // m7     [N N+2 N N N N]  — b7 from barre on D string ✓
      out.push({ id:`${rid}-m7-e`, name:`${root}m7`, formula:'1-♭3-5-♭7', category:'MINOR 7TH', type:'m7',
        strings:[ef,ef+2,ef,ef,ef,ef], startFret:ef, barre:B,
        fingers:[{string:1,fret:ef+2,finger:3}] });

      // 7sus4  [N N+2 N+2 N+2 N+3 N]
      out.push({ id:`${rid}-7sus4-e`, name:`${root}7sus4`, formula:'1-4-5-♭7', category:'7SUS4', type:'7sus4',
        strings:[ef,ef+2,ef+2,ef+2,ef+3,ef], startFret:ef, barre:B,
        fingers:[{string:1,fret:ef+2,finger:2},{string:2,fret:ef+2,finger:3},{string:3,fret:ef+2,finger:3},{string:4,fret:ef+3,finger:4}] });
    }

    // ── A-shape (root on A string, frets 1–9) ─────────────────────────────
    if (af >= 1 && af <= 9) {
      const B = { fret: af, fromString: 1, toString: 5 };

      // Major  [x N N+2 N+2 N+2 N]
      out.push({ id:`${rid}-maj-a`, name:`${root} Major`, formula:'1-3-5', category:'BARRE', type:'Major',
        strings:['x',af,af+2,af+2,af+2,af], startFret:af, barre:B,
        fingers:[{string:2,fret:af+2,finger:2},{string:3,fret:af+2,finger:3},{string:4,fret:af+2,finger:4}] });

      // Minor  [x N N+2 N+2 N+1 N]
      out.push({ id:`${rid}-min-a`, name:`${root} Minor`, formula:'1-♭3-5', category:'BARRE', type:'minor',
        strings:['x',af,af+2,af+2,af+1,af], startFret:af, barre:B,
        fingers:[{string:4,fret:af+1,finger:2},{string:2,fret:af+2,finger:3},{string:3,fret:af+2,finger:4}] });

      // Dom7   [x N N+2 N N+2 N]
      out.push({ id:`${rid}-7-a`, name:`${root}7`, formula:'1-3-5-♭7', category:'DOMINANT', type:'dom7',
        strings:['x',af,af+2,af,af+2,af], startFret:af, barre:B,
        fingers:[{string:2,fret:af+2,finger:2},{string:4,fret:af+2,finger:4}] });

      // Maj7   [x N N+2 N+1 N+2 N]
      out.push({ id:`${rid}-maj7-a`, name:`${root}maj7`, formula:'1-3-5-7', category:'MAJOR 7TH', type:'maj7',
        strings:['x',af,af+2,af+1,af+2,af], startFret:af, barre:B,
        fingers:[{string:3,fret:af+1,finger:2},{string:2,fret:af+2,finger:3},{string:4,fret:af+2,finger:4}] });

      // m7     [x N N+2 N N+1 N]
      out.push({ id:`${rid}-m7-a`, name:`${root}m7`, formula:'1-♭3-5-♭7', category:'MINOR 7TH', type:'m7',
        strings:['x',af,af+2,af,af+1,af], startFret:af, barre:B,
        fingers:[{string:2,fret:af+2,finger:3},{string:4,fret:af+1,finger:2}] });

      // 7sus4  [x N N+2 N N+3 N]
      out.push({ id:`${rid}-7sus4-a`, name:`${root}7sus4`, formula:'1-4-5-♭7', category:'7SUS4', type:'7sus4',
        strings:['x',af,af+2,af,af+3,af], startFret:af, barre:B,
        fingers:[{string:2,fret:af+2,finger:2},{string:4,fret:af+3,finger:4}] });
    }
  });

  return out;
})();

const CHORDS = [...STATIC_CHORDS, ...BARRE_CHORDS];

// ── Filter config ───────────────────────────────────────────────────────────
const TYPE_MAP = {
  'All':    null,
  'Major':  'Major',
  'maj7':   'maj7',
  '7':      'dom7',
  'add9':   'add9',
  'sus4':   'sus4',
  '7sus4':  '7sus4',
  'minor':  'minor',
  'm7':     'm7',
  'aug':    'aug',
  '5':      'power',
  'dim7':   'dim7',
  'm7♭5':   'm7b5',
};

const ROOT_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT_EQUIV = { 'C#':'D♭', 'D#':'E♭', 'F#':'G♭', 'G#':'A♭', 'A#':'B♭' };
const rootLabel = (r) => {
  if (!FLAT_EQUIV[r]) return r;
  return (
    <span className="inline-flex items-end gap-[1px]">
      <span className="text-[14px]">{r}</span>
      <span className="text-[9px] leading-[1.4]">({FLAT_EQUIV[r]})</span>
    </span>
  );
};
const QUALITY_OPTIONS = ['All', 'Major', 'maj7', '7', 'add9', 'sus4', '7sus4', 'minor', 'm7', 'aug', '5', 'dim7', 'm7♭5'];

const getChordRoot = (name) => {
  const m = name.match(/^([A-G][#♭]?)/);
  return m ? m[1] : '';
};

// ── Filter row ──────────────────────────────────────────────────────────────
function FilterRow({ label, options, selected, onSelect, labelFn }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-[11px] font-label-caps text-on-surface-variant shrink-0 mt-0.5 w-12">{label}</span>
      <div className="flex items-center gap-5 overflow-x-auto pb-0.5 min-w-0 flex-1" style={{ scrollbarWidth: 'none' }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`text-[14px] whitespace-nowrap shrink-0 transition-colors leading-none pb-0.5 ${
              selected === opt
                ? 'text-primary font-bold border-b border-primary'
                : 'text-on-surface-variant hover:text-on-surface font-normal'
            }`}
          >
            {labelFn ? labelFn(opt) : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Card components ─────────────────────────────────────────────────────────
function ChordCard({ chord }) {
  return (
    <div className="bg-surface-container-high rounded-xl p-5 flex flex-col gap-3">
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-headline-md font-headline-md text-on-surface">{chord.name}</h3>
          <span className="text-mono-data font-mono-data text-on-surface-variant text-sm">{chord.formula}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-label-caps font-label-caps text-[#4dd0e1] tracking-wider text-[11px]">
            {chord.category}
          </span>
          {chord.startFret > 1 && (
            <span className="text-mono-data text-[10px] text-on-surface-variant">{chord.startFret}fr</span>
          )}
        </div>
      </div>
      <div className="w-full px-2 pt-1">
        <ChordDiagram
          strings={chord.strings}
          fingers={chord.fingers}
          barre={chord.barre}
          startFret={chord.startFret}
        />
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
const POSITION_ORDER = ['Open', '1fr', '2fr', '3fr', '4fr', '5fr', '6fr', '7fr', '8fr', '9fr', '10fr', '12fr'];

const getPosition = (chord) =>
  chord.strings.some(s => s === 0) ? 'Open' : `${chord.startFret}fr`;

export default function ChordLibrary() {
  const [selectedRoot, setSelectedRoot] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [query, setQuery] = useState('');

  const rootOptions = ['All', ...ROOT_NOTES];

  // Pre-filter by root + quality to drive dynamic position options
  const byRootAndQuality = CHORDS.filter(c => {
    const matchesRoot = selectedRoot === 'All' || getChordRoot(c.name) === selectedRoot;
    const matchesQuality = selectedQuality === 'All' || c.type === TYPE_MAP[selectedQuality];
    return matchesRoot && matchesQuality;
  });

  const positionSet = new Set(byRootAndQuality.map(getPosition));
  const positionOptions = ['All', ...POSITION_ORDER.filter(p => positionSet.has(p))];

  const handleRootChange = (root) => {
    setSelectedRoot(root);
    setSelectedPosition('All');
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    setSelectedPosition('All');
  };

  const filtered = byRootAndQuality
    .filter(c => {
      const matchesPosition = selectedPosition === 'All' || getPosition(c) === selectedPosition;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q ||
        c.name.toLowerCase().includes(q) ||
        c.formula.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchesPosition && matchesQuery;
    })
    .sort((a, b) => {
      const pa = POSITION_ORDER.indexOf(getPosition(a));
      const pb = POSITION_ORDER.indexOf(getPosition(b));
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="p-4 sm:p-6 md:p-8 max-w-[1280px] mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-[24px] md:text-[32px] font-headline-lg text-on-surface">Chord Library</h1>
          <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-1.5 focus-within:ring-1 focus-within:ring-outline transition-colors w-full sm:w-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search chords..."
              className="bg-transparent text-on-surface text-sm font-mono-data outline-none placeholder-on-surface-variant flex-1 sm:w-36"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* 3-row cascade filters */}
        <div className="mb-6 bg-surface-container rounded-xl border border-surface-variant divide-y divide-surface-variant overflow-hidden">
          <FilterRow label="Root" options={rootOptions} selected={selectedRoot} onSelect={handleRootChange} labelFn={rootLabel} />
          <FilterRow label="Quality" options={QUALITY_OPTIONS} selected={selectedQuality} onSelect={handleQualityChange} />
          <FilterRow label="Position" options={positionOptions} selected={selectedPosition} onSelect={setSelectedPosition} />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map(chord => (
              <ChordCard key={chord.id} chord={chord} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
            <span className="material-symbols-outlined text-[48px] opacity-40">library_music</span>
            <p className="text-mono-data font-mono-data text-sm text-center">선택한 조건에 맞는 코드가 없습니다</p>
            <button
              onClick={() => { setSelectedRoot('All'); setSelectedQuality('All'); setSelectedPosition('All'); setQuery(''); }}
              className="mt-1 px-4 py-1.5 bg-surface-container rounded-full text-xs font-label-caps text-on-surface-variant hover:text-on-surface transition-colors"
            >
              초기화
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
