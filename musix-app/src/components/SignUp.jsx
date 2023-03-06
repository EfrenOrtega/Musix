import '../styles/auth.css'
import Input from "../components/micro/Input"
import fetchAJAX from '../helpers/fetch'
import { useState } from 'react'


export default function SignUp({ active, displayHideLogin }) {

  const [dataForm, setDataForm] = useState(
    {
      username: '',
      name: '',
      last: '',
      email: '',
      password: '',
      repeatPassword: '',
      age: ''
    }
  )


  const createPlaylistFavorite = (idUser) => {

    let dateNow = new Date(Date.now())
    let dateTime = new Date(dateNow.getTime() - dateNow.getTimezoneOffset() * 60000).toISOString()
    let date = dateTime.split('T')[0]

    fetchAJAX({
      url: `http://${location.hostname}:5000/createPlaylistFavorites/${idUser}/${date}`,
      settings: {
        method: 'GET'
      },
      resSuccess: (res) => {
        if (res.status) {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchAJAX({
      url: `http://${location.hostname}:5000/createaccount`,
      settings: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
      },
      resSuccess: (res) => {
        if (res.status) {
          console.log(res)
          createPlaylistFavorite(res.id_user)
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
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form className={`signup ${active}`}>
      <h1>Sign Up</h1>
      <Input
        placeholder="Username"
        type="text"
        name='username'
        handleChange={handleChange}
        value={dataForm.username}
      />

      <Input
        placeholder="Name"
        type="text"
        name='name'
        handleChange={handleChange}
        value={dataForm.name}
      />

      <Input
        placeholder="Last"
        type="text"
        name='last'
        handleChange={handleChange}
        value={dataForm.last}
      />

      <Input
        placeholder="Email"
        type="email"
        name="email"
        handleChange={handleChange}
        value={dataForm.email}
      />

      <Input
        placeholder="Password"
        type="password"
        name="password"
        handleChange={handleChange}
        value={dataForm.password}
      />

      <Input
        placeholder="Repeat Password"
        type="password"
        name="repeatPassword"
        handleChange={handleChange}
        value={dataForm.repeatPassword}
      />

      <Input
        placeholder="Age"
        type="number"
        name="age"
        handleChange={handleChange}
        value={dataForm.age}
      />

      <button onClick={(e) => handleSubmit(e)}>Enter</button>

      <span className='signup-span'>I already have an account
        <a onClick={(e) => displayHideLogin(e)}>Login</a>
      </span>
    </form>
  )
}