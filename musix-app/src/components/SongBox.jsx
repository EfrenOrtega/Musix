import '../styles/song-box.css';
import PlayerContext from '../context/PlayerContext';
import { useContext } from 'react';


//  songInfo contain -> Song Name, Artist and Duration
export default function SongBox({ cover, songInfo, pathSong}) {
  const { id, name, artist, duration, lyrics, favoriteSong} = songInfo;


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


  const playSong = async (e, content) => {


    if(playPause){
      setRunning(false)
      
      HandlePlayPause(
        e,
        false,
        setPlayPause,
        audio_ref,
        setNextIsDisabled,
        setPrevIsDisabled,
        setDataSong,
        setRunning
      )
    }

    if (content[0]._id != id){
      content.unshift({
        _id: id,
        name,
        artist,
        cover: `${cover}`,
        lyrics,
        url: pathSong,
        favorite:favoriteSong
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
    <div className="song-box">

      <div className="cover">
        <span>
          <img onClick={(e)=>playSong(e, content)}
            className="play-icon"
            src={'/icons/play-icon.png'}
            alt="Play"
          />
        </span>

        <figure>
          <img src={cover} alt={name} />
        </figure>
      </div>

      <div>
        <p id='name'><strong>{name}</strong></p>
        <p id='artist'>{artist}</p>
      </div>

      <div>
        <p>{duration}</p>
      </div>
    </div>
  )
}