import '../styles/Header.css'

import Artist from "./Artist"
import SongBox from "./SongBox"

export default function Header() {
  return (
    <header>

      <div className="section-top">
        <div className="search">
          <img src={'/icons/icon-search.png'} alt="" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="user">
          <figure>
            <img src={'/images/user01.jpg'} alt="User Avatar" />
          </figure>
        </div>
      </div>

      <div className="section-bottom">
        <h1>No Music No Life</h1>

        <div>
          <p className='title'><strong>Daily Recomendation</strong></p>
          <SongBox
            cover="willOfThePeople.png"
            songInfo={{
              name: "Will Of The People",
              artist: "Muse",
              duration: "03:00",
            }}
          />
        </div>

      </div>
    </header>
  )
}