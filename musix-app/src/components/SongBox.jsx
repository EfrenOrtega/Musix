import '../styles/song-box.css';
import PlayerContext from '../context/PlayerContext';
import { useContext } from 'react';


/**
 * React Component that displays song information and Recently Played Section
 * @param {Object} props - The component's props 
 * @property {String} cover - The URL of the song's cover image.
 * @property {Array} songInfo - Information about the song
 * @returns {JSX.Element} A component that displays song information.
 */
export default function SongBox({ cover, songInfo, pathSong }) {

  const { id, name, artist, duration, lyrics, favoriteSong } = songInfo;

  //Destructure states, varibles and functions from the PlayerContext
  const {
    /** `playPause`: Indicates whether the audio is currently playing or paused. */
    playPause,
    /** `setPlayPause`: State to toggle `playPause` state. */
    setPlayPause,
    /** `setNextIsDisabled` and `setPrevIsDisabled`: Functions to enable/disable next and previous buttons. */
    setNextIsDisabled,
    setPrevIsDisabled,
    /** `HandlePlayPause`: Function to handle play/pause actions. */
    HandlePlayPause,
    /** `audio_ref`: Reference to the audio element. */
    audio_ref,
    /** `setDataSong`: State to set song data. */
    setDataSong,
    /** `content`: Array that stores all the songs that were playing is like a queue. */
    content,
    /** `setRunning`: State to control audio playback state. */
    setRunning
  } = useContext(PlayerContext)

  /**
   * Function to Play a song and update the content of the `Player Component`
   * 
   * @param {Object} e 
   * @param {Array} content - Array that stores all the songs that were playing is like a queue.
   */
  
  const playSong = async (e, content) => {

    /** If the song's id is not in the content array then add it */
    if (content[content.length - 1]._id != id) {
      content.push({
        _id: id,
        name,
        artist,
        cover: `${cover}`,
        lyrics,
        url: pathSong,
        favorite: favoriteSong
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
          <img onClick={(e) => playSong(e, content)}
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