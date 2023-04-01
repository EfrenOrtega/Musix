
import SongBox from "../SongBox"


export default function HeaderBottomHome() {
  return (
    <>
      <div></div>
      <div>
        <p className='title'><strong>Daily Recomendation</strong></p>
        <SongBox
          cover="willOfThePeople.png"
          songInfo={{
            name: "Will Of The People",
            artist: "Muse",
            duration: "03:00",
          }}
        />
      </div>
    </>
  )
}