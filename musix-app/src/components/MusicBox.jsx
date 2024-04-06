import { useContext, useState } from 'react';

import '../styles/music-box.css'
import PlayerContext from '../context/PlayerContext';
import PlaylistContext from '../context/PlaylistContext';

import { DoublyLinkedList, _doublyLinkedList, _doublyLinkedList as queue } from "../helpers/doublyLinkedList";
import ModalInfo from './micro/ModalInfo';


export default function MusicBox({ cover, songInfo, pathSong, nameClass, type, lyrics }) {

  const { id, name, artist, favoriteSong, duration, licence } = songInfo

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

  const [showInfo, setShowInfo] = useState(false)


  const playSong = async (e, idSong) => {

    if (type === 'playlist') {

      //Get the songs from the playlist with its id
      await getSongsPlaylist(id)
        .then(res => {

          let newQueue = new DoublyLinkedList()//Create a new QUEUE

          res.map(song => {//Add the songs to the QUEUE
            newQueue.insertion_ending(song)
          })

          localStorage.setItem('currentPlaylist', 'inQueue')
          setQUEUE(newQueue)//Update the QUEUE State with the newQUEUE

          HandlePlayPause(
            newQueue,
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
            newQueue.getNode(0).data._id
          )

        })
        .catch(err => {
          console.log(err)
        })

    } else {

      let newQueue = QUEUE.clone()

      newQueue.clear()
      newQueue.insertion_ending({
        _id: id,
        name,
        artist,
        cover: `${cover}`,
        lyrics: `${lyrics}`,
        url: pathSong,
        licence: licence,
        favorite: favoriteSong,
        duration: duration
      })

      setQUEUE(newQueue)
      setRunning(false)

      HandlePlayPause(
        newQueue,
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

  return (

    <div className={!nameClass ? "music-box" : `music-box ${nameClass}`}>

      <div className="cover">

        {
          type !== 'playlist' &&
          <>
            <img onClick={() => { setShowInfo(true) }} className='copyright-info' src="./icons/copyright.svg" alt="Licence" />
          </>
        }

        {
          showInfo &&
          <ModalInfo setShowInfo={setShowInfo} info={[licence]}></ModalInfo>
        }

        <span>
          <div onClick={(e) => playSong(e, id)}>
            <img className='play-icon' src={"/icons/play-icon.png"} alt="Play" />
          </div>
        </span>


        {!cover[0].includes('http') ?

          cover.lenght > 0 ?
            <div className='generate-cover'>
              <img src={`/images/${cover[0]}`} alt="Song" />
              <img src={`/images/${cover[1]}`} alt="Song" />
              <img src={`/images/${cover[2]}`} alt="Song" />
              <img src={`/images/${cover[3]}`} alt="Song" />
            </div>
            :
            <div className='cover-img'>
              <img src={`/images/${cover}`} alt="Song" />
            </div>
          :
          cover.lenght > 0 ?
            <div className='generate-cover'>
              <img src={cover[0]} alt="Song" />
              <img src={cover[1]} alt="Song" />
              <img src={cover[2]} alt="Song" />
              <img src={cover[3]} alt="Song" />
            </div>
            :
            <div className='cover-img'>
              <img src={cover[0]} alt="Song" />
            </div>
        }


      </div>

      <p><strong>{name}</strong></p>

      {artist &&
        <p>{artist}</p>
      }

    </div>

  )
}