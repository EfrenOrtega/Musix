import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import '../styles/Menu.css'

import PlaylistContext from '../context/PlaylistContext'

export default function Menu() {

  const { Playlists } = useContext(PlaylistContext)
  const [favorite, setFavorite] = useState()

  useEffect(()=>{
    if(Playlists){
      setFavorite( Playlists.find(playlist => playlist.name == "Favorites"))
    }
  },[Playlists])
  
  return (
    <nav className='menu'>

      <div>
        <div className="logo-name-app">
          <img src="/icons/logo.png" alt="Logo App" />
          <img src="/icons/Musix.png" alt="Name App" />
        </div>

        <ul>

          <li>
            <img src="./icons/home-icon.png" alt="Home" />
            <Link to="/">Home</Link>
          </li>

          <li>
            <img src="/icons/icon-favorite.png" alt="Favorite" />
            <Link to={`/playlist/${favorite && favorite._id}`}>Favorites</Link>
          </li>
          <li>
            <img src="/icons/playlists.png" alt="Playlists" />
            <Link to="/playlists">My Playlists</Link>
          </li>
          <li>
            <a href="">Coming soon</a>
          </li>
        </ul>
      </div>

      <div className="developer">
        <p>Developed by Efren Ortega</p>
      </div>
    </nav>
  )
}