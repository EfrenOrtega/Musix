import '../styles/player.css'


export default function Player({ cover, songInfo }) {

  const { name, artist, duration } = songInfo

  return (
    <div className="player">
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
          <img
            src={'/icons/icon-controller-previous.png'} alt="Previous"
          />
          <img
            src={'/icons/icon_controller-pause.png'}
            alt="Pause"
          />

          <img
            src={'/icons/icon_controller-next.png'}
            alt="Next"
          />
        </div>

        <div className="time-line">
          <progress id="progress" value="10" max="100"></progress>
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