import { createContext, useState, useRef } from "react";
import {
  HandlePlayPause,
  HandleNext,
  HandlePrev,
  content
} from '../helpers/playerFunctions'

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {

  const [playPause, setPlayPause] = useState(false)
  const [nextIsDisabled, setNextIsDisabled] = useState(false)
  const [prevIsDisabled, setPrevIsDisabled] = useState(false)

  const [dataSong, setDataSong] = useState(
    { name: "", artist: "", duration: "", cover: "" }
  )

  const audio_ref = useRef(null);


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
    content
  }

  return (
    <PlayerContext.Provider value={data}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerProvider }
export default PlayerContext;