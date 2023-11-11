//All functions to the Player (Play, Pause, Next, Prev, Loop, etc.)
import fetchAJAX from "./fetch";

import { _doublyLinkedList as queue, travese_data as travese_queue } from "./doublyLinkedList";

const content = []

let currentIdSong = 0;
let currentPositionSong = -1;
let flag = true;

let durationMils = 0
let durationMin = 0
let durationSec = 0
let duration = ""
let counter = null;

let loopFlag = false;
let isLoop = false;

/** This function get all songs and store 'em in the content Array
 * @deprecated
 */
const getSongs = () => {
  fetchAJAX({
    url: `http://${window.location.hostname}:5000/getsongs`,
    resSuccess: (res) => {
      content.push(...res)
    },
    resError: (err) => {
      console.error(err)
    }
  })
}

getSongs()


const loadSongs = (songs, counter) => {
  if ((currentIdSong + 1) == content.length) {
    isLoop = true;
  } else {
  }

}


const loadMetadata = (dataSong) => {

  const { name, artist, album, cover } = dataSong

  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: name,
      artist: artist,
      album: album,
      artwork: [{ src: cover, sizes: '96x96', type: 'image/png' }]
    });
  }
}

const keysFunctions = (
  e,
  setPlayPause,
  audio_ref,
  setNextIsDisabled,
  setPrevIsDisabled,
  setDataSong,
  setRunning
) => {

  if ('mediaSession' in navigator) {

    navigator.mediaSession.setActionHandler('play', () => {
      if (currentPositionSong >= 0) {
        loadMetadata(queue.getNode(currentPositionSong).data)
        HandlePlayPause(e,
          false,
          setPlayPause,
          audio_ref,
          setNextIsDisabled,
          setPrevIsDisabled,
          setDataSong,
          setRunning)
      }

    })

    navigator.mediaSession.setActionHandler('pause', () => {
      HandlePlayPause(e,
        true,
        setPlayPause,
        audio_ref,
        setNextIsDisabled,
        setPrevIsDisabled,
        setDataSong,
        setRunning)
    })

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      HandleNext(
        e,
        setPlayPause,
        audio_ref,
        setNextIsDisabled,
        setPrevIsDisabled,
        setDataSong,
        setRunning
      )
    })

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      HandlePrev(
        e,
        setPlayPause,
        audio_ref,
        setPrevIsDisabled,
        setNextIsDisabled,
        setDataSong,
        setRunning
      )
    })

  }
}

const play = async (audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning) => {

  console.log(audio, "QUEUE: ", queue)

  if (currentPositionSong >= 0) {

    if (queue.size - 1 > currentPositionSong) {
      setNextIsDisabled(false)
    } else {
      setNextIsDisabled(true)
    }

  }


  if (flag) {
    flag = false;
    nextAutomatically(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)
  }

  /**
   *  
   * This is when a song that is stored in the localStorage is playing, this only happend when the user 
   * restart or open the app and play the song that is already in the player
  */
  if (audio.current.src == `http://${window.location.hostname}:1420/`) {
    //The song doesn't exist

    if (currentPositionSong >= 0) {
      audio.current.src = queue.getNode(currentPositionSong).data.url
    } else {
      currentPositionSong = 0;
      audio.current.src = queue.searchByIdSong(localStorage.getItem('idSong')).data.url
      setNextIsDisabled(true)
    }

    await audio.current.play()


    if (currentPositionSong >= 0) {
      loadMetadata(queue.getNode(currentPositionSong).data)
    }
  } else {
    //The song exist
    if (currentPositionSong >= 0) {
      await audio.current.play()
      loadMetadata(queue.getNode(currentPositionSong).data)
    }

  }



  //UPDATE HISTORY
  let settings;
  if (currentPositionSong >= 0) {
    settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUser: localStorage.getItem('id'),
        idSong: queue.getNode(currentPositionSong).data._id,
        date: new Date()
      })
    }
  }

  fetch(`http://${window.location.hostname}:5000/updateHistory`, settings)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json => {
      console.log(json)
    })
    .catch(err => {
      console.log(err)
    })


  if (currentPositionSong >= 0) {
    localStorage.setItem('idSong', queue.getNode(currentPositionSong).data._id)
  }


  setTimeout(() => {
    durationMils = audio.current.duration;
    durationMin = parseInt(audio.current.duration / 60)
    durationSec = Math.floor((audio.current.duration / 60 - durationMin) * 60)

    if ((durationMin.toString().length == 1) || (durationSec.toString().length == 1)) {
      if (!(durationMin.toString().length == 1) && (durationSec.toString().length == 1)) {
        duration = `${durationMin.toString()}:0${durationSec.toString()}`
      } else if ((durationMin.toString().length == 1) && !(durationSec.toString().length == 1)) {
        duration = `0${durationMin.toString()}:${durationSec.toString()}`
      } else {
        duration = `0${durationMin.toString()}:0${durationSec.toString()}`
      }
    } else {
      duration = `${durationMin.toString()}:${durationSec.toString()}`
    }

    if (currentPositionSong >= 0) {
      setDataSong({
        name: queue.getNode(currentPositionSong).data.name,
        artist: queue.getNode(currentPositionSong).data.artist,
        duration: duration,
        cover: queue.getNode(currentPositionSong).data.cover,
        url: queue.getNode(currentPositionSong).data.url,
        lyrics: queue.getNode(currentPositionSong).data.lyrics,
        _id: queue.getNode(currentPositionSong).data._id,
        favorite: queue.getNode(currentPositionSong).data.favorite
      })
    }

  }, 400)

}


