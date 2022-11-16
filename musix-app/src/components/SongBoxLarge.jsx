import '../styles/song-box.css';

import { useContext } from 'react';
import PlayerContext from '../context/PlayerContext';


export default function SongBoxLarge({ data }) {

  const { id, cover, name, artist, duration, album, created, pathSong } = data

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
    <div className="song-box large">

      <div className='container-cover-data'>
        <div className="cover">
          <span>
            <img
              onClick={(e) => playSong(e, content)}
              className="play-icon"
              src={'/icons/play-icon.png'}
              alt="Play"
            />
          </span>

          <figure>
            <img src={`/images/${cover}`} alt={name} />
          </figure>
        </div>

        <div className='data'>
          <p id='name'><strong>{name}</strong></p>
          <p id='artist'>{artist}</p>
        </div>
      </div>


      <div>
        <p>{album}</p>
      </div>

      <div>
        <p>{duration}</p>
      </div>

      <div>
        <p>{created}</p>
      </div>

      <div className="btn-options">
        <img src={'/icons/icon-favorite.png'} alt="" />
        <img src={'/icons/more-options.png'} alt="" />
      </div>
    </div>
  )
}