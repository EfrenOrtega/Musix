import './styles/App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

//  Import TestComponents
import TestComponents from './pages/TestComponents';
import Home from './pages/Home';
import Menu from "./components/Menu"
import Player from "./components/Player"
import Playlist from './pages/Playlist';


export default function App() {
  return (
    <>
      <Menu />
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/playlist/:id" element={<Playlist />}></Route>
        </Routes>

      </Router>

      <Player
        cover="willOfThePeople.png"
        songInfo={
          {
            name: "Will Of The People",
            artist: "Muse",
            duration: "02:30"
          }
        }
      />

    </>
  );
}
