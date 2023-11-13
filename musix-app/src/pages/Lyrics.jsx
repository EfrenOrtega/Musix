import * as React from 'react';
import '../styles/Lyrics.css'

import PlayerContext from '../context/PlayerContext'
import Lyric from 'lyric-parser';
import { useNavigate, useParams } from 'react-router-dom';


let lyric = null;
let flagStartSinging = false;
let prevLyric = 0;
let counter = {};
let isFirstTime = true
let isAnimationNull = true
let prevRange = 0;

export default function Lyrics() {

  const { audio_ref, dataSong, secondsSong, running, isSliderMoving} = React.useContext(PlayerContext);

  const [animationDuration, setAnimationDuration] = React.useState(null)
  const [data, setData] = React.useState(null)

  const [LyricsState, setLyricsState] = React.useState([])

  const lyricsRef = React.useRef()
  const animationRef = React.useRef()
  let { id } = useParams()
  const navigate = useNavigate();

  const [dataManageLyric, setDataManageLyric] = React.useState({currentLine:0, prevLine:-1})


  React.useEffect(()=>{  

    if(lyric){
      setAnimationDuration(Math.abs(((lyric.lines[0].time - audio_ref.current.currentTime * 1000) / 1000)) + 0.69)
    }

  }, [isSliderMoving])

  React.useEffect(() => {

    if (dataSong.lyrics == "") {
      navigate('/')
    }

    if (localStorage.getItem('idSong') !== id) return

    let lyrics = ''

    let data = dataSong

    lyrics = data.lyrics
    setData(data)
    
    lyric = new Lyric(lyrics)
    
    if(running){
      setAnimationDuration(Math.abs(((lyric.lines[0].time - audio_ref.current.currentTime * 1000) / 1000)) + 0.15)
      isAnimationNull = false
    }

    setLyricsState(lyric.lines)//The whole lyrics

  }, [id, dataSong])

  React.useEffect(() => {

    if(running){
      if(animationRef.current){
        animationRef.current.style.animationPlayState = 'running'
      }
    }else{
      setAnimationDuration(null)
      if(animationRef.current){
        animationRef.current.style.animationPlayState = 'paused'
      }
      return
    }

        
    const handleTimeUpdate = (e)=>{
      
      if(!lyricsRef.current) return;

      let lyricsParagraph = lyricsRef.current.querySelectorAll('p')

      let currentTimeSong = audio_ref.current.currentTime * 1000
      let lyricLines = lyric.lines      

            
      if(currentTimeSong < lyricLines[0].time && isFirstTime === false && isAnimationNull === true){
        lyricsParagraph[prevLyric].classList.remove('active')
      }


      lyricLines.map((song, index)=>{
        if((currentTimeSong >= song.time && currentTimeSong < lyricLines[index + 1].time)){
          setAnimationDuration(null)
          isAnimationNull = true;            

          if (index == 0) {
            /** With this I get the time of the first lyric's verse in Seconds, this is to know how much time is gonna take to finish the animation*/
            flagStartSinging = true;
            isFirstTime = false;
            lyricsParagraph[index].classList.add('active')



            if(prevLyric > 0){
              lyricsParagraph[prevLyric].classList.remove('active')
            }

            prevLyric = 0;
            setDataManageLyric({...dataManageLyric, currentLine:index++})
            return
          }
          
          lyricsParagraph[prevLyric].classList.remove('active')
          lyricsParagraph[index].classList.add('active')
          prevLyric = index;
          setDataManageLyric({...dataManageLyric, currentLine:index++, prevLine:index - 1})
        }
      })

      /*if(lyricLines[counter + 1]){

        if((currentTimeSong >= lyricLines[counter].time && currentTimeSong < lyricLines[counter + 1].time)){

          console.log(counter)

          if (counter == 0) {
            /** With this I get the time of the first lyric's verse in Seconds, this is to know how much time is gonna take to finish the animation
            flagStartSinging = true;
            setAnimationDuration(null)
            lyricsParagraph[counter].classList.add('active')
            prevLyric = 0;
            setDataManageLyric({...dataManageLyric, currentLine:counter++})
            return
          }
          
          lyricsParagraph[prevLyric].classList.remove('active')
          lyricsParagraph[counter].classList.add('active')
          prevLyric = counter;
  
          setDataManageLyric({...dataManageLyric, currentLine:counter++, prevLine:counter - 1})
        }
      }else if((currentTimeSong >= lyricLines[counter].time && currentTimeSong < dataSong.duration)){  
        lyricsParagraph[prevLyric].classList.remove('active')
        lyricsParagraph[counter].classList.add('active')
        prevLyric = counter;

        setDataManageLyric({...dataManageLyric, prevLine:counter - 1})
      } */ 

      
    }
    
    audio_ref.current.addEventListener('timeupdate', (e)=>handleTimeUpdate(e));


    return ()=>  {
      audio_ref.current.addEventListener('timeupdate', handleTimeUpdate)
    } 


  }, [running]);


  const handleClose = () => {
    navigate('/')
  }


  return (
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
            <circle cx="25" cy="25" r="20" stroke="#181920" stroke-width="4.5" fill="none" />
            <circle style={{ animationDuration: `${animationDuration}s` }} ref={animationRef} className="circle" cx="25" cy="25" r="20" fill="none" stroke="#ccc" stroke-width="4.5"></circle>
          </svg>
        </div>
      }

      <div className='lyrics' ref={lyricsRef}>

        {
          LyricsState &&
          LyricsState.map((el, index) => {
            return <p data-id={index}>{el.txt}</p>
          })
        }

      </div>

    </div>
  )

}