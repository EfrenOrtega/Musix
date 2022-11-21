
import { useState, createContext, useRef } from "react";

const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {

  const [Playlists, setPlaylists] = useState()
  const [measures, setMeasures] = useState({ width: 0, height: 0 })

  let data = {
    setPlaylists,
    Playlists,
    setMeasures,
    measures,
  }

  return (
    <PlaylistContext.Provider value={data}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { PlaylistProvider }
export default PlaylistContext;