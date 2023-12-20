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
    setSecondsSong,
    setIsSliderMoving,
    loadedAudio, 
    setLoadedAudio
  } = useContext(PlayerContext)

  const [range, setRange] = useState(0)
  const [progress, setProgress] = useState('0%')
  const [timer, setTimer] = useState('00:00');

  const slider_ref = useRef(null);

  /**
   * Function that handles when the user moves the Progress Slider
   * @param {*} e 
   */
  const handleChange = (e) => {
    if (!running) return;

    const currentTimeInSeconds = Math.floor(audio_ref.current.currentTime);
    setIsSliderMoving(e.target.value)//Important to 


    /** This is to move the Progress Slider in real time */
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
    /** */


    let valueRange = e.target.value;

    if (valueRange == 0) {
      valueRange = 1;
    }

    setRange(e.target.value)

    timerState = e.target.value

    audio_ref.current.currentTime = `${e.target.value}`
    tiempoAnterior = audio_ref.current.currentTime;

    setProgress(`${e.target.value * (100 / audio_ref.current.duration)}%`);
  }


  useEffect(()=>{

    //if loadedAudio change of data(id Song) then initialize the Progress Silder to 0
    setRange(0)
    setProgress('0%')
    setTimer('00:00')
    durationSongMils = 0;
    timerState = 0;    
  }, [loadedAudio])


  useEffect(() => {
    

    /**
     * Function that update the Progress Slider, the time of the song
     * @param {*} e 
     */
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

      /** If loop is active and the duration of the audio is equals to the value of the Progress Slider initilize Progress Slider */
      if(audio_ref.current.currentTime = range){
        setRange(0)
        setProgress('0%')
        setTimer('00:00')
        timerState = 0;
      }

    } else if (loop == 0) {
      audio_ref.current.loop = false
    }

    if (running) {
      audio_ref.current.addEventListener('timeupdate', (e) => handleTimeUpdate(e));
    }

    return () => {
      audio_ref.current.addEventListener('timeupdate', handleTimeUpdate)
    }

  }, [running])


  return (
    <div className="time-line">
      <div className='container-progress'>
        {/*durationSongMils is a local variable and I use this to know when trying to play a new song*/}
        <div ref={slider_ref} className='slider-bar' style={{ width: `${durationSongMils ? progress : '0%'}` }}></div>
        <input id="slider" type="range" min="0" max={durationSongMils} value={durationSongMils ? range.toString() : 0} step="1"
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