import * as React from 'react'
import { useEffect, useState, useContext } from 'react'

import SongBoxLarge from '../components/SongBoxLarge'
import OptionsPerSong from '../components/micro/OptionsPerSong'

import fetchAJAX from '../helpers/fetch'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'

import PlaylistContext from '../context/PlaylistContext'

export default function Artist() {

  const [dataSongs, setDataSongs] = useState()
  const [dataArtist, setDataArtist] = useState(null)
  const { favoriteSongs } = useContext(PlaylistContext)

  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})
  const [pointerXYPrev, setPointerXYPrev] = useState(null)
  const [idSong, setIdSong] = useState(null)
  const [displayOptionsSong, setDisplayOptionsSong] = useState()



  let { id } = useParams()


  useEffect(() => {

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getartist/${id}`,
      resSuccess: (res) => {
        setDataArtist(res)

        fetchAJAX({
          url: `http://${window.location.hostname}:5000/getsongbyartist/${res.name}`,
          resSuccess: (res) => {
            setDataSongs(res)
          },
          resError: (err) => {
            console.error(err)
          }
        })


      },
      resError: (err) => {
        console.error(err)
      }
    })

  }, [])


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

        {
          dataSongs &&
          dataSongs.map((el, index) => {
            let found = favoriteSongs.find(favorite => favorite == el._id)

            if (!found) {
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
                  pathSong: el.url
                }
                }
                favorite={false}
                displayOptions={displayOptions}
              />
            } else {
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
                  pathSong: el.url
                }
                }
                favorite={true}
                displayOptions={displayOptions}
              />
            }
          })
        }

      </main>
    </div>
  )

}