
import { useState, createContext } from "react";

const Context = createContext();

const Provider = ({ children }) => {

  const [displayFormPlaylist, setDisplayFormPlaylist] = useState(false)

  let data = {
    displayFormPlaylist,
    setDisplayFormPlaylist,
  }

  return (
    <Context.Provider value={data}>
      {children}
    </Context.Provider>
  )
}

export { Provider }
export default Context;