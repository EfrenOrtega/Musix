import { useState, useRef, useEffect } from 'react'
import PlayerContext from '../context/PlayerContext'

import '../styles/player.css'
import { useContext } from 'react'


export default function Player({ cover, songInfo }) {

  let { name, artist, duration } = songInfo

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
    setDataSong
  } = useContext(PlayerContext)


  name = dataSong.name || name;
  artist = dataSong.artist || artist;
  duration = dataSong.duration || duration;
  cover = dataSong.cover || cover;

  const progress_ref = useRef(null)

  useEffect(() => {
    console.log(dataSong)
  }, [dataSong])


  return (
    <div className="player">

      <audio ref={audio_ref} src=''></audio>

      <div className='player-container'>
        <div className="song">
          <figure>
            <img src={`/images/${cover}`} alt="" />
          </figure>
          <div>
            <p><strong>{name}</strong></p>
            <p id='artist'>{artist}</p>
          </div>
        </div>

        <div className="controls">

          <img onClick={
            (e) => HandlePrev(
              e,
              setPlayPause,
              audio_ref,
              setPrevIsDisabled,
              setNextIsDisabled,
              setDataSong
            )}

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
              setDataSong
            )}

            src={!playPause
              ? '/icons/icon_controller-play.png'
              : '/icons/icon_controller-pause.png'}
            alt="Pause"
          />

          <img onClick={
            (e) => HandleNext(
              e,
              setPlayPause,
              audio_ref,
              setNextIsDisabled,
              setPrevIsDisabled,
              setDataSong
            )}

            src={!nextIsDisabled
              ? '/icons/icon_controller-next.png'
              : '/icons/icon_controller-next-disabled.png'}
            alt="Next"
          />

        </div>

        <div className="time-line">
          <progress ref={progress_ref} id="progress" value="10" max="100"></progress>
          <div className='values-time'>
            <p>00:30</p>
            <p>{duration}</p>
          </div>
        </div>

        <div className="btn-options">
          <img src={'/icons/icon-favorite.png'} alt="" />
          <img src={'/icons/icon-microphone.png'} alt="" />
          <img src={'/icons/icon-playlist-plus.png'} alt="" />
        </div>
      </div>
    </div>
  )
}