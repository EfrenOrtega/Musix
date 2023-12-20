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
import Profile from './pages/Profile';
import Results from './pages/Results';
import Queue from './pages/Queue';

localStorage.setItem('executed', false)


export default function App() {

  const { displayFormPlaylist, alertVisible, msgAlert } = useContext(Context);
  return (
    <>
      <div className={alertVisible ? !msgAlert.status ? 'msg-alert error' : 'msg-alert correct' : 'msg-alert'}>
        <p>{msgAlert.msg}</p>
      </div>

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
                  <Route path="/artist/:id/:name" element={<Artist />}></Route>
                  <Route path="/lyrics/:id" element={<Lyrics />}></Route>
                  <Route path="/profile" element={<Profile />}></Route>
                  <Route path='/results/:search' element={<Results />}></Route>
                  <Route path='/queue' element={<Queue/>}></Route>
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
