
import { useState, createContext } from "react";

const Context = createContext();

const Provider = ({ children }) => {

  const [displayFormPlaylist, setDisplayFormPlaylist] = useState(false)
  const [displayOptionsSong, setDisplayOptionsSong] = useState()

  let data = {
    displayFormPlaylist,
    setDisplayFormPlaylist,
    displayOptionsSong,
    setDisplayOptionsSong
  }

  return (
    <Context.Provider value={data}>
      {children}
    </Context.Provider>
  )
}

export { Provider }
export default Context;