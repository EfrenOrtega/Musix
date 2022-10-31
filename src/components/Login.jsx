import '../styles/auth.css'
import Input from "../components/micro/Input"

const login = (e) => {
  if (e.target.matches('a')) return
  localStorage.setItem('login', true)
  location.reload()
}

export default function Login({ active, displayHideLogin }) {
  return (
    <form onClick={(e) => login(e)} className={`login ${active}`}>
      <h1>Login</h1>
      <Input placeholder="Username or Email" type="text" />
      <Input placeholder="Password" type="password" />
      <span><a href="">Forgot the password?</a></span>

      <button type='submit'>Enter</button>

      <span className='signup-span'>I don't have an account
        <a onClick={(e) => displayHideLogin(e)}>Signup</a>
      </span>
    </form>
  )
}