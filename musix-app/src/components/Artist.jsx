import '../styles/Artist.css'

export default function Artist({ cover, artist }) {
  return (
    <div className="artist-box">
      <figure>
        <img src={cover} alt={artist} />
      </figure>
      <p>{artist}</p>
    </div>
  )
}