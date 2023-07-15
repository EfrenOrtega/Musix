import { useState, createContext, useEffect, useCallback } from "react";
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
  const [idArtist, setIdArtist] = useState(null);


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

  const getArtist = useCallback(()=>{
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getartist/${idArtist}`,
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
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })


  //CACHENING
  const {data:dataPlaylist, refetch:refetchCachePlaylist} = useQuery(['playlist', idPlaylist], getplaylists,
  {
    enabled: false,
    staleTime:Infinity,
    keepPreviousData:true
  })

  const { data: dataArtist, refetch:refetchCacheArtist } = useQuery(['artistInfo', idArtist], getArtist, {
    enabled: false,
    staleTime: 60 * 60 * 1000,
    keepPreviousData: true,
    cacheTime: 100 * 10000
  });
  
  //This a request that depends of 'dataArtist'
  const {data:dataSongsArtist, refetch:refetchCacheArtistSongs} = useQuery(['songsArtist', idArtist], getSongArtist,
    {
      enabled: !!dataArtist, //Here, we execute it when 'dataArtist' exist
      staleTime:Infinity,
      keepPreviousData:true,
      cacheTime: 100 * 10000
  })

  useEffect(()=>{

    if(idPlaylist){
      refetchCachePlaylist()
    }

    if(idArtist){
      refetchCacheArtist()
    }

  },[idPlaylist, idArtist])


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
    idArtist,
    refetchCachePlaylist,
    setIdArtist,
    dataPlaylist,
    dataSongsArtist,
    dataArtist,
    refetchCacheArtist,
    refetchCacheArtistSongs
  }

  return (
    <PlaylistContext.Provider value={data}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { PlaylistProvider }
export default PlaylistContext;