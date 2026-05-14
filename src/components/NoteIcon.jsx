const NOTE_PATHS = {
  q: (color) => (
    // quarter note ♩
    <svg viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="4.5" cy="16.5" rx="4" ry="2.8" transform="rotate(-15 4.5 16.5)" fill={color} />
      <rect x="8" y="2" width="1.5" height="14" fill={color} />
    </svg>
  ),
  e: (color) => (
    // eighth note ♪
    <svg viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="4.5" cy="16.5" rx="4" ry="2.8" transform="rotate(-15 4.5 16.5)" fill={color} />
      <rect x="8" y="2" width="1.5" height="14" fill={color} />
      <path d="M9.5 2 C13 3.5 13 7 9.5 8" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  ),
  s: (color) => (
    // sixteenth note
    <svg viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="4.5" cy="16.5" rx="4" ry="2.8" transform="rotate(-15 4.5 16.5)" fill={color} />
      <rect x="8" y="2" width="1.5" height="14" fill={color} />
      <path d="M9.5 2 C13 3.5 13 7 9.5 8" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M9.5 6 C13 7.5 13 11 9.5 12" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  ),
};

export default function NoteIcon({ id = 'q', color = 'currentColor', size = 16 }) {
  const render = NOTE_PATHS[id] ?? NOTE_PATHS.q;
  return (
    <span style={{ display: 'inline-flex', width: size, height: size * 1.5 }}>
      {render(color)}
    </span>
  );
}
