
import { useState, createContext } from "react";

const Context = createContext();

const Provider = ({ children }) => {

  const [displayFormPlaylist, setDisplayFormPlaylist] = useState(false)
  const [display, setDisplay] = useState(false) //To Display o Hide the Player
  const [alertVisible, setAlertVisible] = useState(false)
  const [msgAlert, setMsgAlert] = useState({msg:'', status:false})


  let data = {
    displayFormPlaylist,
    setDisplayFormPlaylist,
    display,
    setDisplay,
    alertVisible,
    setAlertVisible,
    msgAlert,
    setMsgAlert
  }

  return (
    <Context.Provider value={data}>
      {children}
    </Context.Provider>
  )
}

export { Provider }
export default Context;