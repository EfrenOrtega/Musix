import { useParams } from "react-router-dom";
import Header from "../components/Header";
import SongBoxLarge from "../components/SongBoxLarge";

export default function Playlist() {

  let { id } = useParams()


  return (
    <div className='main-container'>
      <Header
        type="playlist"
        background='muse_playlist.jpg'
        data={{
          title: "Playlist Name",
          creator: "Created by name user",
          created: "15/10/2022"
        }}

      />

      <main>
        <SongBoxLarge
          data={{
            cover: 'Origin of Symmetry - Muse.jpg',
            name: "Bliss",
            artist: "Muse",
            duration: "02:30",
            album: "Origin of Symmetry",
            created: "15/10/0000"
          }
          }
        />

        <SongBoxLarge
          data={{
            cover: 'The 2nd Law - Muse.jpg',
            name: "The 2nd Law: Isolated System",
            artist: "Muse",
            duration: "04:59",
            album: "The 2nd Law",
            created: "00/00/0000"
          }
          }
        />

        <SongBoxLarge
          data={{
            cover: 'Simulation Theory - Muse.jpg',
            name: "Algorithm",
            artist: "Muse",
            duration: "04:05",
            album: "Simulation Theory",
            created: "00/00/0000"
          }
          }
        />

        <SongBoxLarge
          data={{
            cover: 'Hysteria - Muse.jpg',
            name: "Hysteria",
            artist: "Muse",
            duration: "03:47",
            album: "Absolution",
            created: "00/00/0000"
          }
          }
        />

        <SongBoxLarge
          data={{
            cover: 'willOfThePeople.png',
            name: "Verona",
            artist: "Muse",
            duration: "04:57",
            album: "Will Of The People",
            created: "00/00/0000"
          }
          }
        />

        <SongBoxLarge
          data={{
            cover: 'Origin of Symmetry - Muse.jpg',
            name: "Plug in Baby",
            artist: "Muse",
            duration: "03:38",
            album: "Origin of Symmetry",
            created: "00/00/0000"
          }
          }
        />

        <SongBoxLarge
          data={{
            cover: 'Showbiz - Muse.jpg',
            name: "Uno",
            artist: "Muse",
            duration: "03:38",
            album: "Showbiz",
            created: "00/00/0000"
          }
          }
        />

      </main>
    </div>
  )
}