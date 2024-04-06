import '../styles/song-box.css';

import { useContext, useState } from 'react';
import PlayerContext from '../context/PlayerContext';

import PlaylistContext from '../context/PlaylistContext';


import { _doublyLinkedList } from "../helpers/doublyLinkedList";
import ModalInfo from './micro/ModalInfo';


export default function SongBoxLarge({ data, _favorite, displayOptions, addFavorite, moveSong, isInQueue = false }) {

  const { id, cover, name, artist, duration, album, created, pathSong, favoriteSong, licence} = data

  const {
    playPause,
    setPlayPause,
    setNextIsDisabled,
    setPrevIsDisabled,
    HandlePlayPause,
    audio_ref,
    source_ref,
    setDataSong,
    setRunning,
    QUEUE,
    setQUEUE
  } = useContext(PlayerContext)

  const { getSongsPlaylist } = useContext(PlaylistContext)

  const playSong = async (e) => {


    /** This song is playing from a playlist or from the Queue?*/
    if (localStorage.getItem('currentPlaylist') || isInQueue) {

      /** If the current playlist is already playing is not necessary to load their songs to the queue */
      if ((localStorage.getItem('currentPlaylist') == 'inQueue' || isInQueue) && _doublyLinkedList.hasSong(id)) {
        console.log("Song play from a playlist")

        HandlePlayPause(
          QUEUE,
          setQUEUE,
          e,
          playPause,
          setPlayPause,
          audio_ref,
          source_ref,
          setNextIsDisabled,
          setPrevIsDisabled,
          setDataSong,
          setRunning,
          id
        )

      } else {
        /** Clear the QUEUE and loads the playlist's songs */
        _doublyLinkedList.clear()

        let idPlaylist = localStorage.getItem('currentPlaylist');
        await getSongsPlaylist(idPlaylist)
          .then(res => {
            res.map(song => {
              _doublyLinkedList.insertion_ending(song)
            })

            setQUEUE(_doublyLinkedList)

            /** To know when a playlist is already in the Queue */
            localStorage.setItem('currentPlaylist', 'inQueue')

            HandlePlayPause(
              _doublyLinkedList,
              setQUEUE,
              e,
              playPause,
              setPlayPause,
              audio_ref,
              source_ref,
              setNextIsDisabled,
              setPrevIsDisabled,
              setDataSong,
              setRunning,
              id
            )

          })
          .catch(err => {
            console.log(err)
          })
      }



    } else {
      /** Clear the QUEUE */
      _doublyLinkedList.clear();

      /** Add the Song playing to the QUEUE */
      _doublyLinkedList.insertion_ending({
        _id: id,
        name,
        artist,
        cover: cover,
        url: pathSong,
        licence: licence,
        favorite: favoriteSong,
        duration: duration
      })

      setQUEUE(_doublyLinkedList)

      setRunning(false)

      HandlePlayPause(
        _doublyLinkedList,
        setQUEUE,
        e,
        playPause,
        setPlayPause,
        audio_ref,
        source_ref,
        setNextIsDisabled,
        setPrevIsDisabled,
        setDataSong,
        setRunning,
        id
      )
    }

  }

  const [showInfo, setShowInfo] = useState(false)


  return (
    <div className="song-box large" draggable={`${moveSong && 'true'}`} onDragStart={(e) => moveSong(e, id)} data-id={id}>
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


      <div className='licence-container'>
        <img onClick={() => { setShowInfo(true) }} className='copyright-info' src="./icons/copyright.svg" alt="Licence" />

        {
          showInfo &&
          <ModalInfo setShowInfo={setShowInfo} info={[licence]} style={'fixed'}></ModalInfo>

        }
      </div>


      <div className="btn-options">
        {(_favorite) ?
          <img data-id={id} onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-active.png'} alt="" />
          :
          <img data-id={id} onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite.png'} alt="" />
        }

        {displayOptions
          &&
          <img data-id={id} onClick={(e) => displayOptions(e, id)} src={'/icons/more-options.png'} alt="" />
        }


        



      </div>
    </div>
  )
}