const pause = (audio) => {
  audio.current.pause()
}

const nextAutomatically = (audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning) => {
  audio.current.addEventListener('ended', e => {

    setRunning(false)
    next(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)

  })
}


const next = (audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning) => {



  if (currentPositionSong >= 0) {

    if (currentPositionSong + 1 == queue.size && !loopFlag) {
      setNextIsDisabled(true)
      return
    } else if (isLoop) {
      setNextIsDisabled(false)
      currentPositionSong = -1;
      isLoop = false;
    }

    currentPositionSong++


    setPrevIsDisabled(false)

    audio.current.src = queue.getNode(currentPositionSong).data.url

    localStorage.setItem('idSong', queue.getNode(currentPositionSong).data._id)
    play(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)

    return;
  }

}

/** @CHECK */
const prev = (audio, setPrevIsDisabled, setNextIsDisabled, setDataSong) => {

  if (currentPositionSong >= 0) {
    if ((currentPositionSong - 1) == 0) {
      setPrevIsDisabled(true)
    }

    /** This conditional allows to restart the song when is the first song of the queue */
    if (currentPositionSong == 0) {

      /** This is just to give a little animation to the 'prev button' */
      setPrevIsDisabled(true)
      setTimeout(() => {
        setPrevIsDisabled(false)
      }, 1000)

      audio.current.src = queue.getNode(currentPositionSong).data.url
      play(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong)

      return;
    }

    setPrevIsDisabled(false)
    currentPositionSong--

    audio.current.src = queue.getNode(currentPositionSong).data.url
    play(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong)

  }



}


/*Handle Controls*/

const HandlePlayPause = (
  e,
  playPause,
  setPlayPause,
  audio_ref,
  setNextIsDisabled,
  setPrevIsDisabled,
  setDataSong,
  setRunning,
  idSong
) => {

  let songNode = queue.searchByIdSong(idSong)

  /**
   * Update currentPositionSong to handle changes in the QUEUE when playing/pausing the same song from different app sections.
   * 
   * When a song is played, it's assigned position 0 in the QUEUE. However, if the song is played from a playlist, its position changes.
   * This condition ensures that currentPositionSong is updated when playing/pausing the same song from different app sections,
   * accommodating changes in the QUEUE due to playlist interactions.
   * 
   * Example:
   * Before: QUEUE = { 0: song_x }
   * After playlist interaction: QUEUE = { 0: song_y, 1: song_z, 2: song_u, 3: song_x }
   * currentPositionSong is updated to 3 to reflect the new position of song_x in the updated QUEUE.
   */
  if(idSong == localStorage.getItem('idSong')){
    currentPositionSong = songNode.positionNode
  }

  /** Play a song when the user isn't trying to play the same song */
  if (e && (e.target.matches('a') || e.target.matches('span *')) && idSong != localStorage.getItem('idSong')) {
    e.preventDefault();

    currentPositionSong = songNode.positionNode
    audio_ref.current.src = songNode.data.url

    play(audio_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)
    setPlayPause(true)

  } else {

    if (playPause) {
      pause(audio_ref)
      setRunning(false)
      setPlayPause(false)

    } else {
      play(audio_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)
      setPlayPause(true)
    }
  }


}

const HandleNext = (
  e,
  setPlayPause,
  audio_ref,
  setNextIsDisabled,
  setPrevIsDisabled,
  setDataSong,
  setRunning
) => {

  setRunning(false)

  next(audio_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)
  setPlayPause(true)

}

const HandlePrev = (
  e,
  setPlayPause,
  audio_ref,
  setPrevIsDisabled,
  setNextIsDisabled,
  setDataSong,
  setRunning
) => {

  setRunning(false)
  prev(audio_ref, setPrevIsDisabled, setNextIsDisabled, setDataSong)
  setPlayPause(true)
}

const HandleProgress = (e, slider_ref, duration, setRange, range) => {

  let sec = 0;
  let min = 0;

  let timerState = range;

  let timer = "";

  if (durationMin == min && durationSec == sec) {
    window.clearInterval(counter)
    setRange(0)
  } else {
    timerState = timerState + 1;

    setRange(timerState.toString())

    if (sec.toString().length != 1) {
      if (min.toString().length != 1) {
        timer = `${min}:${sec++}`
      } else {
        timer = `0${min}:${sec++}`
      }
    } else {
      if (min.toString().length != 1) {
        timer = `${min}:0${sec++}`
      } else {
        timer = `0${min}:0${sec++}`
      }
    }

    if (sec == 60) {
      sec = 0;
      min++
    }

    slider_ref.current.style.width = `${timerState * (100 / durationMils)}%`;
  }


}


const HandleLoop = (e, loop, setLoop) => {
  switch (loop) {

    //Loop Enabled
    case 0:
      loopFlag = true;
      setLoop(null) //Set Loop Actived

      break;

    //Loop 1
    case 1:
      loopFlag = false;
      setLoop(0) //Set Loop Enabled
      break;

    //Loop Actived
    default:
      setLoop(1) //Set Loop 1
      break;
  }
}


const HandleVolumeApp = (e, setDisplayVolume, displayVolume) => {
  if (displayVolume) {
    setDisplayVolume(false)
  } else {
    setDisplayVolume(true)
  }
}

export {
  HandlePlayPause,
  HandleNext,
  HandlePrev,
  content,
  HandleProgress,
  durationMils,
  durationSec,
  durationMin,
  keysFunctions,
  HandleLoop,
  loadSongs,
  HandleVolumeApp
}