
import { useState, createContext } from "react";

const Context = createContext();

const Provider = ({ children }) => {

  const [displayFormPlaylist, setDisplayFormPlaylist] = useState(false)
  const [display, setDisplay] = useState(false) //To Display o Hide the Player
  const [alertVisible, setAlertVisible] = useState(false)
  const [msgAlert, setMsgAlert] = useState({msg:'', status:false})

  //This is to know the data of the view when it is risized
  const [risize, setRisize] = useState({})

  let data = {
    displayFormPlaylist,
    setDisplayFormPlaylist,
    display,
    setDisplay,
    alertVisible,
    setAlertVisible,
    msgAlert,
    setMsgAlert,
    risize, 
    setRisize
  }

  return (
    <Context.Provider value={data}>
      {children}
    </Context.Provider>
  )
}

export { Provider }
export default Context;