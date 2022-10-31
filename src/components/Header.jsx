import '../styles/Header.css'

import Artist from "./Artist"
import SongBox from "./SongBox"
import SettingsUser from './SettingsUser'

import { useState } from 'react'

export default function Header() {


  //Line 12 - 21 is to Display and Hide the user options
  const [displayOptions, setDisplayOptions] = useState(false);

  const handleClick = (e) => {
    if (displayOptions) {
      setDisplayOptions(false)
    } else {
      setDisplayOptions(true)
    }
  }

  return (
    <header>

      <div className="section-top">
        <div className="search">
          <img src={'/icons/icon-search.png'} alt="" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="user" onClick={(e) => handleClick(e)}>
          <figure>
            <img src={'/images/user01.jpg'} alt="User Avatar" />
          </figure>

          {displayOptions && <SettingsUser />}

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