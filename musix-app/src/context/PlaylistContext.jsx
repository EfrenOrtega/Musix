import { useState, createContext, useEffect } from "react";
import fetchAJAX from "../helpers/fetch";

const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {

  const [Playlists, setPlaylists] = useState()
  const [favoriteSongs, setFavoriteSongs] = useState()
  const [run, setRun] = useState(false)
  const [dataSongs, setDataSongs] = useState([])

  useEffect(() => {

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getfavorites/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        if (!res.results) return
        let favorite = []
        res.results[0].songs.map(el => {
          favorite.push(el.song_id.$oid)
        })
        setFavoriteSongs(favorite)
      },
      resError: (err) => {
        console.error(err)
      }
    })
  }, [run])


  const addToPlaylist = (e, dataSong) => {

    e.preventDefault()

    if (!dataSong) return

    let PlaylistSelected = e.target.dataset.id

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/addtoplaylist/${PlaylistSelected}/${dataSong._id}`,
      resSuccess: (res) => {
        console.log(res.message)
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
    favoriteSongs,
    setFavoriteSongs,
    setRun,
    run,
    addToPlaylist,
    dataSongs,
    getSongsPlaylist
  }

  return (
    <PlaylistContext.Provider value={data}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { PlaylistProvider }
export default PlaylistContext;