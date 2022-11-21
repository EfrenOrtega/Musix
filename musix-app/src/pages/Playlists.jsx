import '../styles/playlists.css'

import { useEffect } from "react"
import { useState, useContext } from "react"
import Header from "../components/Header"
import fetchAJAX from "../helpers/fetch"
import MusicBox from "../components/MusicBox"
import { Link } from "react-router-dom"
import FormCreatePlaylist from '../components/FormCreatePlaylist'
import PlaylistContext from '../context/PlaylistContext'
import Context from '../context/Context'

export default function Playlists() {
  const [update, setUpdate] = useState(false)

  const { setPlaylists, Playlists } = useContext(PlaylistContext)
  const { displayFormPlaylist, setDisplayFormPlaylist } = useContext(Context)

  useEffect(() => {
    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getplaylists/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        if (!res.results) return
        setPlaylists(res.results)
      },
      resError: (err) => {
        console.error(err)
      }
    })
  }, [update])

  const handleForm = () => {
    if (displayFormPlaylist) {
      setDisplayFormPlaylist(false)
    } else {
      setDisplayFormPlaylist(true)
    }
  }

  return (
    <div className='main-container'>
      <Header
        type="playlist"
        data={{
          title: 'Your Playlists'
        }}
        cover={["background-playlist.png"]}
        btns={[
          {
            'icon': ["icon-playlist-plus.png"],
            'event': handleForm,
          }
        ]}
      />
      <main className='playlist-container'>

        <div className="playlists">

          {Playlists &&
            Playlists.map((el, index) => {
              return <Link to="/playlist/0">
                <MusicBox
                  cover={el.background}
                  songInfo={
                    {
                      name: el.name
                    }
                  }
                  playlist={true}
                />
              </Link>
            })
          }

        </div>
      </main>
    </div>
  )
}