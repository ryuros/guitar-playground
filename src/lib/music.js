export const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const NOTES_DISPLAY = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];

export const NOTE_NAMES_FLAT = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

export function noteIndex(name) {
  const sharp = NOTES.indexOf(name.replace('b','').replace('#','#'));
  if (sharp !== -1 && name === NOTES[sharp]) return sharp;
  const idx = NOTES.indexOf(name);
  if (idx !== -1) return idx;
  const flatIdx = NOTE_NAMES_FLAT.indexOf(name);
  return flatIdx;
}

export const SCALE_FORMULAS = {
  'Major (Ionian)':       [0,2,4,5,7,9,11],
  'Natural Minor (Aeolian)':[0,2,3,5,7,8,10],
  'Harmonic Minor':       [0,2,3,5,7,8,11],
  'Melodic Minor':        [0,2,3,5,7,9,11],
  'Major Pentatonic':     [0,2,4,7,9],
  'Minor Pentatonic':     [0,3,5,7,10],
  'Blues':                [0,3,5,6,7,10],
  'Dorian':               [0,2,3,5,7,9,10],
  'Phrygian':             [0,1,3,5,7,8,10],
  'Lydian':               [0,2,4,6,7,9,11],
  'Mixolydian':           [0,2,4,5,7,9,10],
  'Locrian':              [0,1,3,5,6,8,10],
};

export const INTERVAL_NAMES = ['R','b2','2','b3','3','4','#4/b5','5','#5/b6','6','b7','7'];
export const INTERVAL_FULL = [
  'Perfect Unison (Root)','Minor 2nd','Major 2nd','Minor 3rd',
  'Major 3rd','Perfect 4th','Tritone','Perfect 5th',
  'Minor 6th','Major 6th','Minor 7th','Major 7th',
];

export const CHORD_FORMULAS = {
  'Major':              [0,4,7],
  'Minor':              [0,3,7],
  'Dominant 7th':       [0,4,7,10],
  'Major 7th':          [0,4,7,11],
  'Minor 7th':          [0,3,7,10],
  'Diminished':         [0,3,6],
  'Half-Diminished':    [0,3,6,10],
  'Augmented':          [0,4,8],
  'Sus2':               [0,2,7],
  'Sus4':               [0,5,7],
  'Major 9th':          [0,4,7,11,14],
  'Minor 9th':          [0,3,7,10,14],
};

export const CHORD_INTERVAL_LABELS = {
  0:'R', 1:'b2', 2:'2', 3:'b3', 4:'3', 5:'4',
  6:'b5', 7:'5', 8:'b6', 9:'6', 10:'b7', 11:'7', 14:'9',
};

// Standard tuning: low E to high e (semitone index 0=C)
export const STANDARD_TUNING = [4,9,2,7,11,4]; // E A D G B e
export const STRING_NAMES = ['e','B','G','D','A','E']; // high to low display

export function getScaleNotes(rootName, scaleName) {
  const rootIdx = NOTES.indexOf(rootName);
  if (rootIdx === -1) return [];
  const formula = SCALE_FORMULAS[scaleName] || SCALE_FORMULAS['Major (Ionian)'];
  return formula.map(interval => ({
    note: NOTES[(rootIdx + interval) % 12],
    interval,
    intervalName: INTERVAL_NAMES[interval],
    isRoot: interval === 0,
  }));
}

export function getChordNotes(rootName, quality) {
  const rootIdx = NOTES.indexOf(rootName);
  if (rootIdx === -1) return [];
  const formula = CHORD_FORMULAS[quality] || CHORD_FORMULAS['Major'];
  return formula.map(interval => ({
    note: NOTES[(rootIdx + interval % 12) % 12],
    interval: interval % 12,
    intervalName: CHORD_INTERVAL_LABELS[interval] || INTERVAL_NAMES[interval % 12],
    isRoot: interval === 0,
  }));
}

