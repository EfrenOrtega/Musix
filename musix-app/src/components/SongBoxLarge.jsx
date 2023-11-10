import '../styles/song-box.css';

import { useContext} from 'react';
import PlayerContext from '../context/PlayerContext';

import fetchAJAX from '../helpers/fetch';
import PlaylistContext from '../context/PlaylistContext';
import Context from '../context/Context';

import { _doublyLinkedList as queue } from "../helpers/doublyLinkedList";

export default function SongBoxLarge({ data, _favorite, displayOptions }) {

  const { id, cover, name, artist, duration, album, created, pathSong, favoriteSong } = data

  const {
    playPause,
    setPlayPause,
    setNextIsDisabled,
    setPrevIsDisabled,
    HandlePlayPause,
    audio_ref,
    dataSong, 
    setDataSong,
    setRunning,
    favorite,
    setFavorite
  } = useContext(PlayerContext)

  const { setAlertVisible, setMsgAlert } = useContext(Context);


  const {refetchCachePlaylist, refetchCacheArtistSongs} = useContext(PlaylistContext)

  const playSong = (e) => {

    /** Clear the List */
    queue.clear();

    /** Add the Song playing in the List */
    queue.insertion_ending({
      _id: id,
      name,
      artist,
      cover: cover,
      url: pathSong,
      favorite: favoriteSong
    })

    setRunning(false)

    HandlePlayPause(
      e,
      playPause,
      setPlayPause,
      audio_ref,
      setNextIsDisabled,
      setPrevIsDisabled,
      setDataSong,
      setRunning,
      id
    )
  }


  const addFavorite = (e) => {

    console.log(e.target.dataset.id)

    if(dataSong && (dataSong._id == e.target.dataset.id)){
      setDataSong({
        ...dataSong,
        favorite:!favorite
      })
    }

    if (favorite) {
      setFavorite(false)
    } else {
      setFavorite(true)
    }

    let dateNow = new Date(Date.now())
    let dateTime = new Date(dateNow.getTime() - dateNow.getTimezoneOffset() * 60000).toISOString()
    let date = dateTime.split('T')[0]

    fetchAJAX({
      url: `http://${location.hostname}:5000/addfavorite/${id}/${localStorage.getItem('id')}/${date}`,
      settings: {
        headers: {
          'Content-Type': 'application/json'
        }
      },
      resSuccess: (res) => {

        if (favorite) {
          setFavorite(false)
        } else {
          setFavorite(true)
        }

        refetchCachePlaylist()
        refetchCacheArtistSongs()

      },
      resError: (err) => {
        
        setMsgAlert({msg:'Error to Add Song', status:false})
        setAlertVisible(true)

        setTimeout(()=>{
          setAlertVisible(false)
        }, 1800)

      }
    }
    )

  }



  return (
    <div className="song-box large">
      <div className='container-cover-data'>
        <div className="cover">
          <span>
            <img
              onClick={(e) => playSong(e)}
              className="play-icon"
              src={'/icons/play-icon.png'}
              alt="Play"
            />
          </span>

          <figure>
            {cover.includes('http')
              ?
              <img src={cover} alt={name} />
              :
              <img src={`/images/${cover}`} alt={name} />
            }
          </figure>
        </div>

        <div className='data'>
          <p id='name'><strong>{name}</strong></p>
          <p id='artist'>{artist}</p>
        </div>
      </div>


      <div>
        <p>{album}</p>
      </div>

      <div>
        <p>{duration}</p>
      </div>

      <div>
        <p>{created}</p>
      </div>

      <div className="btn-options">
        {(_favorite) ?
          <img data-id={id} onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-active.png'} alt="" />
          :
          <img data-id={id} onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite.png'} alt="" />
        }

        <img data-id={id} onClick={(e) => displayOptions(e, id)} src={'/icons/more-options.png'} alt="" />




      </div>
    </div>
  )
}