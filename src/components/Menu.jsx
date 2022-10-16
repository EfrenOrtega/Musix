import '../styles/Menu.css'

export default function Menu() {
  return (
    <nav className='menu'>
      
      <div>
        <div className="logo-name-app">
          <img src={require('../../assets/icons/logo.png')} alt="Logo App" />
          <img src={require('../../assets/icons/Musix.png')} alt="Name App" />
        </div>

        <ul>
          <li>
            <img src={require('../../assets/icons/icon-favorite.png')} alt="Favorite" />
            <a href="">Favorites</a>
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