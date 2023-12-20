import { useState, createContext, useEffect, useCallback } from "react";
import fetchAJAX from "../helpers/fetch";
import { useQuery } from "react-query";


const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {

  const [Playlists, setPlaylists] = useState()
  /** Stores the data of the current playing song.*/
  const [dataSongs, setDataSongs] = useState([])
  /** Store the favorites songs */
  const [favorite, setFavorite] = useState(false)

  /** They're used to control the data of Playlist or artist and update the content of the view with their data */
  const [idPlaylist, setIdPlaylist] = useState(null);//Is used to store the id of a playlist and get that playlist
  const [idArtist, setIdArtist] = useState(null);//Is used to store the id of artist and get that artis
  const [nameArtist, setNameArtist] = useState(null);

  /** playlistsChange and setPlaylistsChange: Used to know when a playlist was created o edited from "My Playlist" Section [Playlists.jsx] */
  const [playlistsChange, setPlaylistsChange] = useState(false)


  // ====  CACHENING   ==== //
  const getplaylist = () => {
    
      return fetchAJAX({
        url: `http://${window.location.hostname}:5000/getplaylist/${idPlaylist}`,
        resSuccess: async (res) => {
          if (!res.results) return
          let playlists = res.results
          return playlists
        },
        resError: (err) => {
          console.error(err)
        }
      })
    
  }

  const {data: dataPlaylist, refetch: refetchCachePlaylist } = useQuery(['playlist', idPlaylist], getplaylist,
    {
      enabled: false,
      staleTime: Infinity,
      keepPreviousData: true
    })

  const getplaylistsToHome = () => {
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

  const { data: dataPlaylists, refetch: refetchCachePlaylists } = useQuery(['playlists'], getplaylistsToHome,
    {
      enabled: false,
      staleTime: Infinity,
      keepPreviousData: true
    })

  const getArtist = useCallback(() => {
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

  const { data: dataArtist, refetch: refetchCacheArtist } = useQuery(['artistInfo', idArtist], getArtist, {
    enabled: false,
    staleTime: 60 * 60 * 1000,
    keepPreviousData: true,
    cacheTime: 100 * 10000
  });


  /**
  * Function to get the Song of an Artist for that it's necessary the Artist name and the User ID
  */
  const getSongArtist = useCallback(() => {
    return fetchAJAX({
      url: `http://${window.location.hostname}:5000/getsongbyartist/${nameArtist}/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        return res
      },
      resError: (err) => {
        console.error(err)
      }
    })
  })

  //This a request that depends of 'dataArtist'
  const { data: dataSongsArtist, refetch: refetchCacheArtistSongs } = useQuery(['songsArtist', idArtist], getSongArtist,
    {
      enabled: !!dataArtist, //Here, we execute it when 'dataArtist' exist
      staleTime: Infinity,
      keepPreviousData: true,
      cacheTime: 100 * 10000
    })

  //Refresh the cache when idPlaylist, idArtist, nameArtist change
  useEffect(() => {

    if (idPlaylist) {
      refetchCachePlaylist()
    }

    if (idArtist) {
      refetchCacheArtist()
    }

    if (nameArtist) {
      refetchCacheArtistSongs()
    }

  }, [idPlaylist, idArtist, nameArtist])

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

  /**
   * Function to get the songs of a specific playlist
   * 
   * @param {String} idPlaylist - Playlist ID
   * @returns {Promise} - With this Promise I can manage the songs of the playlist in other parts of the project
   */
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