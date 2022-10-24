import '../styles/song-box.css';

//  songInfo contain -> Song Name, Artist and Duration
export default function SongBox({ cover, songInfo }) {
  const { name, artist, duration } = songInfo;

  return (
    <div className="song-box">
      <div className="cover">
        <span>
          <img
            className="play-icon"
            src={'/icons/play-icon.png'}
            alt="Play"
          />
        </span>

        <figure>
          <img src={`/images/${cover}`} alt={name} />
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