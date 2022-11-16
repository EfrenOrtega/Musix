import '../styles/settings-user.css'

export default function SettingsUser({ dataUser }) {

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
            <img src={dataUser.avatar} alt="User Avatar" />
          </figure>
          <div className='data'>
            <span>{dataUser.name}</span><br />
            <span>{dataUser.email}</span>
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