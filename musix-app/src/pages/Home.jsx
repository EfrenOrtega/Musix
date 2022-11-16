import '../styles/Home.css'

import Header from "../components/Header"
import MusicBox from "../components/MusicBox"
import SongBox from '../components/SongBox'
import Genres from '../components/Genres'
import Artist from '../components/Artist'

import responsiveBoxes from '../helpers/responsiveBoxes'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';



const SongsAdded = [
  <MusicBox
    cover="blondeRedhead.jpg"
    songInfo={
      {
        name: "In Particular",
        artist: "Blonde Redhead"
      }
    }
  />,
  <MusicBox
    cover="The 2nd Law - Muse.jpg"
    songInfo={
      {
        name: "Liquid State",
        artist: "Muse"
      }
    }
  />,
  <MusicBox
    cover="vacationsVibes.jpg"
    songInfo={
      {
        name: "Young",
        artist: "Vacations"
      }
    }
  />,
  <MusicBox
    cover="radioheadHail.jpg"
    songInfo={
      {
        name: "A wolf At the Door",
        artist: "Radiohead"
      }
    }
  />,
  <MusicBox
    cover="billieEilishWhenWe.jpg"
    songInfo={
      {
        name: "You should see me in a cry",
        artist: "Billie Eilish"
      }
    }
  />,
  <MusicBox
    cover="BonesUnrendered.jpg"
    songInfo={
      {
        name: "CtrlAltDelete",
        artist: "Bones"
      }
    }
  />,
  <MusicBox
    cover="BonesNoReddemingQualities.jpg"
    songInfo={
      {
        name: "Oxygen",
        artist: "Bones"
      }
    }
  />
]

const SongsLikes = [
  <MusicBox
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

const Playlists = [
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

  const [quantity, setQuantity] = useState(null)

  const handleResize = () => {
    setQuantity(responsiveBoxes(elementos))
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
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
              <h2>Your Playlists</h2>
              <img src="/icons/icon-arrow-right.png" alt="" />
            </div>

            <div className='playlist'>
              <Link to="/playlist/0">
                <MusicBox
                  cover={[
                    'badbunny - verano sin tí.jpg',
                    'LosBunkers - Velocidad de la Luz.jpg',
                    'LosDaniels - A casa.jpg',
                    'provenza-karol G.jpg'
                  ]}
                  songInfo={
                    {
                      name: "Playlist 01 🎉🎉",
                    }
                  }
                  playlist={true}
                />
              </Link>

              {quantity &&
                Playlists.map((el, index) => {
                  if (index < quantity[2]) {
                    return (
                      <Link to={`/playlist/${index}`}>
                        {Playlists[index - 1]}
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
              SongsAdded.map((el, index) => {
                if (index < quantity[0]) {
                  return SongsAdded[index - 1]
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