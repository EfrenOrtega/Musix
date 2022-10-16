import '../styles/Home.css'

import Header from "components/Header"
import MusicBox from "components/MusicBox"
import Player from "components/Player"
import SongBox from 'components/SongBox'

export default function Home(){
  return (
    <>
      <Header />
      <main>
        <section className='section-playlist'>
          <div className='title-section'>
            <h2>Your Playlists</h2>
            <img src={require('../../assets/icons/icon-arrow-right.png')} alt="" />
          </div>

          <div className='playlist'>
            <MusicBox
              cover='caratula.png'
              songInfo={
                {
                  name:"Chill 😎",
                }
              }
            />

            <MusicBox
              cover='willOfThePeople.png'
              songInfo={
                {
                  name:"Chill",
                }
              }
            />

            <MusicBox
              cover='caratula.png'
              songInfo={
                {
                  name:"Chill 🤘",
                }
              }
            />

            <MusicBox
              cover='willOfThePeople.png'
              songInfo={
                {
                  name:"Chill",
                }
              }
            />

            <MusicBox
              cover='caratula.png'
              songInfo={
                {
                  name:"Chill",
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
                songInfo = {
                  {
                    name : "Will of The People",
                    artist : "Muse",
                    duration : "02:30"
                  }
                }
              />
          </div>
        </section>
      </main>

      <Player
        cover="willOfThePeople.png"
        songInfo={
          {
            name:"Will Of The People",
            artist:"Muse",
            duration:"02:30"
          }
        }
      />
   </>
  )
}