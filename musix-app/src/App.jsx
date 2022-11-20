import './styles/App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Menu from "./components/Menu"
import Player from "./components/Player"
import Playlist from './pages/Playlist';
import Playlists from './pages/Playlists';
import Auth from './pages/Auth';
import { PlayerProvider } from './context/PlayerContext'


export default function App() {
  return (
    <>
      {
        localStorage.getItem('login') == 'true' ?
          <Router>

            <Menu />

            <PlayerProvider>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/playlist/:idsong" element={<Playlist />}></Route>
                <Route path='/playlists' element={<Playlists />}></Route>
              </Routes>

              <Player
                cover=""
                songInfo={
                  {
                    name: "",
                    artist: "",
                    duration: ""
                  }
                }
              />
            </PlayerProvider>

          </Router>
          :
          <Auth />
      }
    </>
  );
}
