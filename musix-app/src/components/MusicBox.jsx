import { useContext, useEffect } from 'react';

import '../styles/music-box.css'
import PlayerContext from '../context/PlayerContext';
import PlaylistContext from '../context/PlaylistContext';

import { _doublyLinkedList as queue } from "../helpers/doublyLinkedList";


export default function MusicBox({ cover, songInfo, pathSong, nameClass, type, lyrics}) {

  const { id, name, artist, favoriteSong} = songInfo

  const {
    playPause,
    setPlayPause,
    setNextIsDisabled,
    setPrevIsDisabled,
    HandlePlayPause,
    audio_ref,
    setDataSong,
    content,
    setRunning,
    setStop
  } = useContext(PlayerContext)

  const { setRun, run, getSongsPlaylist } = useContext(PlaylistContext)

  const playSong = async (e, content, idSong) => {  
    if(playPause){
      setRunning(false)
      
      HandlePlayPause(
        e,
        false,
        setPlayPause,
        audio_ref,
        setNextIsDisabled,
        setPrevIsDisabled,
        setDataSong,
        setRunning
      )
    }

    if (type === 'playlist') {

      console.warn("You are trying to play a playlist")

      if (run) {
        setRun(false)
      } else {
        setRun(true)
      }

      await getSongsPlaylist(id)
        .then(res => {
          queue.clear();
          
          res.map(song=>{
            queue.insertion_ending(song)
          })

          console.log("\n\nQUEUE OF THE PLAYLIST: ", queue, "\n\n")

          console.log("THE FIRST SONG OF THE PLAYLIST IS: ", queue.getNode(0).data._id)

          HandlePlayPause(
            e,
            playPause,
            setPlayPause,
            audio_ref,
            setNextIsDisabled,
            setPrevIsDisabled,
            setDataSong,
            setRunning,
            queue.getNode(0).data._id
          )
          
        })
        .catch(err => {
          console.log(err)
        })
      
    } else {

      /** if idSong doens't exist in the List [WORKING]*/
      if(!queue.exist_data(id)){
        queue.clear();
        queue.insertion_ending({
          _id: id,
          name,
          artist,
          cover: `${cover}`,
          lyrics:`${lyrics}`,
          url: pathSong,
          favorite:favoriteSong
        })
      }

      /** @deprecated */
      if (content[content.length - 1]._id != id){

        content.push({
          _id: id,
          name,
          artist,
          cover: `${cover}`,
          lyrics:`${lyrics}`,
          url: pathSong,
          favorite:favoriteSong
        })

      }

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
        idSong
      )
    }


  }

  return (

    <div className={!nameClass ? "music-box" : `music-box ${nameClass}`}>

      <div className="cover">

        <span>
          <div onClick={(e) => playSong(e, content, id)}>
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