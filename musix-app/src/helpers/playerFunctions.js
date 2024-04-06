//All functions to the Player (Play, Pause, Next, Prev, Loop, etc.)
import fetchAJAX from "./fetch";

import { _doublyLinkedList as queue, travese_data as travese_queue } from "./doublyLinkedList";

let currentIdSong = 0;
let currentPositionSong = -1;

let durationMils = 0
let durationMin = 0
let durationSec = 0
let duration = ""
let counter = null;

let loopFlag = 'active';
//let isLoop = false;
let nextAutomatically_isActive = false;


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
        loadMetadata(QUEUE.getNode(currentPositionSong).data)
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

const play = (audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning,  QUEUE, setQUEUE) => {


  //This is to control the next button
  if (currentPositionSong >= 0) {
    if (QUEUE.size - 1 > currentPositionSong) {//If there are other song after active the next button
      setNextIsDisabled(false)
    } else if (loopFlag !== 'active'){
      setNextIsDisabled(true)
    }
  }

  //If loopFlag is 'loop one' means that is not necessary to play the next song.
  if (!nextAutomatically_isActive) {
    nextAutomatically_isActive = true
    nextAutomatically(audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning,  QUEUE, setQUEUE)
  }

  /**
   *  
   * This is when a song that is stored in the localStorage is playing, this only happend when the user 
   * restart or open the app and play the song that is already in the player
  */

  if (source_ref.current.src == `http://${window.location.hostname}:1420/`) {//There isn't a song loaded in the <Audio> Element of HTML

    if (currentPositionSong >= 0) {
      let data = QUEUE.getNode(currentPositionSong).data;
      source_ref.current.src = data.url
    } else {
      currentPositionSong = 0;
      let data = QUEUE.searchByIdSong(localStorage.getItem('idSong')).data;
      source_ref.current.src = data.url
      setNextIsDisabled(true)
    }

    audio.current.load()
    audio.current.play()


    if (currentPositionSong >= 0) {
      loadMetadata(QUEUE.getNode(currentPositionSong).data)
    }
  } else { //There is a song loaded in the <Audio> Element of HTML

    let dataSong = QUEUE.getNode(currentPositionSong).data

    if (dataSong._id != localStorage.getItem('idSong')) {//The song you are trying to play is different to the current song?
      source_ref.current.src = dataSong.url
      audio.current.load()
      audio.current.play()
    } else {//When the user is trying to play the same song that is currently playing
      audio.current.play()
    }

    loadMetadata(dataSong)

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
        idSong: QUEUE.getNode(currentPositionSong).data._id,
        date: new Date()
      })
    }
  }

  fetch(`http://${window.location.hostname}:5000/updateHistory`, settings)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json => {
    })
    .catch(err => {
    })


  if (currentPositionSong >= 0) {
    localStorage.setItem('idSong', QUEUE.getNode(currentPositionSong).data._id)
  }

  let songNode = QUEUE.getNode(currentPositionSong);
  setDataSong({
    name: songNode.data.name,
    artist: songNode.data.artist,
    duration: songNode.data.duration,
    cover: songNode.data.cover,
    url: songNode.data.url,
    lyrics: songNode.data.lyrics,
    _id: songNode.data._id,
    favorite: songNode.data.favorite
  })

}


const pause = (audio) => {
  audio.current.pause()
}

const nextAutomatically = (audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, QUEUE, setQUEUE) => {
  audio.current.addEventListener('ended', e => {

    //Check the type of loop
    if (loopFlag === "loop one") {//Resume the current song      
      source_ref.current.src = QUEUE.getNode(currentPositionSong).data.url
      localStorage.setItem('idSong', QUEUE.getNode(currentPositionSong).data._id)
      audio.current.pause()
      audio.current.load()
      audio.current.play()
    } else {//Play the next song 
      next(audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, QUEUE, setQUEUE)
    }

  })
}


const next = (audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, QUEUE, setQUEUE) => {


  if (currentPositionSong + 1 == QUEUE.size && loopFlag !== 'active') {
    setNextIsDisabled(true)
    return
  } else if (loopFlag === 'active' && currentPositionSong + 1 == QUEUE.size) {
    setNextIsDisabled(false)
    currentPositionSong = -1;
  }

  currentPositionSong++
  setPrevIsDisabled(false)

  source_ref.current.src = QUEUE.getNode(currentPositionSong).data.url


  localStorage.setItem('idSong', QUEUE.getNode(currentPositionSong).data._id)
  audio.current.load()
  play(audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, QUEUE, setQUEUE)

}

const prev = (audio, setPrevIsDisabled, setNextIsDisabled, setDataSong, source_ref, QUEUE, setQUEUE) => {

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

      source_ref.current.src = QUEUE.getNode(currentPositionSong).data.url
      audio.current.load()
      play(audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, null, QUEUE, setQUEUE)

      return;
    }

    setPrevIsDisabled(false)
    currentPositionSong--

    source_ref.current.src = QUEUE.getNode(currentPositionSong).data.url
    play(audio, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, null, QUEUE, setQUEUE)

  }



}


/*Handle Controls*/

const HandlePlayPause = (
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
  idSong
) => {

  let songNode = QUEUE.searchByIdSong(idSong)
  /**
   * Condition to Update currentPositionSong to handle changes in the QUEUE when playing/pausing the same song from different app sections.
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
  if (idSong == localStorage.getItem('idSong')) {
    currentPositionSong = songNode.positionNode
  }

  /** Play a song when the user isn't trying to play the same song */
  if (e && (e.target.matches('a') || e.target.matches('span *')) && idSong != localStorage.getItem('idSong')) {
    e.preventDefault();

    currentPositionSong = songNode.positionNode
    source_ref.current.src = songNode.data.url

    play(audio_ref, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, QUEUE, setQUEUE)
    setPlayPause(true)

  } else {

    if (playPause) {
      pause(audio_ref)
      setRunning(false)
      setPlayPause(false)

    } else {
      play(audio_ref, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, QUEUE, setQUEUE)
      setPlayPause(true)
    }
  }

}



const HandleNext = (
  QUEUE,
  setQUEUE,
  e,
  setPlayPause,
  audio_ref,
  source_ref,
  setNextIsDisabled,
  setPrevIsDisabled,
  setDataSong,
  setRunning
) => {

  setRunning(false)

  next(audio_ref, source_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning, QUEUE, setQUEUE)
  setPlayPause(true)

}

const HandlePrev = (
  QUEUE,
  setQUEUE,
  e,
  setPlayPause,
  audio_ref,
  source_ref,
  setPrevIsDisabled,
  setNextIsDisabled,
  setDataSong,
  setRunning
) => {

  setRunning(false)
  prev(audio_ref, setPrevIsDisabled, setNextIsDisabled, setDataSong, source_ref, QUEUE, setQUEUE)
  setPlayPause(true)
}

const HandleLoop = (e, loop, setLoop) => {
  switch (loop) {

    //If Loop is Enable - 0
    case 'enable':
      //Set Loop Actived
      loopFlag = true;
      setLoop('active')

      break;

    //If Loop is Active by One - 1 
    case 'loop one':
      //Set Loop Enabled
      loopFlag = 'enable';
      setLoop('enable')
      break;

    //If Loop is Actived
    default:
      loopFlag = 'loop one'
      setLoop('loop one') //Set Loop by one
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
  durationMils,
  durationSec,
  durationMin,
  keysFunctions,
  HandleLoop,
  HandleVolumeApp
}