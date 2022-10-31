import '../styles/settings-user.css'

export default function SettingsUser() {

  const logOut = () => {
    localStorage.setItem('login', false)
    location.reload()
  }

  return (
    <div className="settings-user">

      <div>
        <p className='subtitle'>Account</p>
        <span className='line'></span>
        <div className='user-info'>
          <figure>
            <img src={'/images/user01.jpg'} alt="User Avatar" />
          </figure>
          <div className='data'>
            <span>Name User</span><br />
            <span>email@email.com</span>
          </div>
        </div>

        <ul className='options-settings-user'>
          <li>Profile</li>
          <li onClick={(e) => logOut(e)}>Log Out</li>
        </ul>

      </div>


    </div>
  )
}