import '../styles/Header.css'

import SettingsUser from './SettingsUser'
import HeaderBottomPlaylist from './micro/HeaderBottomPlaylist'
import HeaderBottomHome from './micro/HeaderBottomHome'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import fetchAJAX from '../helpers/fetch'

export default function Header({ type, data, background, cover, btns }) {

  let navigate = useNavigate()

  //Line 12 - 21 is to Display and Hide the user options
  const [displayOptions, setDisplayOptions] = useState(false);
  const [dataUser, setDataUser] = useState()

  useEffect(() => {

    fetchAJAX({
      url: `http://${location.hostname}:5000/finduser/${localStorage.getItem('id')}`,
      settings: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      },
      resSuccess: (res) => {
        if (res.status) {
          setDataUser(res.data)
        } else {
          console.log(res.message)
        }

      },
      resError: (err) => {
        console.log(err)
      }
    }
    )
  }, [])

  const handleClick = (e) => {
    if (displayOptions) {
      setDisplayOptions(false)
    } else {
      setDisplayOptions(true)
    }
  }

  const handleNext = (e) => {
    navigate(1)
  }

  const handlePrev = (e) => {
    navigate(-1)
  }

  return (
    <header style={{ background: 'linear - gradient(rgba(95, 58, 120, .7) 10%, #0E1026 100%)' }}
    >
      {background &&
        <img className='background' src={`./images/${background}`} alt="" />
      }

      <div className="section-top">


        <div className='nav-controls-search'>
          <div className='nav-controls'>

            <img
              onClick={(e) => handlePrev(e)}
              src="./icons/icon-left.png" alt="Back" />

            <img
              onClick={(e) => handleNext(e)}
              src="icons/icon-right.png" alt="Next" />

          </div>

          <div className="search">
            <img src={'/icons/icon-search.png'} alt="" />
            <input type="text" placeholder="Search" />
          </div>
        </div>


        <div className="user" onClick={(e) => handleClick(e)}>
          <figure>
            {dataUser &&
              <img src={dataUser.avatar} alt="User Avatar" />
            }

          </figure>

          {displayOptions && <SettingsUser dataUser={dataUser} />}

        </div>
      </div>

      <div className="section-bottom">

        {
          type == "home"
            ? <HeaderBottomHome />
            :
            type == "playlist"
              ? <HeaderBottomPlaylist data={data} cover={cover} btns={btns} />
              : undefined
        }


      </div>
    </header>
  )
}