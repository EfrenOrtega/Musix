import '../styles/Header.css'

import SettingsUser from './SettingsUser'
import HeaderBottomPlaylist from './micro/HeaderBottomPlaylist'
import HeaderBottomHome from './micro/HeaderBottomHome'

import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import fetchAJAX from '../helpers/fetch'
import HeaderBottomArtist from './micro/HeaderBottomArtist'
import { useQuery } from 'react-query'

export default function Header({ type, data, background, cover, btns, evtSearch, title}) {

  let navigate = useNavigate()

  //Line 12 - 21 is to Display and Hide the user options
  const [displayOptions, setDisplayOptions] = useState(false);
  const [search, setSearch] = useState("")
  const UseLocation = useLocation();

  useEffect(()=>{
    document.addEventListener('click', handleOutsideClick)

    return ()=>{
      document.removeEventListener('click', handleOutsideClick)
    }
  },[])

  const getFindUser = useCallback(()=>{
    return fetchAJAX({
      url: `http://${location.hostname}:5000/finduser/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        return res.data
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  //CACHENING
  const {data:dataUser} = useQuery(['findUser'], getFindUser,
  {
    staleTime:Infinity,
    keepPreviousData:true,
  })

  const handleClick = (e) => {
    if (displayOptions) {
      setDisplayOptions(false)
    } else {
      setDisplayOptions(true)
    }
  }

  const handleOutsideClick = (e) =>{
    if(!e.target.matches('img')){
      setDisplayOptions(false)
    }
  }

  const handleNext = (e) => {
    navigate(1)
  }

  const handlePrev = (e) => {
    navigate(-1)
  }

  const handleSearch = (e) =>{

    if(!UseLocation.pathname.match(/results/gm)){
      if(e.key === 'Enter'){
        navigate(`/results/${search}`)
      }
    }else if(UseLocation.pathname.match(/results/gm).length !== 0){
      if(e.key === 'Enter'){
        evtSearch(e, search)
      }
    }

  }

  const handleChangeSearch = (e)=>{
    setSearch(e.target.value)
  }

  return (
    <header className={`${type}`}>
      {background &&
        background.includes('https://ipfs') ?
        <img className='background' src={background} alt="" />
        :
        background != "" &&
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
            <input onChange={handleChangeSearch} value={search} onKeyUp={handleSearch} type="text" placeholder="Search" />
          </div>
        </div>


        <div className="user">
          <figure>
            {dataUser &&
              <img onClick={(e) => handleClick(e)} src={dataUser.avatar} alt="User Avatar" />
            }

          </figure>

          {displayOptions && <SettingsUser dataUser={dataUser} />}

        </div>
      </div>

      <div className="section-bottom">

        {
          /*type == "home"
            ? <HeaderBottomHome />
            :*/
          type == "playlist"
            ? <HeaderBottomPlaylist data={data} cover={cover} btns={btns} />
            : type == "artist"
              ? <HeaderBottomArtist data={data} cover={cover} />
              : <h2>{title}</h2>
        }


      </div>
    </header>
  )
}