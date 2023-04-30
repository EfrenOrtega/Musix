import { useEffect, useState, useCallback } from 'react'

import SongBoxLarge from '../components/SongBoxLarge'
import OptionsPerSong from '../components/micro/OptionsPerSong'

import fetchAJAX from '../helpers/fetch'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'

import { useQuery } from 'react-query'

export default function Artist() {

  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})
  const [pointerXYPrev, setPointerXYPrev] = useState(null)
  const [idSong, setIdSong] = useState(null)
  const [displayOptionsSong, setDisplayOptionsSong] = useState()

  let { id } = useParams()

  const getArtist = useCallback(()=>{
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getartist/${id}`,
      resSuccess: (res) => {
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  const getSongArtist = useCallback(()=>{
    return  fetchAJAX({
      url: `http://${window.location.hostname}:5000/getsongbyartist/${dataArtist.name}/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        //setDataSongs(res)
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  //CACHENING
  const { data: dataArtist } = useQuery('artistInfo', getArtist, {
    staleTime: 60 * 60 * 1000,
    keepPreviousData: true,
    cacheTime: 100 * 10000
  });

  //This a request that depends of 'dataArtist'
  const {data:dataSongs} = useQuery(['songsArtist', id], getSongArtist,
  {
    enabled: !!dataArtist, //Here, we execute it when 'dataArtist' exist
    staleTime:Infinity,
    keepPreviousData:true,
    cacheTime: 100 * 10000
  })


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
                favorite={el.favorite}
                displayOptions={displayOptions}
              />
          })
        }

      </main>
    </div>
  )

}