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

export default function Home() {
  const { setPlaylists, Playlists } = useContext(PlaylistContext)

  const [quantity, setQuantity] = useState(null)
  const [SongsAddedTest, setSongsAddedTest] = useState(null)
  const [artists, setArtists] = useState(null)
  const [likes, setLikes] = useState(null)

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

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getartists`,
      resSuccess: (res) => {
        setArtists(res)
      },
      resError: (err) => {
        console.error(err)
      }
    })


    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getrecommendedsongs/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        if (res.length == 0) return
        setLikes(res)
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
        background='background-header-3.jpg'
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
                          type="playlist"
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

        {likes &&
          <section className='section-your-likes'>
            <div className='title-section'>
              <h2>Your Likes</h2>
              <img src="/icons/icon-arrow-right.png" alt="" />
            </div>

            <div className='your-likes'>


              {
                likes.map((song, index) => {
                  if (index < (quantity[0] - 1))
                    return <MusicBox
                      key={song._id}
                      cover={[song.cover]}
                      songInfo={
                        {
                          id: song._id,
                          name: song.name,
                          artist: song.artist
                        }
                      }
                      pathSong={song.url}
                    />

                })
              }


            </div>

          </section>
        }
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

            {
              artists &&
              console.log(artists)

            }


            {
              artists &&
              artists.map(artist => {
                return <Link key={artist.id} to={`/artist/${artist.id}`}>
                  <Artist
                    cover={artist.profile_image}
                    artist={artist.name}
                  />
                </Link>
              })

            }

          </div>

        </section>

      </main>
    </div>
  )
}