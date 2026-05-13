import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Metronome from './pages/Metronome';
import Fretboard from './pages/Fretboard';
import ScaleBuilder from './pages/ScaleBuilder';
import ChordBuilder from './pages/ChordBuilder';
import VoicingFinder from './pages/VoicingFinder';
import PracticeQuiz from './pages/PracticeQuiz';
import ChordLibrary from './pages/ChordLibrary';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Metronome />} />
        <Route path="/fretboard" element={<Fretboard />} />
        <Route path="/scales" element={<ScaleBuilder />} />
        <Route path="/chords" element={<ChordBuilder />} />
        <Route path="/chord-library" element={<ChordLibrary />} />
        <Route path="/voicings" element={<VoicingFinder />} />
        <Route path="/quiz" element={<PracticeQuiz />} />
      </Routes>
    </Layout>
  );
}
