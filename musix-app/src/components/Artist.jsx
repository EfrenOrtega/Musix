import { useEffect } from 'react'
import '../styles/Artist.css'
import { useParams } from 'react-router-dom'

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