import {useParams} from "react-router-dom";


export default function Playlist(){

  let {id} = useParams()


  return (
    <div>
      <h1>Playlist con el {id}</h1>
    </div>
  )
}