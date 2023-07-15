import { useEffect, useState, useContext, useCallback} from "react";
import { useQuery } from 'react-query'

import { useParams } from "react-router-dom";
import Header from "../components/Header";
import SongBoxLarge from "../components/SongBoxLarge";
import OptionsPerSong from "../components/micro/OptionsPerSong";

import fetchAJAX from "../helpers/fetch";

import PlaylistContext from "../context/PlaylistContext";
import PlayerContext from "../context/PlayerContext";

import { queryClient } from "../main";

export default function Playlist() {

  const [visibility, setVisibility] = useState(false)
  const [pointerXY, setPointerXY] = useState({})
  const [pointerXYPrev, setPointerXYPrev] = useState(null)
  const [idSong, setIdSong] = useState(null)


  const { favoriteSongs, setRun, run, setRefetchCachePlaylist, refetchPlaylist, setIdPlaylist, dataPlaylist} = useContext(PlaylistContext)
  const { favorite} = useContext(PlayerContext)

  let { id } = useParams()

  const [displayOptionsSong, setDisplayOptionsSong] = useState()
  
  /*const getplaylists = ()=>{
    if (!id) {
      return  fetchAJAX({
        url: `http://${window.location.hostname}:5000/getplaylists/${localStorage.getItem('id')}`,
        resSuccess: (res) => {
          if (!res.results) return
          let playlists = res.results
          return playlists
        },
        resError: (err) => {
          console.error(err)
        }
      })
    }else{
      return fetchAJAX({
        url: `http://${window.location.hostname}:5000/getplaylist/${id}`,
        resSuccess:async (res) => {
          if (!res.results) return
          let playlists = res.results
          return playlists
        },
        resError: (err) => {
          console.error(err)
        }
      })
    }
  }

  const {data:dataPlaylist} = useQuery(['playlist', id], getplaylists,
  {
    staleTime:Infinity,
    keepPreviousData:true
  })*/

  useEffect(() => {

    if(id){
      setIdPlaylist(id)
    }

    setDisplayOptionsSong(false)

    if (run) {
      setRun(false)
    } else {
      setRun(true)
    }

  }, [dataPlaylist])


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
          displayOptionsSong &&
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