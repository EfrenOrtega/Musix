import { useContext } from 'react';

import '../styles/music-box.css'
import PlayerContext from '../context/PlayerContext';
import PlaylistContext from '../context/PlaylistContext';

export default function MusicBox({ cover, songInfo, pathSong, nameClass, type }) {

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

  const { setRun, run, getSongsPlaylist } = useContext(PlaylistContext)

  const playSong = async (e, content) => {

    if (type === 'playlist') {

      if (run) {
        setRun(false)
      } else {
        setRun(true)
      }

      await getSongsPlaylist(id)
        .then(res => {
          content.length = 0
          content.push(...res)
        })
        .catch(err => {
          console.log(err)
        })

    } else {
      if (content[0]._id == id) return

      content.unshift({
        _id: id,
        name,
        artist,
        cover: `${cover}`,
        url: pathSong
      })
    }

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

    <div className={!nameClass ? "music-box" : `music-box ${nameClass}`}>

      <div className="cover">

        <span>
          <div onClick={(e) => playSong(e, content)}>
            <img className='play-icon' src={"/icons/play-icon.png"} alt="Play" />
          </div>
        </span>


        {!cover[0].includes('http') ?

          cover.lenght > 0 ?
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
          :
          cover.lenght > 0 ?
            <div className='generate-cover'>
              <img src={cover[0]} alt="Song" />
              <img src={cover[1]} alt="Song" />
              <img src={cover[2]} alt="Song" />
              <img src={cover[3]} alt="Song" />
            </div>
            :
            <div className='cover-img'>
              <img src={cover[0]} alt="Song" />
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