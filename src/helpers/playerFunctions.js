
const content = [
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
    src: 'content/audio_test.mp3'
  }
]

let currentIdSong = 0;
let flag = true;
let durationMin = 0
let durationSec = 0
let duration = ""

const play = (audio, setNextIsDisabled, setPrevIsDisabled, setDataSong) => {

  if (flag) {
    flag = false;
    nextAutomatically(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong)
  }

  if (audio.current.src == 'http://localhost:1420/') {
    //The song doesn't exist
    audio.current.src = content[currentIdSong].src
    audio.current.play()
  } else {
    //The song exist
    audio.current.play()
  }

  setTimeout(() => {
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
  }, 100)


}

const pause = (audio) => {
  audio.current.pause()
}

const nextAutomatically = (audio, setNextIsDisabled, setPrevIsDisabled, setDataSong) => {
  console.log("Start")
  audio.current.addEventListener('ended', e => {
    console.log("End")
    next(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong)
  })
}


const next = (audio, setNextIsDisabled, setPrevIsDisabled, setDataSong) => {

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
  play(audio, setNextIsDisabled, setPrevIsDisabled, setDataSong)
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
  setDataSong
) => {

  if (e.target.matches('a') || e.target.matches('span *')) {
    e.preventDefault();
    currentIdSong = 0;
    audio_ref.current.src = content[currentIdSong].src

    play(audio_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong)
    setPlayPause(true)

  } else {
    if (playPause) {
      pause(audio_ref)
      setPlayPause(false)
    } else {
      play(audio_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong)
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
  setDataSong
) => {

  next(audio_ref, setNextIsDisabled, setPrevIsDisabled, setDataSong)
  setPlayPause(true)
}

const HandlePrev = (
  e,
  setPlayPause,
  audio_ref,
  setPrevIsDisabled,
  setNextIsDisabled,
  setDataSong
) => {

  prev(audio_ref, setPrevIsDisabled, setNextIsDisabled, setDataSong)
  setPlayPause(true)
}

export { HandlePlayPause, HandleNext, HandlePrev, content }