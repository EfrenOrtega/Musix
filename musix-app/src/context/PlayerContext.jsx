import { createContext, useState, useRef } from "react";

import {
  HandlePlayPause,
  HandleNext,
  HandlePrev,
  durationMils,
  keysFunctions,
  HandleLoop,
  HandleVolumeApp
} from '../helpers/playerFunctions'
import { _doublyLinkedList } from "../helpers/doublyLinkedList";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {

  const [playPause, setPlayPause] = useState(false)
  const [nextIsDisabled, setNextIsDisabled] = useState(false)
  const [prevIsDisabled, setPrevIsDisabled] = useState(false)
  const [running, setRunning] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [secondsSong, setSecondsSong] = useState(0)

  const [QUEUE, setQUEUE] = useState(_doublyLinkedList);


  /** This is to know when a new Song is trying to play.
   * If it is, then initialize the Progress Silder to 0
   */
  const [loadedAudio, setLoadedAudio] = useState(null)


  const [isSliderMoving, setIsSliderMoving] = useState(0)


  const [dataSong, setDataSong] = useState(
    { name: "", artist: "", duration: "", cover: "", url: "", lyrics: "", _id: "" }
  )

  const audio_ref = useRef(null);
  const source_ref = useRef(null);
  const progress_ref = useRef(null)


  const handlePlayPause = (
    e,
    playPause,
    setPlayPause,
    audio_ref,
    source_ref,
    setNextIsDisabled,
    setPrevIsDisabled,
    setDataSong,
    setRunning,
    idSong
  ) => {
    HandlePlayPause(QUEUE, setQUEUE, e, playPause, setPlayPause, audio_ref, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, idSong);
  }


  let data = {
    playPause,
    setPlayPause,
    nextIsDisabled,
    setNextIsDisabled,
    prevIsDisabled,
    setPrevIsDisabled,
    handlePlayPause,
    HandleNext,
    HandlePrev,
    audio_ref,
    source_ref,
    dataSong,
    setDataSong,
    progress_ref,
    durationMils,
    keysFunctions,
    HandleLoop,
    HandleVolumeApp,
    running,
    setRunning,
    favorite,
    setFavorite,
    secondsSong,
    setSecondsSong,
    isSliderMoving,
    setIsSliderMoving,
    loadedAudio,
    setLoadedAudio,
    QUEUE,
    setQUEUE
  }

  return (
    <PlayerContext.Provider value={data}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerProvider }
export default PlayerContext;