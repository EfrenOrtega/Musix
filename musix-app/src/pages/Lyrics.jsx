import * as React from 'react';
import '../styles/Lyrics.css'

import PlayerContext from '../context/PlayerContext'
import Lyric from 'lyric-parser';
import { useNavigate, useParams } from 'react-router-dom';


export default function Lyrics(){

    const {audio_ref, dataSong} = React.useContext(PlayerContext);

    const [animationDuration, setAnimationDuration] = React.useState(null)
    const [data, setData] = React.useState(null)

    const [LyricsState, setLyricsState] = React.useState([])

    const lyricsRef = React.useRef()
    const animationRef = React.useRef()
    let { id } = useParams()
    const navigate = useNavigate();


    React.useEffect(() => {

      let handleLyric = null
      if(dataSong.lyrics == "") {
        navigate('/')
      }
      
      if(localStorage.getItem('idSong') !== id) return

      let lyrics = ''

      fetch(`http://${location.hostname}:5000/getsong/${id}/${localStorage.getItem('id')}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(json => {


        lyrics = json.data.lyrics
        console.log(json.data)
        setData(json.data)

        const lyric = new Lyric(lyrics);
        setLyricsState(lyric.lines)//The whole lyrics
        setAnimationDuration(lyric.lines[0].time / 1000)//To control the loader
        
        let prevLyric = 0;
        handleLyric = ()=>{

          //When the time of the song verse is same as the current time of the audio
          const currentLyric = lyric.lines.findIndex(({ time }) => {
            return Math.round(time / 1000) === Math.floor(audio_ref.current.currentTime)
          });

          //To display the current song verse and hide the previous
          if(currentLyric != -1){
            setAnimationDuration(null)
            const lyricsEl = lyricsRef.current.querySelectorAll('p')

            if(prevLyric >= 0){
              console.log(currentLyric, prevLyric)
              lyricsEl[prevLyric].classList.remove('active')   
            }
            prevLyric = currentLyric 

            //Changes the color when the lyrics are sung.
            lyricsEl[currentLyric].classList.add('active')
            //This is to always display the current song verse in the screen
            lyricsEl[currentLyric].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
          }

        }

        lyric.play();

        //Event when the current time of the audio change
        audio_ref.current.addEventListener('timeupdate', handleLyric)


      })
      .catch(err => {
        console.log(err)
      })
    

      return () => {
        audio_ref.current.removeEventListener('timeupdate', handleLyric);        
      };

    }, [id, dataSong]);


    const handleClose = ()=>{
      navigate('/')
    }


    return(
        <div className='main-container lyric'>

          <img onClick={handleClose} className='icon-down' src="./icons/arrow_down.png" alt="" />

            {
              (dataSong && data) && 
                <div className='song-header'>
                    <img src={dataSong.cover} alt="" />
                    <div className='song-info'>
                        <p><strong>{dataSong.name}</strong></p>
                        <p>{dataSong.artist} - {data.album}</p>
                    </div>
                </div>
            }

            {/*<div class="loader">
                <div class="loader-progress"></div>
            </div>*/}

            {animationDuration &&
              <div className="loader">
                  <svg className="loader" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="20" stroke="#181920" stroke-width="4.5" fill="none"/>
                        <circle style={{animationDuration:`${animationDuration}s`}} ref={animationRef} className="circle" cx="25" cy="25" r="20" fill="none" stroke="#ccc" stroke-width="4.5"></circle>
                  </svg>
              </div>
            }

            <div className='lyrics' ref={lyricsRef}>    
               
                {
                  LyricsState && 
                  LyricsState.map((el, index)=>{
                    return <p data-id={index}>{el.txt}</p>
                  })
                }

            </div>

        </div>
    )

}