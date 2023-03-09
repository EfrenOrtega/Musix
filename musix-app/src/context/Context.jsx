
import { useState, createContext } from "react";

const Context = createContext();

const Provider = ({ children }) => {

  const [displayFormPlaylist, setDisplayFormPlaylist] = useState(false)
  const [display, setDisplay] = useState(false) //To Display o Hide the Player


  let data = {
    displayFormPlaylist,
    setDisplayFormPlaylist,
    display,
    setDisplay
  }

  return (
    <Context.Provider value={data}>
      {children}
    </Context.Provider>
  )
}

export { Provider }
export default Context;