

export default function HeaderBottomPlaylist({ data, cover }) {

  const { title, creator, created } = data

  console.log(cover)

  return (
    <div className="bottom-playlist">
      {cover.length > 1 ?

        cover[0].includes('http') ?
          <div className='generate-cover'>
            <img src={cover[0]} alt="Song" />
            <img src={cover[1]} alt="Song" />
            <img src={cover[2]} alt="Song" />
            <img src={cover[3]} alt="Song" />
          </div>
          :
          <div className='generate-cover'>
            <img src={`/images/${cover[0]}`} alt="Song" />
            <img src={`/images/${cover[1]}`} alt="Song" />
            <img src={`/images/${cover[2]}`} alt="Song" />
            <img src={`/images/${cover[3]}`} alt="Song" />
          </div>
        :
        cover[0].includes('http') ?
          <div className="cover">
            <img src={cover[0]} alt="Song" />
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