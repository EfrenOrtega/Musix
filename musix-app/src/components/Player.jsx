import '../styles/player.css'

import { useState, useRef, useEffect, useContext } from 'react'

import Context from '../context/Context'
import PlayerContext from '../context/PlayerContext'
import PlaylistContext from '../context/PlaylistContext'

import { Slider } from './micro/Slider'
import ListPlaylist from './micro/ListPlaylist'

import fetchAJAX from '../helpers/fetch'
import { Link } from 'react-router-dom'

import { _doublyLinkedList, _doublyLinkedList as queue } from "../helpers/doublyLinkedList";


const Player = ({ cover, songInfo }) => {

  let { name, artist, duration, favoriteSong } = songInfo

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
    source_ref,
    dataSong,
    setDataSong,
    keysFunctions,
    HandleLoop,
    HandleVolumeApp,
    running,
    setRunning,
    favorite,
    setFavorite,
    setLoadedAudio,

    QUEUE,
    setQUEUE,
  } = useContext(PlayerContext)

  const { setFavorite: setFavoritePlaylist, refetchCachePlaylist } = useContext(PlaylistContext)
  const { setAlertVisible, setMsgAlert } = useContext(Context);


  name = dataSong.name || name;
  artist = dataSong.artist || artist;
  duration = dataSong.duration || duration;
  cover = dataSong.cover || cover;
  favoriteSong = dataSong.favorite || favoriteSong;

  //=====================================
  const [loop, setLoop] = useState('active')
  //=====================================

  const [volume, setVolume] = useState(localStorage.getItem('volume') || 70);
  const [displayVolume, setDisplayVolume] = useState(false)
  const [displayListPlaylist, setDisplayListPlaylist] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})

  const [data, setData] = useState(null)


  useEffect(() => {

    document.addEventListener('click', handleOutsideClick)

    //This only runs when the app starts, to load the last song the user listened to
    if (localStorage.getItem('idSong') && localStorage.getItem('executed') == 'false') {

      let id = localStorage.getItem('idSong')

      fetch(`http://${location.hostname}:5000/getsong/${id}/${localStorage.getItem('id')}`)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {

          /** Clear the List */
          _doublyLinkedList.clear()
          /** Add the Song playing, to the List */
          _doublyLinkedList.insertion_ending({
            _id: json.data._id,
            name: json.data.name,
            artist: json.data.artist,
            lyrics: json.data.lyrics,
            cover: `${json.data.cover}`,
            url: json.data.url,
            favorite: json.data.favorite,
            duration: json.data.duraction
          })
          setQUEUE(_doublyLinkedList)

          setFavorite(json.data.favorite)
          setData({ name: json.data.name, artist: json.data.artist, cover: json.data.cover, lyrics: json.data.lyrics, favorite: json.data.favorite })
        })
        .catch(err => {
          console.log(err)
        })

      localStorage.setItem('executed', true)
    } else {
      setData(null)
      setFavorite(favoriteSong)
    }

    keysFunctions(
      undefined,
      setPlayPause,
      audio_ref,
      source_ref,
      setNextIsDisabled,
      setPrevIsDisabled,
      setDataSong,
      setRunning)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }

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

        if (((data && data.favorite) || (dataSong && dataSong.favorite)) && favorite) {
          dataSong.favorite = false;
          setFavorite(false)
        } else {
          dataSong.favorite = true;
          setFavorite(true)
        }

        refetchCachePlaylist()

        if (res.status) {
          console.log(res)
        } else {
          console.log(res.message)
        }
      },
      resError: (err) => {
        console.log("Error to add favorite", err)

        setMsgAlert({ msg: 'Error to Add Song', status: false })
        setAlertVisible(true)

        setTimeout(() => {
          setAlertVisible(false)
        }, 1800)

        if ((data && data.favorite) || (dataSong && dataSong.favorite) && favorite) {
          setData({
            ...data,
            favorite: false
          })
          setFavorite(false)
        } else {
          setData({
            ...data,
            favorite: true
          })
          setFavorite(true)
        }

        setTimeout(() => {
          if (!data.favorite) {
            setData({
              ...data,
              favorite: false
            })
            setFavorite(false)
          } else {
            setData({
              ...data,
              favorite: true
            })
            setFavorite(true)
          }
        }, 300)
      }
    })

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


  const handleOutsideClick = (e) => {
    if (!e.target.matches('img')) {
      setDisplayListPlaylist(false)
    }
  }


  /** Function to know when a new song is load in the player */
  const HandleLoadedData = (e) => {
    setLoadedAudio(dataSong._id)
  }

  /** Function to know when the current song ends
  */
  const HandleEndSong = (e) => {
    setLoadedAudio(null)
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
        onLoadedData={HandleLoadedData}
        onEnded={HandleEndSong}
        id='audio'
        onPlaying={(e) => {
          setRunning(true)
        }}
        ref={audio_ref}>

        <source ref={source_ref} src='' type='audio/mp3'></source>

      </audio>

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

            {
              localStorage.getItem('idSong') ?
                <>
                  <img onClick={
                    (e) => {
                      setFavorite(false)
                      HandlePrev(
                        QUEUE,
                        setQUEUE,
                        e,
                        setPlayPause,
                        audio_ref,
                        source_ref,
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
                      QUEUE,
                      setQUEUE,
                      e,
                      playPause,
                      setPlayPause,
                      audio_ref,
                      source_ref,
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
                      setFavorite(false)
                      HandleNext(
                        QUEUE,
                        setQUEUE,
                        e,
                        setPlayPause,
                        audio_ref,
                        source_ref,
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


                  <img onClick={(e) => HandleLoop(e, loop, setLoop)} className='icon-loop'
                    src={(loop == 'enable')
                      ? '/icons/icon-loop-enabled.png'
                      : (loop == 'loop one')
                        ? '/icons/icon-loop-1.png'
                        : (loop == 'active') &&
                        '/icons/icon-loop-actived.png'
                    }
                    alt="" />
                </>
                :
                <>
                  <img src={'/icons/icon-controller-previous-disabled.png'} alt="Previous" />
                  <img src={'/icons/icon_controller-play-disabled.png'} alt="Play" />
                  <img src={'/icons/icon_controller-next-disabled.png'} alt="Next" />

                </>
            }

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


            {localStorage.getItem('idSong') ?

              <div className='btn-option'>
                {
                  data ?
                    data.favorite ?
                      <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-active.png'} alt="Favorite" />
                      :
                      <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite.png'} alt="Favorite" />
                    :
                    (dataSong && dataSong.favorite) ?
                      <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-active.png'} alt="Favorite" />
                      :
                      <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite.png'} alt="Favorite" />

                }

              </div>
              :

              <div className='btn-option'>
                <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-disabled.png'} alt="Favorite" />
              </div>

            }


            <div className='btn-option'>
              <Link to={"/queue"}>
                <img src={'/icons/queue.svg'} alt="" />
              </Link>
            </div>


            <div className='btn-option'>
              {/*Check if there are a lyrics for the current song, to display one of two icons*/}

              {
                dataSong &&
                  dataSong.lyrics ?
                  <Link to={`/lyrics/${localStorage.getItem('idSong')}`}>
                    <img src={'/icons/icon-microphone-active.png'} alt="Microphone" />
                  </Link>
                  :
                  <img src={'/icons/icon-microphone.png'} alt="Microphone" />
              }

            </div>


            {localStorage.getItem('idSong') ?

              <div className='btn-option'>
                <img ref={iconAddPlaylist} onClick={(e) => addToPlaylist(e)} src={'/icons/icon-playlist-plus.png'} alt="Add Playlist" />
              </div>

              :

              <div className='btn-option'>
                <img src={'/icons/icon-playlist-plus-disabled.png'} alt="Add Playlist" />
              </div>

            }


          </div>
        </div>

      </div>
    </div>
  )
}


export default Player