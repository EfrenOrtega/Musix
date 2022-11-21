import '../styles/song-box.css';

import { useContext, useState } from 'react';
import PlayerContext from '../context/PlayerContext';

import fetchAJAX from '../helpers/fetch';


export default function SongBoxLarge({ data, favorite, displayOptions }) {

  const { id, cover, name, artist, duration, album, created, pathSong } = data

  const {
    playPause,
    setPlayPause,
    setNextIsDisabled,
    setPrevIsDisabled,
    HandlePlayPause,
    audio_ref,
    setDataSong,
    content,
    setRunning
  } = useContext(PlayerContext)


  const playSong = (e, content) => {

    if (content[0]._id == id) return

    content.unshift({
      _id: id,
      name,
      artist,
      cover: cover,
      url: pathSong
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
      setRunning
    )
  }


  const addFavorite = (e) => {
    fetchAJAX({
      url: `http://${location.hostname}:5000/addfavorite`,
      settings: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
      },
      resSuccess: (res) => {
        if (res.status) {
          location.reload()
        } else {
          console.log(res.message)
        }

      },
      resError: (err) => {
        console.log(err)
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
              onClick={(e) => playSong(e, content)}
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
        {favorite ?
          <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite-active.png'} alt="" />
          :
          <img onClick={(e) => addFavorite(e)} src={'/icons/icon-favorite.png'} alt="" />
        }

        <img onClick={(e) => displayOptions(e, id)} src={'/icons/more-options.png'} alt="" />




      </div>
    </div>
  )
}