import '../styles/auth.css'
import Input from "../components/micro/Input"


export default function SignUp({ active, displayHideLogin }) {
  return (
    <form className={`signup ${active}`}>
      <h1>Sign Up</h1>
      <Input placeholder="Name" type="text" />
      <Input placeholder="Last" type="text" />
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Input placeholder="Repeat Password" type="password" />
      <Input placeholder="Age" type="number" />

      <button>Enter</button>

      <span className='signup-span'>I already have an account
        <a onClick={(e) => displayHideLogin(e)}>Login</a>
      </span>
    </form>
  )
}