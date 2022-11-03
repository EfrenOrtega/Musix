import { resolve } from "@tauri-apps/api/path";
import { useEffect } from "react";
import { useRef, useState, useContext } from "react";
import PlayerContext from '../../context/PlayerContext'

let counter
let durationSongMils = 0;
let sec = null;
let min = null;

export const Slider = ({ running, setRunning, playPause }) => {

  const {
    audio_ref,
    dataSong,
    HandleProgress
  } = useContext(PlayerContext)

  const [range, setRange] = useState(0)
  const [progress, setProgress] = useState('0%')
  const [timer, setTimer] = useState('00:00')

  const slider_ref = useRef(null);

  const handleChange = (e) => {
    if (!running) return;
    setRange(e.target.value)
  }

  useEffect(() => {

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

        let timerState = range;

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