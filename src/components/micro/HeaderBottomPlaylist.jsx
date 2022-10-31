

export default function HeaderBottomPlaylist({ data }) {

  const { title, creator, created } = data


  return (
    <div className="bottom-playlist">
      <p>{created}</p>
      <h1>{title}</h1>
      <p>{creator}</p>
    </div>
  )
}