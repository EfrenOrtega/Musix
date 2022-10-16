import '../styles/genre-box.css'

export default function Genres({cover, genre}) {
  return (
    <div className="genres-box">
      <p><strong>{genre}</strong></p>
      <img src={require(`../../assets/images/${cover}`)} alt={genre} />
    </div>
  )
}