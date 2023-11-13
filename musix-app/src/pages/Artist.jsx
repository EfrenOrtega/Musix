import { useEffect, useState, useCallback, useContext } from 'react'

import SongBoxLarge from '../components/SongBoxLarge'
import OptionsPerSong from '../components/micro/OptionsPerSong'

import fetchAJAX from '../helpers/fetch'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'

import { useQuery } from 'react-query'
import PlaylistContext from '../context/PlaylistContext'
import { addToFavorites, searchFavoritesSongsIds } from '../helpers/Favorites'
import Context from '../context/Context'
import PlayerContext from '../context/PlayerContext'

export default function Artist() {

  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})
  const [pointerXYPrev, setPointerXYPrev] = useState(null)
  const [idSong, setIdSong] = useState(null)
  const [displayOptionsSong, setDisplayOptionsSong] = useState()

  const {setIdArtist, dataSongsArtist:dataSongs, dataArtist, refetchCacheArtistSongs, refetchCachePlaylist, setNameArtist} = useContext(PlaylistContext)
  const { dataSong, setDataSong} = useContext(PlayerContext)
  const [favorites, setFavorites] = useState([])
  const { setAlertVisible, setMsgAlert } = useContext(Context);

  let { id, name } = useParams()

  useEffect(()=>{

    console.log(id)
    setIdArtist(id)
    setNameArtist(name)

    if(dataSongs){
      console.log(id)
      console.log(dataSongs)
    }

    if(dataSongs){
      setFavorites(searchFavoritesSongsIds(dataSongs))
    }

    

  },[dataSongs, dataArtist])


  const displayOptions = (e, idsong) => {

    setIdSong(e.target.dataset.id)

    //Set the x, y, with and the position of the scroll of the icon when user clicked it to see the options of the song
    setPointerXY({
      'x': e.target.getBoundingClientRect().x,
      'y': e.target.getBoundingClientRect().y,
      'width': e.target.getBoundingClientRect().width,
      'topScroll': document.querySelector('.main-container').scrollTop
    })

    //Now I need to control de previous options that the user opened
    if (pointerXYPrev) {//if true means isn't the first time the user open the options of one song

      //so, first verify is the user open a diferent song options or he clicked on the same icon to display the option of the same song
      if (pointerXYPrev.y != e.target.getBoundingClientRect().y) {


        //So save the same data: x, y, with and the position of the scroll of the icon that display the options of the song
        setPointerXYPrev({
          'x': e.target.getBoundingClientRect().x,
          'y': e.target.getBoundingClientRect().y,
          'width': e.target.getBoundingClientRect().width,
          'topScroll': document.querySelector('.main-container').scrollTop
        })

        setDisplayOptionsSong(true)
      } else {

        //If the user cliked on the same icon we only have two option display or hide song options.
        if (displayOptionsSong) {
          setDisplayOptionsSong(false)
        } else {
          setDisplayOptionsSong(true)
        }

      }
    } else {//If pointerXYPrev it's false means is the first time the user open the options of one song

      //So save the same data: x, y, with and the position of the scroll of the icon that display the options of the song
      setPointerXYPrev({
        'x': e.target.getBoundingClientRect().x,
        'y': e.target.getBoundingClientRect().y,
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

  const addFavorite = (e) =>{
    addToFavorites(e, favorites, setFavorites, setAlertVisible, setMsgAlert,  refetchCacheArtistSongs, refetchCachePlaylist, dataSong, setDataSong)
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
                  pathSong: el.url,
                  favoriteSong:el.favorite
                }
                }
                _favorite={favorites.includes(el._id)}
                displayOptions={displayOptions}
                addFavorite = {addFavorite}
              />
          })
        }

      </main>
    </div>
  )

}