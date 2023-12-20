
import SongBox from "../SongBox"


export default function HeaderBottomHome() {
  return (
    <>
      <div></div>
      <div>
        <p className='title'><strong>Daily Recomendation</strong></p>
        <SongBox
          cover=""
          songInfo={{
            name: "",
            artist: "",
            duration: "",
          }}
        />
      </div>
    </>
  )
}