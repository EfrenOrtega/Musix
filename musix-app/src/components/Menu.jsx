import { Link } from 'react-router-dom'
import '../styles/Menu.css'


export default function Menu() {
  return (
    <nav className='menu'>

      <div>
        <div className="logo-name-app">
          <img src="/icons/logo.png" alt="Logo App" />
          <img src="/icons/Musix.png" alt="Name App" />
        </div>

        <ul>
          <li>
            <img src="/icons/icon-favorite.png" alt="Favorite" />
            <Link to="/playlist/0">Favorites</Link>
          </li>
          <li>
            <a href="">Coming soon</a>
          </li>
          <li>
            <a href="">Coming soon</a>
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