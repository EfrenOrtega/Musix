import { useContext } from 'react';

import '../styles/music-box.css'
import { Link } from 'react-router-dom';
import PlayerContext from '../context/PlayerContext';


export default function MusicBox({ cover, songInfo, pathSong }) {

  const { id, name, artist } = songInfo

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
    content
  } = useContext(PlayerContext)


  const playSong = (e, content) => {

    if (content[0].id == id) return

    content.unshift({
      id,
      name,
      artist,
      cover: cover,
      src: pathSong
    })

    console.log(content)

    HandlePlayPause(
      e,
      playPause,
      setPlayPause,
      audio_ref,
      setNextIsDisabled,
      setPrevIsDisabled,
      setDataSong
    )
  }


  return (
    <div className="music-box">

      <div className="cover">

        {/*<span>
          <Link to="/playlist/01">
            <img className='play-icon' src={"/icons/play-icon.png"} alt="Play" />
          </Link>
          </span>
        */}

        <span>
          <a onClick={(e) => playSong(e, content)}>
            <img className='play-icon' src={"/icons/play-icon.png"} alt="Play" />
          </a>
        </span>

        <figure>
          <img src={`/images/${cover}`} alt="" />
        </figure>
      </div>

      <p><strong>{name}</strong></p>

      {artist &&
        <p>{artist}</p>
      }

    </div>
  )
}