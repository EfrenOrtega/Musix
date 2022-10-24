import SongBox from '../components/SongBox';
import MusicBox from '../components/MusicBox';
import Genres from '../components/Genres';
import Artist from '../components/Artist';
import Player from '../components/Player';

export default function TestComponents() {
  return (
    <>
      <h1>Test Components</h1>
      <br />

      <h2>Song Box</h2>
      <br />

      <SongBox
        cover="willOfThePeople.png"
        songInfo={{
          name: 'The Will of The People',
          artist: 'Muse',
          duration: '03:18',
        }}
      />

      <br />
      <hr />

      <h2>Music Box</h2>
      <br />
      <MusicBox
        cover="caratula.png"
        songInfo={{
          name: 'Will of The People',
          artist: 'Muse'
        }}
      />

      <br />
      <hr />

      <h2>Genres Box</h2>
      <br />
      <Genres
        cover="willOfThePeople.png"
        genre="Rock"
      />

      <br />
      <hr />

      <h2>Artist Box</h2>
      <br />
      <Artist
        cover="muse.jpg"
        artist="Muse"
      />

      <br />
      <br />
      <hr />
      <Player
        cover="willOfThePeople.png"
        songInfo={{
          name: 'The Will of The People',
          artist: 'Muse',
          duration: '03:18',
        }}
      />

    </>
  );
}
