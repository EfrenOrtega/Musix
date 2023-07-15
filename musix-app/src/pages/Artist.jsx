import { useEffect, useState, useCallback, useContext } from 'react'

import SongBoxLarge from '../components/SongBoxLarge'
import OptionsPerSong from '../components/micro/OptionsPerSong'

import fetchAJAX from '../helpers/fetch'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'

import { useQuery } from 'react-query'
import PlaylistContext from '../context/PlaylistContext'

export default function Artist() {

  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})
  const [pointerXYPrev, setPointerXYPrev] = useState(null)
  const [idSong, setIdSong] = useState(null)
  const [displayOptionsSong, setDisplayOptionsSong] = useState()

  const {setIdArtist, dataSongsArtist:dataSongs, dataArtist} = useContext(PlaylistContext)

  let { id } = useParams()

  useEffect(()=>{

    if(id){
      setIdArtist(id)
    }

  },[dataSongs, dataArtist])


  const displayOptions = (e, idsong) => {

    setIdSong(idsong)

    setPointerXY({
      'left': e.target.getBoundingClientRect().left,
      'top': e.target.getBoundingClientRect().top,
      'width': e.target.getBoundingClientRect().width,
      'topScroll': document.querySelector('.main-container').scrollTop
    })

    if (pointerXYPrev) {
      if (pointerXYPrev.top != e.target.getBoundingClientRect().top) {
        setPointerXY({
          'left': e.target.getBoundingClientRect().left,
          'top': e.target.getBoundingClientRect().top,
          'width': e.target.getBoundingClientRect().width,
          'topScroll': document.querySelector('.main-container').scrollTop
        })

        setPointerXYPrev({
          'left': e.target.getBoundingClientRect().left,
          'top': e.target.getBoundingClientRect().top,
          'width': e.target.getBoundingClientRect().width,
          'topScroll': document.querySelector('.main-container').scrollTop
        })

        setDisplayOptionsSong(false)
        setDisplayOptionsSong(true)
      } else {
        if (displayOptionsSong) {
          setDisplayOptionsSong(false)
        } else {
          setDisplayOptionsSong(true)
        }
      }
    } else {
      setPointerXY({
        'left': e.target.getBoundingClientRect().left,
        'top': e.target.getBoundingClientRect().top,
        'width': e.target.getBoundingClientRect().width,
        'topScroll': document.querySelector('.main-container').scrollTop
      })

      setPointerXYPrev({
        'left': e.target.getBoundingClientRect().left,
        'top': e.target.getBoundingClientRect().top,
        'width': e.target.getBoundingClientRect().width,
        'topScroll': document.querySelector('.main-container').scrollTop
      })

      if (displayOptionsSong) {
        setDisplayOptionsSong(false)
      } else {
        setDisplayOptionsSong(true)
      }
    }
  }


  return (
    <div className='main-container'>
      {
        dataArtist &&

        <Header
          type="artist"
          background={dataArtist.background}
          data={dataArtist}
        />
      }
      <main>
        {displayOptionsSong &&
          <OptionsPerSong
            setDisplayOptionsSong={setDisplayOptionsSong}
            visibility={visibility}
            setVisibility={setVisibility}
            pointerXY={pointerXY}
            setPointerXY={setPointerXY}
            idSong={idSong}
          />
        }
        {console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJWDW")}

        {
          dataSongs &&
          dataSongs.map((el, index) => {
              return <SongBoxLarge
                key={index}
                data={{
                  id: el._id,
                  cover: el.cover,
                  name: el.name,
                  artist: el.artist,
                  duration: el.duration,
                  album: el.album,
                  created: el.created,
                  pathSong: el.url,
                  favoriteSong:el.favorite
                }
                }
                _favorite={el.favorite ? true : false}
                displayOptions={displayOptions}
              />
          })
        }

      </main>
    </div>
  )

}