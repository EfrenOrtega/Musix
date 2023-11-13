import { resolve } from "@tauri-apps/api/path";
import { useEffect } from "react";
import { useRef, useState, useContext } from "react";
import PlayerContext from '../../context/PlayerContext'

let durationSongMils = 0;
let sec = null;
let min = null;
let timerState = 0;
let tiempoAnterior = 0;

export const Slider = ({ running, setRunning, playPause, loop }) => {

  const {
    audio_ref,
    dataSong,
    loadSongs,
    secondsSong,
    setSecondsSong,
    isSliderMoving, 
    setIsSliderMoving
  } = useContext(PlayerContext)

  const [range, setRange] = useState(0)
  const [progress, setProgress] = useState('0%')
  const [timer, setTimer] = useState('00:00');

  const slider_ref = useRef(null);

  const handleChange = (e) => {
    if (!running) return;


    const currentTimeInSeconds = Math.floor(audio_ref.current.currentTime);
    setIsSliderMoving(e.target.value)

    
    min = Math.floor(currentTimeInSeconds / 60)
    sec = Math.floor(((currentTimeInSeconds / 60) - Math.floor(currentTimeInSeconds / 60)) * 60);

    if (sec.toString().length != 1) {
      if (min.toString().length != 1) {
        setTimer(`${min}:${sec}`)
      } else {
        setTimer(`0${min}:${sec}`)
      }
    } else {
      if (min.toString().length != 1) {
        setTimer(`${min}:0${sec}`)
      } else {
        setTimer(`0${min}:0${sec}`)
      }
    }








    let valueRange = e.target.value;

    if (valueRange == 0) {
      valueRange = 1;
    }

    setRange(e.target.value)

    timerState = e.target.value

    if (valueRange > 60) {
      min = Math.floor(valueRange / 60)
      sec = valueRange - (min * 60)
    } else {
      sec = valueRange;
    }


    audio_ref.current.currentTime = `${e.target.value}`
    tiempoAnterior = audio_ref.current.currentTime;
 

    setProgress(`${e.target.value * (100 / audio_ref.current.duration)}%`);
    
  } 

  useEffect(() => {


    setRange(0)
    setProgress('0%')
    setTimer('00:00')
    timerState = 0;

    const handleTimeUpdate = (e) => {

      const currentTimeInSeconds = Math.floor(audio_ref.current.currentTime);

      durationSongMils = audio_ref.current.duration

      if (currentTimeInSeconds !== tiempoAnterior) {

        min = Math.floor(currentTimeInSeconds / 60)
        sec = Math.floor(((currentTimeInSeconds / 60) - Math.floor(currentTimeInSeconds / 60)) * 60)     

        if (sec.toString().length != 1) {
          if (min.toString().length != 1) {
            setTimer(`${min}:${sec}`)
          } else {
            setTimer(`0${min}:${sec}`)
          }
        } else {
          if (min.toString().length != 1) {
            setTimer(`${min}:0${sec}`)
          } else {
            setTimer(`0${min}:0${sec}`)
          }
        }

        timerState++
        setSecondsSong(timerState)
        setRange(timerState)

        setProgress(`${timerState * (100 / durationSongMils)}%`);

        tiempoAnterior = currentTimeInSeconds;

      }
    }


    if (loop == 1) {
      audio_ref.current.loop = true;
    } else if (loop == 0) {
      audio_ref.current.loop = false
    } else if (loop == null) {
      loadSongs(null, 0)
    }

    if (!running) {

      if (playPause) {
        setRange(0)
        setProgress('0%')
      }

    } else {



      if (running) {
        if (range == 0) {
          sec = 1;
          min = 0;
        }

        timerState = range;

        audio_ref.current.addEventListener('timeupdate', (e) => handleTimeUpdate(e));
      }


    }

    return () => {
      audio_ref.current.addEventListener('timeupdate', handleTimeUpdate)
    }

  }, [running])

  return (
    <div className="time-line">
      <div className='container-progress'>

        <div ref={slider_ref} className='slider-bar' style={{ width: `${progress}` }}></div>
        <input id="slider" type="range" min="0" max={durationSongMils} value={range.toString()} step="1"
          onChange={(e) => handleChange(e)}
        />

      </div>
      <div className='values-time'>
        <p>{timer}</p>
        <p>{dataSong.duration}</p>
      </div>
    </div>
  )
}



/*audio_ref.current.addEventListener('play', e => {
   const counter = setInterval(() => {
     HandleProgress(e, slider_ref, dataSong.duration, setRange, range)
   }, 1000)
 })*/