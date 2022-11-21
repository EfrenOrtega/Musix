
/*This display the options for each song*/
import '../../styles/options-songs.css'

import { useContext } from 'react'
import PlaylistContext from '../../context/PlaylistContext'
import { useEffect, useState, useRef } from 'react'

export default function OptionsPerSong({ visibility, setVisibility, pointerXY, idSong, setDisplayOptionsSong }) {

  const { Playlists, addToPlaylist } = useContext(PlaylistContext)
  const [positionXY, setPositionXY] = useState({})

  const optionsSong = useRef(null);

  useEffect(() => {

    const translateElement = () => {

      translateElementXY(
        null,
        null,
        null,
        optionsSong.current.getBoundingClientRect().width,
        optionsSong.current.getBoundingClientRect().height
      )

    }
    translateElement()
  }, [pointerXY])

  /*Help to display this element at the correct coordinates*/
  const translateElementXY = (x, y, widthIcon, width, height) => {

    if (x && y & widthIcon) {
      setPositionXY({
        x: (x - width) + (widthIcon / 2),
        y: (y - height),
      })
    } else {
      setPositionXY({
        x: (pointerXY.left - (width * 2)) - pointerXY.width,
        y: (pointerXY.top - height) + pointerXY.topScroll,
      })

      setVisibility(true)
    }
  }

  return (
    <div ref={optionsSong} className={visibility ? 'container-options-song' : 'container-options-song hide'} style={{ left: `${positionXY.x}px`, top: `${positionXY.y}px` }}>
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