import '../styles/Home.css'

import Header from "../components/Header"
import MusicBox from "../components/MusicBox"
import SongBox from '../components/SongBox'
import Genres from '../components/Genres'
import Artist from '../components/Artist'

import responsiveBoxes from '../helpers/responsiveBoxes'
import { useEffect, useState, useContext, memo } from 'react'
import { Link } from 'react-router-dom';

import fetchAJAX from "../helpers/fetch"
import PlaylistContext from '../context/PlaylistContext'

const SongsLikes = [
  <MusicBox
    key={1}
    cover="jesseTabish.jpg"
    songInfo={
      {
        id: 8,
        name: "Dread Harp Blues",
        artist: "Jesse Tabish"
      }
    }
    pathSong='content/audio_test.mp3'
  />,
  <MusicBox
    key={2}
    cover="marilynManson.jpg"
    songInfo={
      {
        id: 9,
        name: "Killing Strangers",
        artist: "Marilyn Manson"
      }
    }
    pathSong=''
  />,
  <MusicBox
    key={3}
    cover="aurora.jpg"
    songInfo={
      {
        id: 10,
        name: "The Seed",
        artist: "Aurora"
      }
    }
    pathSong=''
  />,
  <MusicBox
    key={4}
    cover="massive attack.jpg"
    songInfo={
      {
        id: 20,
        name: "Angel",
        artist: "Massive Attack"
      }
    }
    pathSong=''
  />,
  <MusicBox
    key={5}
    cover="placebo.jpg"
    songInfo={
      {
        id: 30,
        name: "Battle for the Sun",
        artist: "Placebo"
      }
    }
    pathSong=''
  />,
  <MusicBox
    key={6}
    cover="goldKey.jpg"
    songInfo={
      {
        id: 40,
        name: "Creep in Slowly",
        artist: "Gold Key"
      }
    }
  />,
  <MusicBox
    key={7}
    cover="willOfThePeople.png"
    songInfo={
      {
        id: 50,
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />
]

const Playlistss = [
  <MusicBox
    cover={[
      'muse - drones.jpg',
      'Showbiz - Muse.jpg',
      'Simulation Theory - Muse.jpg',
      'The 2nd Law - Muse.jpg'
    ]}
    songInfo={
      {
        id: 1,
        name: "Playlist 02 😎",
      }
    }
  />,

  <MusicBox
    cover='natural.jpg'
    songInfo={
      {
        id: 2,
        name: "🌧️ Playlist 03",
      }
    }
  />,


  <MusicBox
    cover='rails.jpg'
    songInfo={
      {
        id: 3,
        name: "❄️ Playlist 04 ❄️",
      }
    }
  />,

  <MusicBox
    cover='caratula.png'
    songInfo={
      {
        id: 4,
        name: "Playlist 05 🤘",
      }
    }
  />,

  <MusicBox
    cover='willOfThePeople.png'
    songInfo={
      {
        id: 5,
        name: "Playlist 06 😎",
      }
    }
  />,

  <MusicBox
    cover='willOfThePeople.png'
    songInfo={
      {
        id: 6,
        name: "Playlist 07 😎",
      }
    }
  />,

  <MusicBox
    cover='caratula.png'
    songInfo={
      {
        id: 7,
        name: "Playlist 08 😎",
      }
    }
  />,

  <MusicBox
    cover='willOfThePeople.png'
    songInfo={
      {
        id: 8,
        name: "Playlist 09 😎",
      }
    }
  />,

  <MusicBox
    cover='caratula.png'
    songInfo={
      {
        id: 9,
        name: "Playlist 10 😎",
      }
    }
  />
]


export default function Home() {
  const { setPlaylists, Playlists } = useContext(PlaylistContext)

  const [quantity, setQuantity] = useState(null)
  const [SongsAddedTest, setSongsAddedTest] = useState(null)

  const handleResize = () => {
    setQuantity(responsiveBoxes(elementos))
  }

  useEffect(() => {

    if (!quantity) {
      setQuantity([3, 2, 3])
    }

    setTimeout(() => {
      handleResize()
    }, 500)

    window.addEventListener('resize', handleResize)

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

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getrecentsongs`,
      resSuccess: (res) => {
        setSongsAddedTest(res)
      },
      resError: (err) => {
        console.error(err)
      }
    })

  }, [])

  let elementos = [
    '.recently-added .music-box',
    '.your-likes .music-box',
    '.section-playlist .playlist .music-box'
  ]

  return (
    <div className='main-container'>
      <Header
        type="home"
        background='background-header-2.jpg'
        data={{
          title: "No Music No Life",
          creator: "Created by name user",
          created: "15/10/2022"
        }}
      />
      <main>
        <div className='container-section-1'>
          <section className='section-playlist'>
            <div className='title-section'>
              <Link to="/playlists">
                <h2>Your Playlists</h2>
              </Link>
              <img src="/icons/icon-arrow-right.png" alt="" />
            </div>

            <div className='playlist'>

              {(quantity && Playlists) &&
                Playlists.map((el, index) => {
                  if (index < quantity[2]) {
                    return (
                      <Link key={el._id} to={`/playlist/${el._id}`}>
                        <MusicBox
                          key={el._id}
                          cover={el.background}
                          songInfo={
                            {
                              id: el._id,
                              name: el.name,
                            }
                          }
                        />
                      </Link>
                    )
                  }
                })
              }

            </div>
          </section>

          <section className='section-recently'>
            <div className='title-section'>
              <h2>Recently Played</h2>
            </div>

            <div className='songs'>
              <SongBox
                cover="jesseTabish.jpg"
                songInfo={
                  {
                    name: "Dread Harp Blues",
                    artist: "Jesse Tabish",
                    duration: "02:30"
                  }
                }
              />
            </div>

            <div className='songs'>
              <SongBox
                cover="marilynManson.jpg"
                songInfo={
                  {
                    name: "Killing Strangers",
                    artist: "Marilyn Manson",
                    duration: "02:30"
                  }
                }
              />
            </div>

            <div className='songs'>
              <SongBox
                cover="HeroesDelSilencio.jpg"
                songInfo={
                  {
                    name: "Maldito Duende",
                    artist: "Héroes del Silencio",
                    duration: "02:30"
                  }
                }
              />
            </div>
          </section>

        </div>

        <section className='section-recently-added'>
          <div className='title-section'>
            <h2>Recently Added</h2>
            <img src="/icons/icon-arrow-right.png" alt="" />
          </div>

          <div className='recently-added'>
            {(quantity && SongsAddedTest) &&
              SongsAddedTest.map((el, index) => {
                if (index < (quantity[0] - 1)) {
                  return < MusicBox
                    key={el._id}
                    cover={[el.cover]}
                    songInfo={
                      {
                        id: el._id,
                        name: el.name,
                        artist: el.artist
                      }
                    }
                    pathSong={el.url}
                    nameClass="small"
                  />
                }

              })

            }


          </div>
        </section>

        <section className='section-your-likes'>
          <div className='title-section'>
            <h2>Your Likes</h2>
            <img src="/icons/icon-arrow-right.png" alt="" />
          </div>

          <div className='your-likes'>
            <MusicBox
              cover="willOfThePeople.png"
              songInfo={
                {
                  name: "Will of The People",
                  artist: "Muse"
                }
              }
            />
            {quantity &&
              SongsLikes.map((el, index) => {
                if (index < quantity[1]) {
                  return SongsLikes[index - 1]
                }
              })

            }
          </div>

        </section>

        <section className='section-genres'>
          <div className='title-section'>
            <h2>Genres</h2>
            <img src="/icons/icon-arrow-right.png" alt="" />
          </div>

          <div className='genres'>
            <Genres
              cover="willOfThePeople.png"
              genre="Rock"
            />

            <Genres
              cover="willOfThePeople.png"
              genre="Pop"
            />

            <Genres
              cover="badBunny.jpg"
              genre="Reggaeton"
            />

            <Genres
              cover="willOfThePeople.png"
              genre="Pop"
            />

            <Genres
              cover="twentyOnePilots.jpg"
              genre="Pop"
            />

          </div>


        </section>

        <section className='section-artist'>
          <div className='title-section'>
            <h2>Artist</h2>
            <img src="/icons/icon-arrow-right.png" alt="" />
          </div>

          <div className='artist'>
            <Artist
              cover="muse.jpg"
              artist="Muse"
            />

            <Artist
              cover="twentyOnePilots.jpeg"
              artist="Twenty One Pilots"
            />

            <Artist
              cover="radioHead.jpeg"
              artist="RadioHead"
            />

            <Artist
              cover="theStrokes.jpeg"
              artist="The Strokes"
            />

            <Artist
              cover="BlondeRedheadArtist.jpg"
              artist="Blonde Redhead"
            />

            <Artist
              cover="AC-DC.jpeg"
              artist="AC/DC"
            />

            <Artist
              cover="interpol.jpeg"
              artist="Interpol"
            />
          </div>

        </section>

      </main>
    </div>
  )
}