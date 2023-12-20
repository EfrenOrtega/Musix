
/*This display the options for each song*/
import '../../styles/options-songs.css'

import { useContext } from 'react'
import PlaylistContext from '../../context/PlaylistContext'
import { useEffect, useState} from 'react'
import Context from '../../context/Context'

export default function OptionsPerSong({ visibility, setVisibility, pointerXY, idSong, setDisplayOptionsSong,displayOptionsSong,  refProp, setPointerXYPrev}) {

  const { Playlists, addToPlaylist } = useContext(PlaylistContext)
  const {risize} =useContext(Context)
  const [positionXY, setPositionXY] = useState({})

  //When the view is resized, the song options hide and initialize their previous position to null.
  useEffect(()=>{
    setVisibility(false)
    setDisplayOptionsSong(false)
    setPointerXYPrev(null)
  }, [risize])

  /** When pointerXY changes and displayOptionsSong is true, display the song options at the correct position*/
  useEffect(() => {

    if(!displayOptionsSong) return

    const translateElement = () => {
      translateElementXY(
        null,
        null,
        null,
        refProp.current.getBoundingClientRect().width,
        refProp.current.getBoundingClientRect().height
      )
    }
    translateElement()
  }, [pointerXY])

  /*Help to display this element at the correct coordinates*/
  //So in this function we optain the x & y to display the song options
  const translateElementXY = (x, y, widthIcon, width, height) => {

    
    if (x && y && widthIcon) {
      setPositionXY({
        x: (x - width) + (widthIcon / 2),
        y: (y - height),
      })
    } else {
      setPositionXY({
        x: (pointerXY.x - (width * 2)) - pointerXY.width,
        y: (pointerXY.y - height) + pointerXY.topScroll,
      })


      setVisibility(true)//Display this componente "Song's Options"
    }

  }

  

  return (
    <div ref={refProp} className={visibility === true ? 'container-options-song visible' : 'container-options-song'} style={{ left: `${positionXY.x}px`, top: `${positionXY.y}px` }}>
      <ul>
        <li><a>Add to Playlist</a>
          <ul>
            {Playlists && Playlists.map(el => {
              if (el.name !== 'Favorites') {
                return <li key={el._id}>
                  <a onClick={(e) => {
                    setDisplayOptionsSong(false)
                    addToPlaylist(e, { '_id': idSong })
                  }} data-id={el._id} href=''>{el.name}</a>
                </li>
              }
            })}
          </ul>
        </li>
      </ul>
    </div>
  )
}