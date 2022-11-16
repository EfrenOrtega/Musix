

export default function HeaderBottomPlaylist({ data, cover }) {

  const { title, creator, created } = data


  return (
    <div className="bottom-playlist">
      {cover.length > 1 ?
        <div className='generate-cover'>
          <img src={`/images/${cover[0]}`} alt="Song" />
          <img src={`/images/${cover[1]}`} alt="Song" />
          <img src={`/images/${cover[2]}`} alt="Song" />
          <img src={`/images/${cover[3]}`} alt="Song" />
        </div>
        :
        <div className="cover">
          <img src={`/images/${cover[0]}`} alt="Song" />
        </div>
      }

      <div className="data-playlist">
        <p>{created}</p>
        <h1>{title}</h1>
        <p>{creator}</p>
      </div>

    </div>
  )
}