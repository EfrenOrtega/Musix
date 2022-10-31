
import SongBox from "../SongBox"


export default function HeaderBottomHome() {
  return (
    <>
      <h1>Playlist Name</h1>

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