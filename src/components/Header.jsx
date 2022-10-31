import '../styles/Header.css'

import Artist from "./Artist"
import SongBox from "./SongBox"
import SettingsUser from './SettingsUser'
import HeaderBottomPlaylist from './micro/HeaderBottomPlaylist'
import HeaderBottomHome from './micro/HeaderBottomHome'

import { useState } from 'react'

export default function Header({ type, data, background }) {

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

      <img className='background' src={`./images/${background}`} alt="" />

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

        {
          type == "home"
            ? <HeaderBottomHome />
            :
            type == "playlist"
              ? <HeaderBottomPlaylist data={data} />
              : undefined
        }


      </div>
    </header>
  )
}