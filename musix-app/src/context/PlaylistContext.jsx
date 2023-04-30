import { useState, createContext, useEffect } from "react";
import fetchAJAX from "../helpers/fetch";
import { useQuery } from "react-query";
import { queryClient } from "../main";


const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {

  const [Playlists, setPlaylists] = useState()
  const [run, setRun] = useState(false)
  const [dataSongs, setDataSongs] = useState([])
  const [favorite, setFavorite] = useState(false)

  const [idPlaylist, setIdPlaylist] = useState(null);

  useEffect(() => {
  }, [run])

  const getplaylists = ()=>{
    if (!idPlaylist) {
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
        url: `http://${window.location.hostname}:5000/getplaylist/${idPlaylist}`,
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

  const {data:dataPlaylist, refetch:refetchCachePlaylist} = useQuery(['playlist', idPlaylist], getplaylists,
  {
    enabled: false,
    staleTime:Infinity,
    keepPreviousData:true
  })

  useEffect(()=>{

    if(idPlaylist){
      refetchCachePlaylist()
    }

  },[idPlaylist])


  const addToPlaylist = (e, dataSong) => {

    e.preventDefault()

    if (!dataSong) return

    let PlaylistSelected = e.target.dataset.id

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/addtoplaylist/${PlaylistSelected}/${dataSong._id}`,
      resSuccess: (res) => {
        console.log(res.message)
        localStorage.setItem('addedToPlaylist', true)
      },
      resError: (err) => {
        console.error(err)
      }
    })
  }


  const getSongsPlaylist = (idPlaylist) => {

    let songs = []

    return new Promise((resolve, reject) => {

      fetchAJAX({
        url: `http://${window.location.hostname}:5000/getplaylist/${idPlaylist}`,
        resSuccess: (res) => {
          if (!res.results) return
          res.results[0].songs.forEach((el, index) => {

            fetchAJAX({
              url: `http://${window.location.hostname}:5000/getsongplaylist/${el.song_id.$oid}`,
              resSuccess: (resSong) => {
                songs.push(resSong.results)
                setDataSongs([...dataSongs, ...songs])

                if (index + 1 == res.results[0].songs.length) {
                  return resolve(songs)
                }
              },
              resError: (err) => {
                console.error(err)
              }
            })

          })

        },
        resError: (err) => {
          console.error(err)
        }
      })

    })

  }


  let data = {
    setPlaylists,
    Playlists,
    setRun,
    run,
    addToPlaylist,
    dataSongs,
    getSongsPlaylist,
    setFavorite,
    favorite,
    idPlaylist, 
    setIdPlaylist,
    dataPlaylist,
    refetchCachePlaylist
  }

  return (
    <PlaylistContext.Provider value={data}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { PlaylistProvider }
export default PlaylistContext;