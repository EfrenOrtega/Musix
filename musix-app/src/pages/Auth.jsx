import '../styles/auth.css'
import { useState } from 'react';

import SignUp from '../components/SignUp';
import Login from '../components/Login';

export default function Auth() {

  const [displaySignUp, setDisplaySignUp] = useState(false)


  const displayHideLogin = (e) => {
    e.preventDefault();

    if (displaySignUp) {
      setDisplaySignUp(false)
    } else {
      setDisplaySignUp(true)
    }
  }

  return (
    <div className="auth">

      <div className={`left ${displaySignUp}`}>

        {
          !displaySignUp
            ? <Login active={displaySignUp} displayHideLogin={displayHideLogin} />
            : <SignUp active={displaySignUp} displayHideLogin={displayHideLogin} />
        }



      </div>

      <div className={`right ${displaySignUp}`}>
        <img src="./images/logo.png" alt="Musix" />
        <p>Musix</p>
      </div>

    </div>
  )
}