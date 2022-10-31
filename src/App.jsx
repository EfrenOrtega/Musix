import './styles/App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Menu from "./components/Menu"
import Player from "./components/Player"
import Playlist from './pages/Playlist';
import Auth from './pages/Auth';


export default function App() {
  return (
    <>
      {
        localStorage.getItem('login') == 'true' ?
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
          :
          <Auth />
      }

    </>
  );
}
