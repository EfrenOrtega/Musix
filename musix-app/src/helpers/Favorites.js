import fetchAJAX from './fetch';

const addToFavorites = (e, favorites, setFavorites, setAlertVisible, setMsgAlert, refetchCacheArtistSongs, refetchCachePlaylist, dataSong, setDataSong) => {

    if(!favorites.includes(e.target.dataset.id)){
      setFavorites([...favorites, e.target.dataset.id])
    }else{
      setFavorites(favorites.filter(id => id !== e.target.dataset.id));
    }

    if (dataSong && (dataSong._id == e.target.dataset.id)) {
      setDataSong({
        ...dataSong,
        favorite: !favorites.includes(e.target.dataset.id)
      })
    }    

    let dateNow = new Date(Date.now())
    let dateTime = new Date(dateNow.getTime() - dateNow.getTimezoneOffset() * 60000).toISOString()
    let date = dateTime.split('T')[0]

    fetchAJAX({
      url: `http://${location.hostname}:5000/addfavorite/${e.target.dataset.id}/${localStorage.getItem('id')}/${date}`,
      settings: {
        headers: {
          'Content-Type': 'application/json'
        }
      },
      resSuccess: (res) => {

        /*if (favorite) {
          setFavorite(false)
        } else {
          setFavorite(true)
        }*/

        if(refetchCacheArtistSongs){
          refetchCacheArtistSongs()
        }

        if(refetchCachePlaylist ){
          refetchCachePlaylist()
        }

      },
      resError: (err) => {
        console.log(err)
        setFavorites(favorites.filter(id => id !== e.target.dataset.id));

        setMsgAlert({ msg: 'Error to Add Song', status: false })
        setAlertVisible(true)

        setTimeout(() => {
          setAlertVisible(false)
        }, 1800)

      }
    }
    )

}

/**
 * 
 * @param {Array} songsObject - Songs with its data
 * @returns {Array}
 */
const searchFavoritesSongsIds  = (songsObject) =>{
  return songsObject.map(song =>{
    if(song.favorite){
      return song._id
    }
  })
}




export {addToFavorites, searchFavoritesSongsIds}