import '../styles/playlists.css'

import { useEffect } from "react"
import { useState } from "react"
import Header from "../components/Header"
import fetchAJAX from "../helpers/fetch"
import MusicBox from "../components/MusicBox"
import { Link } from "react-router-dom"
import FormCreatePlaylist from '../components/FormCreatePlaylist'

export default function Playlists() {
  const [dataPlaylist, setDataPlaylist] = useState()
  const [displayForm, setDisplayForm] = useState(false)
  const [update, setUpdate] = useState(false)


  useEffect(() => {
    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getplaylist/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        if (!res.results) return
        setDataPlaylist(res.results)
      },
      resError: (err) => {
        console.error(err)
      }
    })
  }, [update])

  const handleForm = () => {
    if (displayForm) {
      setDisplayForm(false)
    } else {
      setDisplayForm(true)
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
            'icon': ["icon-playlist-plus-active.png"],
            'event': handleForm,
          }
        ]}
      />
      <main className='playlist-container'>
        <div className='form-playlists'>

          <FormCreatePlaylist
            displayForm={displayForm}
            handleForm={handleForm}

            update={update}
            setUpdate={setUpdate}
          />

        </div>

        <div className="playlists">

          {dataPlaylist &&
            dataPlaylist.map((el, index) => {
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