import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Metronome from './pages/Metronome';
import Fretboard from './pages/Fretboard';
import ScaleBuilder from './pages/ScaleBuilder';
import ChordBuilder from './pages/ChordBuilder';
import VoicingFinder from './pages/VoicingFinder';
import ChordLibrary from './pages/ChordLibrary';
import Theory from './pages/Theory';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Metronome />} />
        <Route path="/chord-library" element={<ChordLibrary />} />
        <Route path="/fretboard" element={<Fretboard />} />
        <Route path="/theory" element={<Theory />} />
        <Route path="/scales" element={<ScaleBuilder />} />
        <Route path="/chords" element={<ChordBuilder />} />
        <Route path="/voicings" element={<VoicingFinder />} />
      </Routes>
    </Layout>
  );
}
