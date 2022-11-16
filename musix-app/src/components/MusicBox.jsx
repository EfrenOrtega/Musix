import { useContext } from 'react';

import '../styles/music-box.css'
import { Link } from 'react-router-dom';
import PlayerContext from '../context/PlayerContext';

export default function MusicBox({ cover, songInfo, pathSong, }) {

  const { id, name, artist } = songInfo

  const {
    playPause,
    setPlayPause,
    setNextIsDisabled,
    setPrevIsDisabled,
    HandlePlayPause,
    audio_ref,
    setDataSong,
    content,
    setRunning
  } = useContext(PlayerContext)


  const playSong = (e, content) => {

    if (content[0].id == id) return

    content.unshift({
      id,
      name,
      artist,
      cover: `images/${cover}`,
      src: pathSong
    })

    setRunning(false)

    HandlePlayPause(
      e,
      playPause,
      setPlayPause,
      audio_ref,
      setNextIsDisabled,
      setPrevIsDisabled,
      setDataSong,
      setRunning
    )
  }

  return (

    <div className="music-box">

      <div className="cover">

        <span>
          <div onClick={(e) => playSong(e, content)}>
            <img className='play-icon' src={"/icons/play-icon.png"} alt="Play" />
          </div>
        </span>


        {typeof cover == "object" ?
          <div className='generate-cover'>
            <img src={`/images/${cover[0]}`} alt="Song" />
            <img src={`/images/${cover[1]}`} alt="Song" />
            <img src={`/images/${cover[2]}`} alt="Song" />
            <img src={`/images/${cover[3]}`} alt="Song" />
          </div>
          :
          <div className='cover-img'>
            <img src={`/images/${cover}`} alt="Song" />
          </div>
        }


      </div>

      <p><strong>{name}</strong></p>

      {artist &&
        <p>{artist}</p>
      }

    </div>

  )
}