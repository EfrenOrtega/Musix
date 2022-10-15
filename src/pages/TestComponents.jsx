import  SongBox  from '../components/SongBox';

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

      <h2>Song Box</h2>
      <br />
      <br />
      <hr />
    </>
  );
}
