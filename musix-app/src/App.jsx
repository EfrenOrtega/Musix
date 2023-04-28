import './styles/App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Menu from "./components/Menu"
import Player from "./components/Player"
import Playlist from './pages/Playlist';
import Playlists from './pages/Playlists';
import Auth from './pages/Auth';
import Lyrics from './pages/Lyrics'

import { PlayerProvider } from './context/PlayerContext'
import { PlaylistProvider } from './context/PlaylistContext';
import Context from './context/Context'
import { useContext } from 'react';
import FormCreatePlaylist from './components/FormCreatePlaylist';
import Artist from './pages/Artist';



export default function App() {
  
  localStorage.setItem('volume', 20)
  localStorage.setItem('executed', false)
  const { displayFormPlaylist } = useContext(Context);
  return (
    <>
      {
        localStorage.getItem('login') == 'true' ?
          <Router>
            <PlayerProvider>
              <PlaylistProvider>
            <Menu />
                {displayFormPlaylist &&
                  <FormCreatePlaylist />
                }

                <Routes>
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/playlist/:id" element={<Playlist />}></Route>
                  <Route path='/playlists' element={<Playlists />}></Route>
                  <Route path="/artist/:id" element={<Artist />}></Route>
                  <Route path="/lyrics/:id" element={<Lyrics/>}></Route>
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

              </PlaylistProvider>
            </PlayerProvider>

          </Router>
          :
          <Auth />
      }
    </>
  );
}
