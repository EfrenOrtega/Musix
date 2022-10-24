import '../styles/Home.css'

import Header from "../components/Header"
import MusicBox from "../components/MusicBox"
import SongBox from '../components/SongBox'

import responsiveBoxes from '../helpers/responsiveBoxes'
import { useEffect, useState } from 'react'


const Songs = [
  <MusicBox
    cover="willOfThePeople.png"
    songInfo={
      {
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />,
  <MusicBox
    cover="willOfThePeople.png"
    songInfo={
      {
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />,
  <MusicBox
    cover="willOfThePeople.png"
    songInfo={
      {
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />,
  <MusicBox
    cover="willOfThePeople.png"
    songInfo={
      {
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />,
  <MusicBox
    cover="willOfThePeople.png"
    songInfo={
      {
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />,
  <MusicBox
    cover="willOfThePeople.png"
    songInfo={
      {
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />,
  <MusicBox
    cover="willOfThePeople.png"
    songInfo={
      {
        name: "Will of The People",
        artist: "Muse"
      }
    }
  />
]



export default function Home() {

  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    window.addEventListener('resize', handleResize)
  }, [])


  const handleResize = () => {
    setQuantity(responsiveBoxes())
  }

  return (
    <div className='main-container'>
      <Header />
      <main>
        <div className='container-section-1'>
          <section className='section-playlist'>
            <div className='title-section'>
              <h2>Your Playlists</h2>
              <img src="/icons/icon-arrow-right.png" alt="" />
            </div>

            <div className='playlist'>
              <MusicBox
                cover='caratula.png'
                songInfo={
                  {
                    name: "Chill 😎",
                  }
                }
              />

              <MusicBox
                cover='caratula.png'
                songInfo={
                  {
                    name: "Chill 😎",
                  }
                }
              />


              <MusicBox
                cover='caratula.png'
                songInfo={
                  {
                    name: "Chill 😎",
                  }
                }
              />

              <MusicBox
                cover='caratula.png'
                songInfo={
                  {
                    name: "Chill 😎",
                  }
                }
              />

              <MusicBox
                cover='willOfThePeople.png'
                songInfo={
                  {
                    name: "Chill",
                  }
                }
              />

              <MusicBox
                cover='willOfThePeople.png'
                songInfo={
                  {
                    name: "Chill",
                  }
                }
              />

              <MusicBox
                cover='caratula.png'
                songInfo={
                  {
                    name: "Chill 🤘",
                  }
                }
              />

              <MusicBox
                cover='willOfThePeople.png'
                songInfo={
                  {
                    name: "Chill",
                  }
                }
              />

              <MusicBox
                cover='caratula.png'
                songInfo={
                  {
                    name: "Chill",
                  }
                }
              />

            </div>
          </section>

          <section className='section-recently'>
            <div className='title-section'>
              <h2>Recently Played</h2>
            </div>

            <div className='songs'>
              <SongBox
                cover="willOfThePeople.png"
                songInfo={
                  {
                    name: "Will of The People",
                    artist: "Muse",
                    duration: "02:30"
                  }
                }
              />
            </div>

            <div className='songs'>
              <SongBox
                cover="willOfThePeople.png"
                songInfo={
                  {
                    name: "Will of The People",
                    artist: "Muse",
                    duration: "02:30"
                  }
                }
              />
            </div>

            <div className='songs'>
              <SongBox
                cover="willOfThePeople.png"
                songInfo={
                  {
                    name: "Will of The People",
                    artist: "Muse",
                    duration: "02:30"
                  }
                }
              />
            </div>
          </section>

        </div>

        <section className='section-recently-added'>
          <div className='title-section'>
            <h2>Recently Added</h2>
            <img src="/icons/icon-arrow-right.png" alt="" />
          </div>

          <div className='recently-added'>
            {

              Songs.map((el, index) => {
                if (index < quantity) {
                  return el
                }
              })

            }


          </div>
        </section>
      </main>
    </div>
  )
}