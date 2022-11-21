import '../../styles/list-playlist.css'
import { useContext, useRef, useEffect, useState } from 'react'

import PlaylistContext from '../../context/PlaylistContext'
import PlayerContext from '../../context/PlayerContext'
import Context from '../../context/Context'

import fetchAJAX from '../../helpers/fetch'

export default function ListPlaylist({ visibility, setVisibility, pointerXY, iconAddPlaylist, setDisplayListPlaylist }) {

  const { Playlists, addToPlaylist } = useContext(PlaylistContext)
  const { dataSong } = useContext(PlayerContext)
  const [positionXY, setPositionXY] = useState({})
  const { displayFormPlaylist, setDisplayFormPlaylist } = useContext(Context)

  const listPlaylist = useRef(null);

  useEffect(() => {

    window.addEventListener('resize', () => {
      translateElementXY(
        iconAddPlaylist.current.getBoundingClientRect().left,
        iconAddPlaylist.current.getBoundingClientRect().top,
        iconAddPlaylist.current.getBoundingClientRect().width,
        listPlaylist.current.getBoundingClientRect().width,
        listPlaylist.current.getBoundingClientRect().height
      )
    })

    const translateElement = () => {

      translateElementXY(
        null,
        null,
        null,
        listPlaylist.current.getBoundingClientRect().width,
        listPlaylist.current.getBoundingClientRect().height
      )

    }
    translateElement()

  }, [])

  const translateElementXY = (x, y, widthIcon, width, height) => {

    if (x && y & widthIcon) {
      setPositionXY({
        x: (x - width) + (widthIcon / 2),
        y: (y - height),
      })
    } else {
      setPositionXY({
        x: (pointerXY.x - width) + (pointerXY.width / 2),
        y: (pointerXY.y - height),
      })

      setVisibility(true)
    }
  }

  const newPlaylist = (e) => {
    e.preventDefault()
    if (!displayFormPlaylist) {
      setDisplayFormPlaylist(true)
      setDisplayListPlaylist(false)
    }
  }

  return (
    <div
      ref={listPlaylist}
      className={visibility ? 'container-list-playlists' : 'container-list-playlists hide'}
      style={{ left: `${positionXY.x}px`, top: `${positionXY.y}px` }}
    >
      <ul>
        {Playlists && Playlists.map(el => {
          if (el.name !== 'Favorites') {
            return <li key={el._id}>
              <a data-id={el._id} onClick={(e) => addToPlaylist(e, dataSong)} href=''>{el.name}</a>
            </li>
          }
        })}
      </ul>

      <span className="line"></span>
      <span onClick={(e) => newPlaylist(e)} className='new-playlist'>New Playlist</span>
    </div>
  )
}