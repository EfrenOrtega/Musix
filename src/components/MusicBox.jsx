import '../styles/music-box.css'

export default function MusicBox({cover, songInfo}) {

  const {name, artist} = songInfo

  return (
    <div className="music-box">

      <div className="cover">
        <span>
          <img className='play-icon' src={require("../../assets/icons/play-icon.png")} alt="Play" />
        </span>

        <figure>
          <img src={require(`../../assets/images/${cover}`)} alt="" />
        </figure>
      </div>
      
      <p><strong>{name}</strong></p>

      {artist && 
        <p>{artist}</p>
      }

    </div>
  )
}