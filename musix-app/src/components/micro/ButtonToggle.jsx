import { useState } from 'react'
import '../../styles/btn-toggle.css'

export default function ButtonToggle({ setVisibility }) {

  const [toggle, setToggle] = useState(true)

  const handleToogle = (e) => {
    if (toggle) {
      setToggle(false)
      setVisibility(false)
    } else {
      setToggle(true)
      setVisibility(true)
    }
  }

  return (
    <div onClick={(e) => handleToogle(e)} className="btn-toggle">
      <div onClick={(e) => handleToogle(e)} className={!toggle ? "circle-toggle" : "circle-toggle active"}></div>
    </div>
  )
}