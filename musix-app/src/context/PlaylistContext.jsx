
import { useContext } from "react";
import { useState, createContext, useEffect } from "react";
import fetchAJAX from "../helpers/fetch";
import Context from "./Context";

const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {

  const { setDisplayOptionsSong } = useContext(Context)

  const [Playlists, setPlaylists] = useState()
  const [favoriteSongs, setFavoriteSongs] = useState()
  const [run, setRun] = useState(false)

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
        setDisplayOptionsSong(false)
      },
      resError: (err) => {
        console.error(err)
      }
    })
  }


  let data = {
    setPlaylists,
    Playlists,
    favoriteSongs,
    setFavoriteSongs,
    setRun,
    run,
    addToPlaylist
  }

  return (
    <PlaylistContext.Provider value={data}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { PlaylistProvider }
export default PlaylistContext;