import '../styles/music-box.css'
import { Link } from 'react-router-dom';


export default function MusicBox({ cover, songInfo }) {

  const { name, artist } = songInfo

  return (
    <div className="music-box">

      <div className="cover">

        <span>
          <Link to="/playlist/01">
            <img className='play-icon' src={"/icons/play-icon.png"} alt="Play" />
          </Link>
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