export function getFretboardNotes(rootName, formula, numFrets = 15) {
  const rootIdx = NOTES.indexOf(rootName);
  const noteSet = new Set(formula.map(i => (rootIdx + i) % 12));
  const result = [];
  // strings: index 0 = low E, ... 5 = high e
  const TUNING_LOW_TO_HIGH = [4,9,2,7,11,4];
  for (let s = 0; s < 6; s++) {
    const row = [];
    for (let f = 0; f <= numFrets; f++) {
      const semitone = (TUNING_LOW_TO_HIGH[s] + f) % 12;
      const inScale = noteSet.has(semitone);
      const interval = inScale ? (semitone - rootIdx + 12) % 12 : null;
      row.push({
        note: NOTES[semitone],
        inScale,
        isRoot: semitone === ((rootIdx + 12) % 12),
        interval,
        intervalName: interval !== null ? INTERVAL_NAMES[interval] : null,
      });
    }
    result.push(row);
  }
  return result; // result[0] = low E, result[5] = high e
}

export const SCALE_FORMULA_DISPLAY = {
  'Major (Ionian)':       'W-W-H-W-W-W-H',
  'Natural Minor (Aeolian)':'W-H-W-W-H-W-W',
  'Harmonic Minor':       'W-H-W-W-H-A2-H',
  'Melodic Minor':        'W-H-W-W-W-W-H',
  'Major Pentatonic':     'W-W-m3-W-m3',
  'Minor Pentatonic':     'm3-W-W-m3-W',
  'Blues':                'm3-W-H-H-m3-W',
  'Dorian':               'W-H-W-W-W-H-W',
  'Phrygian':             'H-W-W-W-H-W-W',
  'Lydian':               'W-W-W-H-W-W-H',
  'Mixolydian':           'W-W-H-W-W-H-W',
  'Locrian':              'H-W-W-H-W-W-W',
};

export const CHORD_SYMBOL = {
  'Major': 'maj', 'Minor': 'm', 'Dominant 7th': '7',
  'Major 7th': 'maj7', 'Minor 7th': 'm7', 'Diminished': 'dim',
  'Half-Diminished': 'm7b5', 'Augmented': 'aug',
  'Sus2': 'sus2', 'Sus4': 'sus4', 'Major 9th': 'maj9', 'Minor 9th': 'm9',
};

export const CHORD_INTERVAL_DISPLAY = {
  'Major':          [{label:'ROOT',note:'R'},{label:'MAJOR 3RD',note:'3'},{label:'PERFECT 5TH',note:'5'}],
  'Minor':          [{label:'ROOT',note:'R'},{label:'MINOR 3RD',note:'b3'},{label:'PERFECT 5TH',note:'5'}],
  'Dominant 7th':   [{label:'ROOT',note:'R'},{label:'MAJOR 3RD',note:'3'},{label:'PERFECT 5TH',note:'5'},{label:'MINOR 7TH',note:'b7'}],
  'Major 7th':      [{label:'ROOT',note:'R'},{label:'MAJOR 3RD',note:'3'},{label:'PERFECT 5TH',note:'5'},{label:'MAJOR 7TH',note:'7'}],
  'Minor 7th':      [{label:'ROOT',note:'R'},{label:'MINOR 3RD',note:'b3'},{label:'PERFECT 5TH',note:'5'},{label:'MINOR 7TH',note:'b7'}],
  'Diminished':     [{label:'ROOT',note:'R'},{label:'MINOR 3RD',note:'b3'},{label:'DIM 5TH',note:'b5'}],
  'Half-Diminished':[{label:'ROOT',note:'R'},{label:'MINOR 3RD',note:'b3'},{label:'DIM 5TH',note:'b5'},{label:'MINOR 7TH',note:'b7'}],
  'Augmented':      [{label:'ROOT',note:'R'},{label:'MAJOR 3RD',note:'3'},{label:'AUG 5TH',note:'#5'}],
};
