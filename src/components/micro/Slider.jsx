import { resolve } from "@tauri-apps/api/path";
import { useEffect } from "react";
import { useRef, useState, useContext } from "react";
import PlayerContext from '../../context/PlayerContext'

let counter
let durationSongMils = 0;
let sec = null;
let min = null;
let timerState = null;

export const Slider = ({ running, setRunning, playPause, loop }) => {

  const {
    audio_ref,
    dataSong,
    loadSongs
  } = useContext(PlayerContext)

  const [range, setRange] = useState(0)
  const [progress, setProgress] = useState('0%')
  const [timer, setTimer] = useState('00:00')

  const slider_ref = useRef(null);

  const handleChange = (e) => {
    if (!running) return;
    setRange(e.target.value)
    timerState = range

    if (range > 60) {
      min = Math.floor(range / 60)
      sec = range - (min * 60)
    } else {
      sec = range;
    }


    audio_ref.current.pause()

    let src = (audio_ref.current.src).split('.mp3')

    if (src.length > 1) {
      audio_ref.current.src = ""
      src.pop()
      audio_ref.current.src = src + `.mp3#t=${range}`
    } else {
      src = (audio_ref.current.src).split("#t=")
      audio_ref.current.src = src[0] + `#t=${range}`
    }
    audio_ref.current.play()
  }

  useEffect(() => {

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

        let durationSong = new Promise((resolve, reject) => {

          return resolve(audio_ref.current.duration)
        })

        durationSong
          .then(duration => {

            durationSongMils = duration

            let durationMin = parseInt(durationSongMils / 60);
            let durationSec = Math.floor((durationSongMils / 60 - durationMin) * 60)

            counter = setInterval(() => {

              if (durationMin == min && durationSec == sec) {
                setRunning(false)
              } else {

                timerState++
                setRange(timerState)

                if (sec.toString().length != 1) {
                  if (min.toString().length != 1) {
                    setTimer(`${min}:${sec++}`)
                  } else {
                    setTimer(`0${min}:${sec++}`)
                  }
                } else {
                  if (min.toString().length != 1) {
                    setTimer(`${min}:0${sec++}`)
                  } else {
                    setTimer(`0${min}:0${sec++}`)
                  }
                }

                if (sec == 60) {
                  sec = 0;
                  min++
                }

                setProgress(`${timerState * (100 / durationSongMils)}%`);
              }

            }, 1000)



          })
          .catch(err => {
            console.log("Error al obtner la duracion de la canción actual", err)
          })


      }


    }

    return () => clearInterval(counter)
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