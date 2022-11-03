
const content = [
  {
    id: 1,
    name: "Dread Harp Blues",
    artist: "Jesse Tabish",
    cover: "jesseTabish.jpg",
    src: 'content/audio_test_3.mp3'
  },
  {
    id: 1,
    name: "Dust It Off",
    artist: "The Dø",
    cover: "Both Ways Open Jaws - The Do.jpg",
    src: 'content/audio_test_2.mp3'
  },
  {
    id: 2,
    name: "TQM",
    artist: "Little Jesus",
    cover: "Río Salvaje - Little Jesus.jpg",
    src: 'content/audio_test.mp3'
  },
  {
    id: 3,
    name: "Solitude (Felsmann + Tiley Reinterpretation)",
    artist: "M83",
    cover: "Junk - M83.jpg",
    src: 'content/audio_test_2.mp3'
  },
  {
    id: 4,
    name: "In Particular",
    artist: "Blonde Redhead",
    cover: "blondeRedhead.jpg",
    src: 'content/audio_test_3.mp3'
  }
]

let currentIdSong = 0;
let flag = true;

let durationMils = 0
let durationMin = 0
let durationSec = 0
let duration = ""
let counter = null;


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
      loadMetadata(content[currentIdSong])
      HandlePlayPause(e,
        false,
        setPlayPause,
        audio_ref,
        setNextIsDisabled,
        setPrevIsDisabled,
        setDataSong,
        setRunning)
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

  if (flag) {
    flag = false;
    nextAutomatically(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)
  }

  if (audio.current.src == 'http://localhost:1420/') {
    //The song doesn't exist

    audio.current.src = content[currentIdSong].src
    await audio.current.play()
    loadMetadata(content[currentIdSong])
  } else {
    //The song exist
    await audio.current.play()
    loadMetadata(content[currentIdSong])
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

    setDataSong({
      name: content[currentIdSong].name,
      artist: content[currentIdSong].artist,
      duration: duration,
      cover: content[currentIdSong].cover
    })
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

  if ((currentIdSong + 2) == content.length) {
    setNextIsDisabled(true)
  }

  //No more songs :(
  if ((currentIdSong + 1) >= content.length) {

    return
  }

  setPrevIsDisabled(false)
  currentIdSong++

  audio.current.src = content[currentIdSong].src
  play(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong, setRunning)
}

const prev = (audio, setPrevIsDisabled, setNextIsDisabled, setDataSong) => {

  if ((currentIdSong - 1) == 0) {
    setPrevIsDisabled(true)
  }

  //No More Songs :(
  if (currentIdSong == 0) {
    return
  }

  setNextIsDisabled(false)
  currentIdSong--

  audio.current.src = content[currentIdSong].src
  play(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong)
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
  setRunning
) => {

  if (e && (e.target.matches('a') || e.target.matches('span *'))) {
    e.preventDefault();
    currentIdSong = 0;
    audio_ref.current.src = content[currentIdSong].src

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
    console.log(durationMin, '=', min, ' y ', durationSec, '=', sec)
    window.clearInterval(counter)
    setRange(0)
  } else {
    timerState = timerState + 1;

    setRange(timerState.toString())

    if (sec.toString().length != 1) {
      if (min.toString().length != 1) {
        timer = `${min}:${sec++}`
        console.log(timer)
      } else {
        timer = `0${min}:${sec++}`
        console.log(timer)
      }
    } else {
      if (min.toString().length != 1) {
        timer = `${min}:0${sec++}`
        console.log(timer)
      } else {
        timer = `0${min}:0${sec++}`
        console.log(timer)
      }
    }

    if (sec == 60) {
      sec = 0;
      min++
    }

    slider_ref.current.style.width = `${timerState * (100 / durationMils)}%`;
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
  keysFunctions
}