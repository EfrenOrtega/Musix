import '../styles/auth.css'
import Input from "../components/micro/Input"
import fetchAJAX from '../helpers/fetch'
import { useState } from 'react'


export default function Login({ active, displayHideLogin }) {

  const [dataAuth, setDataAuth] = useState({ username: '', password: '' })

  const login = (e) => {
    e.preventDefault()
    fetchAJAX({
      url: 'http://127.0.0.1:5000/auth',
      settings: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataAuth)
      },
      resSuccess: (res) => {
        if (res.status) {
          window.localStorage.setItem('login', true)
          location.reload()
        } else {
          console.log(res.message)
        }

      },
      resError: (err) => {
        console.log(err)
      }
    }
    )


  }

  const handleChange = (e) => {
    setDataAuth({
      ...dataAuth,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onClick={(e) => login(e)} className={`login ${active}`}>
      <h1>Login</h1>
      <Input
        placeholder="Username or Email"
        type="text"
        name="username"
        handleChange={handleChange}
        value={dataAuth.username}
      />

      <Input
        placeholder="Password"
        type="password"
        name="password"
        handleChange={handleChange}
        value={dataAuth.password}
      />

      <span><a href="">Forgot the password?</a></span>

      <button type='submit'>Enter</button>

      <span className='signup-span'>I don't have an account
        <a onClick={(e) => displayHideLogin(e)}>Signup</a>
      </span>
    </form>
  )
}