import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import SongBoxLarge from "../components/SongBoxLarge";
import fetchAJAX from "../helpers/fetch";

const content = [
  [
    {
      dataPlaylist: {
        name: "Playlist 01",
        background: [
          'badbunny - verano sin tí.jpg',
          'LosBunkers - Velocidad de la Luz.jpg',
          'LosDaniels - A casa.jpg',
          'provenza-karol G.jpg'
        ]
      },
      dataSong: [
        {
          id: 1,
          name: "Me Porto Bonito",
          artist: "Bad Bunny",
          album: "Un Verano Sin Tí",
          cover: "badbunny - verano sin tí.jpg",
          created: "15/10/0000",
          duration: "02:58",
          pathSong: 'content/audio_test_3.mp3'
        },
        {
          id: 2,
          name: "Ojitos Lindos",
          artist: "Bad Bunny",
          album: "Un Verano Sin Tí",
          cover: "badbunny - verano sin tí.jpg",
          created: "15/10/0000",
          duration: "04:18",
          pathSong: 'content/audio_test_2.mp3'
        },
        {
          id: 3,
          name: "Provenza",
          artist: "Karol G",
          album: "Provenza",
          cover: "provenza-karol G.jpg",
          created: "15/10/0000",
          duration: "03:30",
          pathSong: 'content/audio_test_3.mp3'
        },
        {
          id: 4,
          name: "Bailando Solo",
          artist: "Los Bunkers",
          album: "La Velocidad de la Luz",
          cover: "LosBunkers - Velocidad de la Luz.jpg",
          created: "15/10/0000",
          duration: "04:27",
          pathSong: 'content/audio_test_2.mp3'
        },
        {
          id: 5,
          name: "Quisiera Saber (with Natalia Lafourcade)",
          artist: "Los Daniels",
          album: "A Casa",
          cover: "LosDaniels - A casa.jpg",
          created: "15/10/0000",
          duration: "03:29",
          pathSong: 'content/audio_test_2.mp3'
        }
      ]
    }
  ],
  [
    {
      dataPlaylist: {
        name: "Playlist 02",
        background: [
          'muse - drones.jpg',
          'Showbiz - Muse.jpg',
          'Simulation Theory - Muse.jpg',
          'The 2nd Law - Muse.jpg'
        ]
      },
      dataSong: [
        {
          id: 1,
          name: "The 2nd Law: Isolated System",
          artist: "Muse",
          album: "The 2nd Law",
          cover: "The 2nd Law - Muse.jpg",
          created: "15/10/0000",
          duration: "04:59",
          pathSong: 'content/audio_test_2.mp3'
        },
        {
          id: 2,
          name: "Algorithm",
          artist: "Muse",
          album: "Simulation Theory (Super Deluxe)",
          cover: "Simulation Theory - Muse.jpg",
          created: "15/10/0000",
          duration: "04:05",
          pathSong: 'content/audio_test_3.mp3'
        },
        {
          id: 3,
          name: "Animals",
          artist: "Muse",
          album: "The 2nd Law",
          cover: "The 2nd Law - Muse.jpg",
          created: "15/10/0000",
          duration: "04:22",
          pathSong: 'content/audio_test_2.mp3'
        },
        {
          id: 4,
          name: "The Handler",
          artist: "Muse",
          album: "Drones",
          cover: "muse - drones.jpg",
          created: "15/10/0000",
          duration: "04:27",
          pathSong: 'content/audio_test_3.mp3'
        },
        {
          id: 5,
          name: "Showbiz",
          artist: "Muse",
          album: "Showbiz",
          cover: "Showbiz - Muse.jpg",
          created: "15/10/0000",
          duration: "05:17",
          pathSong: 'content/audio_test_2.mp3'
        }
      ]
    }
  ],
  [
    {
      dataPlaylist: {
        name: "Playlist 03",
        background: [
          'natural.jpg'
        ]
      },
      dataSong: [
        {
          id: 1,
          name: "Like Spinning Plates (Lives)",
          artist: "Radiohead",
          album: "I Might Be Wrong",
          cover: "Radiohead - Like Spinning.jpg",
          created: "15/10/0000",
          duration: "03:52",
          pathSong: 'content/audio_test_2.mp3'
        },
        {
          id: 2,
          name: "Daydreaming",
          artist: "Radiohead",
          album: "A Moon Shaped Pool",
          cover: "Radiohead - Daydreaming.jpg",
          created: "15/10/0000",
          duration: "06:24",
          pathSong: 'content/audio_test_3.mp3'
        },
        {
          id: 3,
          name: "Remembrance",
          artist: "Balmorhea",
          album: "All Is Wild, All Is Silent",
          cover: "Balmorhea - All is Wild, All is Silent.jpg",
          created: "15/10/0000",
          duration: "05:49",
          pathSong: 'content/audio_test_2.mp3'
        },
      ]
    }
  ],
  [
    {
      dataPlaylist: {
        name: "Playlist 04",
        background: [
          'rails.jpg'
        ]
      },
      dataSong: [

      ]
    }
  ],
  [
    {
      dataPlaylist: {
        name: "Playlist 05",
        background: [
          'caratula.png'
        ]
      },
      dataSong: [

      ]
    }
  ],
  [
    {
      dataPlaylist: {
        name: "Playlist 05",
        background: [
          'caratula.png'
        ]
      },
      dataSong: [

      ]
    }
  ],
  [
    {
      dataPlaylist: {
        name: "Playlist 05",
        background: [
          'caratula.png'
        ]
      },
      dataSong: [

      ]
    }
  ],
]



export default function Playlist() {

  const [dataPlaylist, setDataPlaylist] = useState()
  const [dataSongs, setDataSongs] = useState([])

  useEffect(() => {

    let songs = []

    fetchAJAX({
      url: `http://${window.location.hostname}:5000/getplaylist/${localStorage.getItem('id')}`,
      resSuccess: (res) => {
        if (!res.results) return
        setDataPlaylist(res.results)
        res.results[0].songs.forEach(el => {

          fetchAJAX({
            url: `http://${window.location.hostname}:5000/getsongplaylist/${el.song_id.$oid}`,
            resSuccess: (res) => {
              songs.push(res.results)
              setDataSongs([...dataSongs, ...songs])
            },
            resError: (err) => {
              console.error(err)
            }
          })

        })

      },
      resError: (err) => {
        console.error(err)
      }
    })
  }, [])

  let { idsong } = useParams()

  return (
    <div className='main-container'>
      {dataPlaylist &&
        <Header
          type="playlist"
          data={{
            title: dataPlaylist[0].name,
            creator: dataPlaylist[0].createdBy,
            created: "15/10/2022"
          }}
          cover={dataPlaylist[0].background}
        />
      }

      <main>

        {!dataPlaylist ?
          (content.length > idsong) &&
          content[parseInt(idsong)][0].dataSong.map((el, index) => {
            return <SongBoxLarge
              key={index}
              data={{
                id: el.id,
                cover: el.cover,
                name: el.name,
                artist: el.artist,
                duration: el.duration,
                album: el.album,
                created: el.created,
                pathSong: el.pathSong
              }
              }
            />
          })
          :
          dataSongs.map((el, index) => {
            return <SongBoxLarge
              key={index}
              data={{
                id: el._id,
                cover: el.cover,
                name: el.name,
                artist: el.artist,
                duration: el.duration,
                album: el.album,
                created: el.created,
                pathSong: el.url
              }
              }
            />
          })
        }

      </main>
    </div>
  )
}