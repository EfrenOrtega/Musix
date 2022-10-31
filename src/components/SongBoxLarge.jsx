import '../styles/song-box.css';

export default function SongBoxLarge({ data }) {

  const { cover, name, artist, duration, album, created } = data

  return (
    <div className="song-box large">

      <div className='container-cover-data'>
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