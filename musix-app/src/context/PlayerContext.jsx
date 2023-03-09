import { createContext, useState, useRef } from "react";
import {
  HandlePlayPause,
  HandleNext,
  HandlePrev,
  content,
  HandleProgress,
  durationMils,
  keysFunctions,
  HandleLoop,
  loadSongs,
  HandleVolumeApp
} from '../helpers/playerFunctions'

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {

  const [playPause, setPlayPause] = useState(false)
  const [nextIsDisabled, setNextIsDisabled] = useState(false)
  const [prevIsDisabled, setPrevIsDisabled] = useState(false)
  const [running, setRunning] = useState(false)

  const [dataSong, setDataSong] = useState(
    { name: "", artist: "", duration: "", cover: "", url: "", _id: "" }
  )

  const audio_ref = useRef(null);
  const progress_ref = useRef(null)


  let data = {
    playPause,
    setPlayPause,
    nextIsDisabled,
    setNextIsDisabled,
    prevIsDisabled,
    setPrevIsDisabled,
    HandlePlayPause,
    HandleNext,
    HandlePrev,
    audio_ref,
    dataSong,
    setDataSong,
    content,
    progress_ref,
    HandleProgress,
    durationMils,
    keysFunctions,
    HandleLoop,
    loadSongs,
    HandleVolumeApp,
    running,
    setRunning,
  }

  return (
    <PlayerContext.Provider value={data}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerProvider }
export default PlayerContext;