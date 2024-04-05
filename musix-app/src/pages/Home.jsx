import { useEffect, useState, useContext,  useRef, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query'



import '../styles/Home.css'

import Header from "../components/Header"
import MusicBox from "../components/MusicBox"

import SongBox from '../components/SongBox'
import Genres from '../components/Genres'
import Artist from '../components/Artist'

import responsiveBoxes from '../helpers/responsiveBoxes'

import fetchAJAX from "../helpers/fetch"
import PlaylistContext from '../context/PlaylistContext'
import Context from '../context/Context';

export default function Home() {
  const { dataPlaylists, refetchCachePlaylists} = useContext(PlaylistContext)
  const { setRisize} = useContext(Context)


  const [quantity, setQuantity] = useState([4,2,4])

  const containers = useRef({
    recentlyAdded:null,
    yourLikes:null,
    playlist:null
  });

  const handleResize = (containers) => {
    setQuantity(responsiveBoxes(containers))
  }

  const getHistory = useCallback(()=>{
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getHistory/3/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  const getRecentlyAdded = useCallback(()=>{
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getrecentsongs/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        console.log(res)
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  const getYourLikes = useCallback(()=>{
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getrecommendedsongs/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        if (res.length == 0) return
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  const getArtists = useCallback(()=>{
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getartists`,
      resSuccess: (res) => {
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  //CACHENING
  const {data:recentlyPlayed} = useQuery(['recentlyPlayed'], getHistory,
  {
    staleTime:Infinity,
    keepPreviousData:true,
    cacheTime:40 * 40 * 1000
  })

  const {data:SongsAddedTest} = useQuery(['recentlyAdded'], getRecentlyAdded,
  {
    staleTime: 20 * 10000,
    keepPreviousData:true,
    cacheTime:40 * 40 * 1000
  })

  const {data:likes} = useQuery(['likes'], getYourLikes,
  {
    staleTime:Infinity,
    keepPreviousData:true,
    cacheTime:40 * 40 * 1000
  })

  const {data:artists} = useQuery(['artists'], getArtists,
  {
    staleTime: 200 * 10000,
    keepPreviousData:true,
    cacheTime:40 * 40 * 1000
  })


  useEffect(() => {

    refetchCachePlaylists()

    window.addEventListener('resize', e=>{
      setRisize(e)
      handleResize(containers)
    })

    let quantityArr = responsiveBoxes(containers);
    setQuantity(quantityArr)
  }, [])


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
          <section  ref={el=>containers.current.playlist = el}  className='section-playlist'>
            <div className='title-section'>
              <Link to="/playlists">
                <h2>Your Playlists</h2>
              </Link>
              <img src="/icons/icon-arrow-right.png" alt="" />
            </div>


            <div className='playlist'>
              {(quantity && dataPlaylists) &&
                dataPlaylists.map((el, index) => {
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
                  } else {
                    console.log("ERROR", quantity[1])
                  }
                })                
              }

            </div>
          </section>

          <section className='section-recently'>
            <div className='title-section'>
              <h2>Recently Played</h2>
            </div>

            {recentlyPlayed &&
              recentlyPlayed.map((song, index) => {
                return <div className='songs' key={`${song._id}${index}`}>
                  <SongBox
                    cover={song.cover}
                    songInfo={
                      {
                        id : song._id,
                        name: song.name,
                        artist: song.artist,
                        duration: song.duration,
                        lyrics : song.lyrics,
                        favoriteSong:song.favorite,
                        licence : song.licence
                      }
                    }
                    pathSong = {song.url}
                  />
                </div>
              })
            }

          </section>

        </div>

        <section className='section-recently-added'>
          <div className='title-section'>
            <h2>Recently Added</h2>
            <img src="/icons/icon-arrow-right.png" alt="" />
          </div>

          <div ref={el=>containers.current.recentlyAdded = el} className='recently-added'>
            {(quantity && SongsAddedTest) &&
              SongsAddedTest.map((el, index) => {
                if (index < (quantity[0])) {
                  return < MusicBox
                    key={el._id}
                    cover={[el.cover]}
                    songInfo={
                      {
                        id: el._id,
                        name: el.name,
                        artist: el.artist,
                        favoriteSong:el.favorite,
                        duration : el.duration,
                        licence : el.licence
                      }
                    }
                    pathSong={el.url}
                    nameClass="small"
                    lyrics = {el.lyrics}
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

            <div ref={el=>containers.current.yourLikes = el}  className='your-likes'>
              
              {
                likes &&
                likes.map((song, index) => {
                  if (index < (quantity[1]))
                    return <MusicBox
                      key={song._id}
                      cover={[song.cover]}
                      songInfo={
                        {
                          id: song._id,
                          name: song.name,
                          artist: song.artist,
                          favoriteSong:song.favorite,
                          duration : song.duration,
                          licence : song.licence
                        }
                      }
                      pathSong={song.url}
                      lyrics = {song.lyrics}
                    />

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
              cover="rock.png"
              genre="Rock"
            />

            <Genres
              cover="pop.png"
              genre="Pop"
            />

            <Genres
              cover="reggaeton.png"
              genre="Reggaeton"
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
              artists.map(artist => {
                return <Link key={artist.id} to={`/artist/${artist.id}/${artist.name}`}>
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