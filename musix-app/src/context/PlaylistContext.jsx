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
  const [nameArtist, setNameArtist] = useState(null);

  const [playlistsChange, setPlaylistsChange] = useState(false)

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
      url: `http://${window.location.hostname}:5000/getsongbyartist/${nameArtist}/${localStorage.getItem('id')}`,
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



  const getplaylistsToHome = ()=>{
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getplaylists/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        if (!res.results) return
        setPlaylists(res.results)
        return res.results
      },
      resError: (err) => {
        console.error(err)
      }
    })
  }

  const {data:dataPlaylists, refetch:refetchCachePlaylists} = useQuery(['playlists'], getplaylistsToHome,
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

    if(nameArtist){
      refetchCacheArtistSongs()
    }

  },[idPlaylist, idArtist, nameArtist])

  /**
   * Function to Add a Song to a specific playlist
   * @param {Event} e - With this can get the PlaylistSelected Id
   * @param {Object} dataSong - Data about the song
   *  
   */
  const addToPlaylist = (e, dataSong) => {

    e.preventDefault()

    if (!dataSong) return

    let PlaylistSelected = e.target.dataset.id

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/addtoplaylist/${PlaylistSelected}/${dataSong._id}`,
      resSuccess: (res) => {
        refetchCachePlaylist() // Refresh the Cache to see the playlist update
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
              url: `http://${window.location.hostname}:5000/getsongplaylist/${el._id}`,
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
    refetchCacheArtistSongs,
    playlistsChange, 
    setPlaylistsChange,
    dataPlaylists,
    refetchCachePlaylists,
    setNameArtist
  }

  return (
    <PlaylistContext.Provider value={data}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { PlaylistProvider }
export default PlaylistContext;