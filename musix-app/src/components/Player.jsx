import '../styles/player.css'

import { useState, useRef, useEffect, useContext } from 'react'

import PlayerContext from '../context/PlayerContext'
import PlaylistContext from '../context/PlaylistContext'

import { Slider } from './micro/Slider'
import ListPlaylist from './micro/ListPlaylist'

import fetchAJAX from '../helpers/fetch'
import { Link } from 'react-router-dom'



const Player = ({ cover, songInfo }) => {

  let { name, artist, duration } = songInfo

  const iconAddPlaylist = useRef(null)

  const {
    playPause,
    setPlayPause,
    nextIsDisabled,
    setNextIsDisabled,
    prevIsDisabled,
    setPrevIsDisabled,
    HandlePlayPause,
    HandleNext,
    HandlePrev,
    audio_ref,
    dataSong,
    setDataSong,
    keysFunctions,
    HandleLoop,
    HandleVolumeApp,
    running,
    content,
    setRunning,
    favorite,
    setFavorite,
  } = useContext(PlayerContext)

  const { favoriteSongs, setRun, run } = useContext(PlaylistContext)

  name = dataSong.name || name;
  artist = dataSong.artist || artist;
  duration = dataSong.duration || duration;
  cover = dataSong.cover || cover;


  //=====================================
  const [loop, setLoop] = useState(0)
  //=====================================

  const [volume, setVolume] = useState(20);
  const [displayVolume, setDisplayVolume] = useState(false)
  const [active, setActive] = useState(true)
  const [displayListPlaylist, setDisplayListPlaylist] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})

  const [data, setData] = useState(null)


  useEffect(() => {
    console.log(dataSong)
    if (localStorage.getItem('volume')) {
      audio_ref.current.volume = localStorage.getItem('volume') / 100;
    }

    if (localStorage.getItem('idSong') && localStorage.getItem('executed') == 'false') {
      let id = localStorage.getItem('idSong')

      fetch(`http://${location.hostname}:5000/getsong/${id}`)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
          console.log(json.data)
          content.unshift({
            _id: json.data._id,
            name: json.data.name,
            artist: json.data.artist,
            lyrics: json.data.lyrics,
            cover: `${json.data.cover}`,
            url: json.data.url
          })
          setData({ name: json.data.name, artist: json.data.artist, cover: json.data.cover, lyrics:json.data.lyrics})
        })
        .catch(err => {
          console.log(err)
        })



      localStorage.setItem('executed', true)
    } else {
      setData(null)
    }

    if (run) {
      setRun(false)
    } else {
      setRun(true)
    }

    keysFunctions(
      undefined,
      setPlayPause,
      audio_ref,
      setNextIsDisabled,
      setPrevIsDisabled,
      setDataSong,
      setRunning)
  }, [dataSong])


  const handleVolume = (e) => {
    localStorage.setItem('volume', e.target.value)
    audio_ref.current.volume = e.target.value / 100;
    setVolume(e.target.value)
  }


  const addFavorite = (e) => {
    let dateNow = new Date(Date.now())
    let dateTime = new Date(dateNow.getTime() - dateNow.getTimezoneOffset() * 60000).toISOString()
    let date = dateTime.split('T')[0]

    fetchAJAX({
      url: `http://${location.hostname}:5000/addfavorite/${dataSong._id}/${localStorage.getItem('id')}/${date}`,
      resSuccess: (res) => {
        if (res.status) {
          console.log(res)
        } else {
          console.log(res.message)
        }
      },
      resError: (err) => {
        console.log(err)
      }
    })

    if (favorite) {
      setFavorite(false)
    } else {
      setFavorite(true)
    }

  }

  const addToPlaylist = (e) => {

    setPointerXY({
      'x': e.target.getBoundingClientRect().left,
      'y': e.target.getBoundingClientRect().top,
      'width': e.target.getBoundingClientRect().width
    })


    if (displayListPlaylist) {
      setDisplayListPlaylist(false)
    } else {
      setDisplayListPlaylist(true)
    }

  }

  const foundFavorites = () => {
    let found = favoriteSongs.find(favorite => favorite == dataSong._id)
    return found
  }

  return (
    <div className="player">

      {displayListPlaylist &&
        <ListPlaylist
          visibility={visibility}
          setVisibility={setVisibility}
          pointerXY={pointerXY}
          iconAddPlaylist={iconAddPlaylist}
          setDisplayListPlaylist={setDisplayListPlaylist}
        />
      }

      <audio
        onPlaying={(e) => {
          setRunning(true)
          setActive(false)
        }}
        ref={audio_ref} src=''></audio>

      <div className='player-container'>
        <div className="song">
          <figure>

            {
              data ?
                <img src={`${data.cover}`} alt="Song Cover" />
                :
                cover &&
                <img src={`${cover}`} alt="Song Cover" />
            }
          </figure>
          <div className='data-song'>
            {data ?
              <>
                <p className='song-name'><strong>{data.name}</strong></p>
                <p id='artist'>{data.artist}</p>
              </>
              :
              <>
                <p className='song-name'><strong>{name}</strong></p>
                <p id='artist'>{artist}</p>
              </>
            }
          </div>
        </div>

        <div className='container-controls-options'>
          <div className="controls">

            <img onClick={
              (e) => {
                setFavorite(false)
                HandlePrev(
                  e,
                  setPlayPause,
                  audio_ref,
                  setPrevIsDisabled,
                  setNextIsDisabled,
                  setDataSong,
                  setRunning
                )
              }}

              src={!prevIsDisabled
                ? '/icons/icon-controller-previous.png'
                : '/icons/icon-controller-previous-disabled.png'
              } alt="Previous"
            />

            <img onClick={
              (e) => HandlePlayPause(
                e,
                playPause,
                setPlayPause,
                audio_ref,
                setNextIsDisabled,
                setPrevIsDisabled,
                setDataSong,
                setRunning
              )}

              src={!playPause
                ? '/icons/icon_controller-play.png'
                : '/icons/icon_controller-pause.png'}
              alt="Pause"
            />

            <img onClick={
              (e) => {
                setActive(true)
                setFavorite(false)
                HandleNext(
                  e,
                  setPlayPause,
                  audio_ref,
                  setNextIsDisabled,
                  setPrevIsDisabled,
                  setDataSong,
                  setRunning
                )

              }}

              src={!nextIsDisabled
                ? '/icons/icon_controller-next.png'
                : '/icons/icon_controller-next-disabled.png'}
              alt="Next"
            />

            <img onClick={
              (e) => HandleLoop(e, loop, setLoop)} className='icon-loop' src={loop == 0
                ? '/icons/icon-loop-enabled.png'
                : (loop == 1)
                  ? '/icons/icon-loop-1.png'
                  : '/icons/icon-loop-actived.png'
              } alt="" />

          </div>

          <Slider
            running={running}
            setRunning={setRunning}
            playPause={playPause}
            loop={loop}
          />

          <div className="btn-options">

            <div className={displayVolume ? `btn-option is-active` : `btn-option`} onMouseEnter={(e) => HandleVolumeApp(e, setDisplayVolume, displayVolume)} onMouseLeave={(e) => HandleVolumeApp(e, setDisplayVolume, displayVolume)} >

              <div className={displayVolume ? `volume is-active` : `volume`}>
                <div className='volume-container'>
                  <div className='slider-bar' style={{ width: `${volume}%` }}></div>
                  <input type="range" name="" id="volume-slider" min="0" max="100" step="1" value={volume} onChange={(e) => handleVolume(e)} />
                </div>
              </div>

              {volume == 0 ?
                <img src="/icons/volume-off.png" alt="volume" />
                :
                (volume > 0 && volume <= 20) ?
                  <img src="/icons/volume_low.png" alt="volume" />
                  :
                  (volume > 20 && volume < 50) ?
                    <img src="/icons/volume_med.png" alt="volume" />
                    :
                    <img src="/icons/volume.png" alt="volume" />
              }

            </div>

            <div className='btn-option'>
              {
                favoriteSongs &&
                  foundFavorites() ?
                  <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-active.png'} alt="Favorite" />
                  :
                  favorite ?
                    <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-active.png'} alt="Favorite" />
                    :
                    <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite.png'} alt="Favorite" />


              }

            </div>

            <div className='btn-option'>
              {data ?
              data.lyrics ?
                <Link to={`/lyrics/${localStorage.getItem('idSong')}`}>
                  <img src={'/icons/icon-microphone-active.png'} alt="Microphone" />
                </Link>
              :
                <img src={'/icons/icon-microphone.png'} alt="Microphone" />     
                :
                
                dataSong &&
                dataSong.lyrics ?
                  <Link to={`/lyrics/${localStorage.getItem('idSong')}`}>
                    <img src={'/icons/icon-microphone-active.png'} alt="Microphone" />
                  </Link>
                :
                <img src={'/icons/icon-microphone.png'} alt="Microphone" />
              }

              
            </div>

            <div className='btn-option'>
              <img ref={iconAddPlaylist} onClick={(e) => addToPlaylist(e)} src={'/icons/icon-playlist-plus.png'} alt="Add Playlist" />
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}


export default Player