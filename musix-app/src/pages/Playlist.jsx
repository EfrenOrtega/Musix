import { useEffect, useState, useContext, useRef, Suspense, lazy } from "react";

import { useParams } from "react-router-dom";
import Header from "../components/Header";
import OptionsPerSong from "../components/micro/OptionsPerSong";
const SongBoxLarge = lazy(() => import("../components/SongBoxLarge"));

import PlaylistContext from "../context/PlaylistContext";
import PlayerContext from "../context/PlayerContext";
import { addToFavorites, searchFavoritesSongsIds } from '../helpers/Favorites';

import Context from "../context/Context";

export default function Playlist() {

  /** States to manage(visible/hidden) the song options */
  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})
  const [pointerXYPrev, setPointerXYPrev] = useState(null)
  const [idSong, setIdSong] = useState(null)
  const [displayOptionsSong, setDisplayOptionsSong] = useState()
  const optionsSong = useRef(null);

  /** This is to store the favorite songs of the playlist and handle(enabled/disabled) their Favorite Icon */
  const [favorites, setFavorites] = useState([])

  //To display a floating message in the view
  const { setAlertVisible, setMsgAlert } = useContext(Context);

  const { setIdPlaylist, dataPlaylist, refetchCachePlaylist, refetchCacheArtistSongs } = useContext(PlaylistContext)
  const { dataSong, setDataSong } = useContext(PlayerContext)

  //Id of the current Playlist
  let { id } = useParams()

  useEffect(() => {


    //Searches and Stores only the favorites songs of the playlist
    if (dataPlaylist) {
      console.log(dataPlaylist)
      setFavorites(searchFavoritesSongsIds(dataPlaylist[0].songs))
    }

    //Stores the current playlist ID
    if (id) {
      setIdPlaylist(id)
    }

    setDisplayOptionsSong(false)

    /** This is to know when the user is inside a playlist 
     * And with this it is possible to add all playlist's songs to the Queue when the user plays a song of that playlist
    */
    localStorage.setItem('currentPlaylist', id)

    /** When the user leave the playlist it's removed 'isPlaylist' of the localstorage*/
    return () => {
      localStorage.removeItem('currentPlaylist')
    }

  }, [dataPlaylist])


  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const handleOutsideClick = (e) => {
    let targetElement = e.target;
    if (!optionsSong.current) return
    if (!optionsSong.current.contains(targetElement) && !targetElement.matches('img')) {
      setVisibility(false)
    }
  }


  const displayOptions = (e, idsong) => {

    setIdSong(idsong)

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
        if (visibility) {
          setDisplayOptionsSong(false)
          setVisibility(false)
        } else {
          setDisplayOptionsSong(true)
          setVisibility(true)
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


  const addFavorite = (e) => {
    addToFavorites(e, favorites, setFavorites, setAlertVisible, setMsgAlert, refetchCacheArtistSongs, refetchCachePlaylist, dataSong, setDataSong)
  }

  return (
    <div className='main-container'>

      {(dataPlaylist) &&
        <Header
          type="playlist"
          background=''
          data={{
            title: dataPlaylist[0].name,
            creator: dataPlaylist[0].createdBy,
            created: "15/10/2022"
          }}
          cover={dataPlaylist[0].background}
        />
      }

      <main>
        {
          //This is to display option for each song of the playlist
          <OptionsPerSong
            setDisplayOptionsSong={setDisplayOptionsSong}
            displayOptionsSong={displayOptionsSong}
            visibility={visibility}
            setVisibility={setVisibility}
            pointerXY={pointerXY}
            setPointerXY={setPointerXY}
            idSong={idSong}
            refProp={optionsSong}
            setPointerXYPrev={setPointerXYPrev}
          />
        }


        <Suspense fallback={<div>Cargando canciones...</div>}>
          {
            //LOAD PLAYLIST SONG
            ((dataPlaylist && dataPlaylist.length > 0)) &&

            dataPlaylist[0].songs.map((el, index) => {
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
                  favoriteSong: el.favorite
                }
                }
                _favorite={favorites.includes(el._id)}
                displayOptions={displayOptions}
                addFavorite={addFavorite}
              />
            })

          }
        </Suspense>

      </main>
    </div>
  )
}