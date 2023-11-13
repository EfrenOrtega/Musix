import "../styles/form-create-playlist.css"

import { useState, useRef, useContext, useEffect } from "react"

import Context from "../context/Context"

import Input from "./micro/Input"
import ButtonToggle from "./micro/ButtonToggle"

import fetchAJAX from "../helpers/fetch"
import PlaylistContext from "../context/PlaylistContext"

import Spinner from '../assets/animations/spinner/spinner'

export default function FormCreatePlaylist() {

  const [visibility, setVisibility] = useState()
  const [dataForm, setDataForm] = useState({ 'name': '' })
  const previewImage = useRef(null)
  const file = useRef(null)
  const { displayFormPlaylist, setDisplayFormPlaylist } = useContext(Context)
  const { refetchCachePlaylists } = useContext(PlaylistContext)

  const { setPlaylistsChange } = useContext(PlaylistContext)
  const [spinner, setSpinner] = useState(false)

  const loadImage = (e) => {
    let src = URL.createObjectURL(e.target.files[0])
    previewImage.current.src = src
  }

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value
    })
  }

  const createPlaylist = (e) => {

    setSpinner(true)

    e.preventDefault()

    let dateNow = new Date(Date.now())
    let dateTime = new Date(dateNow.getTime() - dateNow.getTimezoneOffset() * 60000).toISOString()
    let date = dateTime.split('T')[0]

    let dataPlaylist = {
      idUser: localStorage.getItem('id'),
      created: date,
      dataForm,
    }

    const formData = new FormData()
    if (file.current.files[0]) {
      formData.append('File', file.current.files[0])
    }
    formData.append('Form', new Blob([JSON.stringify(dataPlaylist)], {
      type: 'application/json'
    }))

    fetchAJAX({
      url: `http://${location.hostname}:5000/createplaylist`,
      settings: {
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      },
      resSuccess: (res) => {
        if (res.status) {
          refetchCachePlaylists()
          setDisplayFormPlaylist(false)
          setPlaylistsChange(true)
          setSpinner(false)
        } else {
          console.log(res.message)
        }

      },
      resError: (err) => {
        setSpinner(false)
        console.log(err)
      }
    }
    )

  }

  const handleForm = (e) => {
    if (displayFormPlaylist) {
      setDisplayFormPlaylist(false)
    } else {
      setDisplayFormPlaylist(true)
    }
  }

  return (
    <div className="form-playlist-container">
      <div className="form-playlist">

        <img onClick={(e) => handleForm()} id="icon-close" src="./icons/icon_close.svg" alt="Close" />

        <form onSubmit={(e) => createPlaylist(e)} action="">
          <div className="container-background">

            <input
              ref={file}
              onChange={(e) => loadImage(e)}
              type="file" name="" id="upload_image" accept="image/*" />

            <div className="background">
              <figure>
                <img ref={previewImage} src="/images/background-plaholder.png" alt="Img Placeholder" />
              </figure>

              <label htmlFor="upload_image">
                <img id="icon-upload" src="/icons/icon_upload.svg" alt="Upload Image" />
              </label>
            </div>
          </div>

          <div className="">
            <Input
              name='name'
              placeholder='Name'
              type='Text'
              handleChange={handleChange}
              value={dataForm.name}
            />

            <div className="btn-toggle-container">
              {false &&
                <>
                  {visibility
                    ? <label>Public</label>
                    : <label>Private</label>
                  }

                  <ButtonToggle setVisibility={setVisibility} />
                </>
              }

            </div>

            {spinner &&
              <div className="spinnerContainer">
                <Spinner></Spinner>
              </div>
            }

            <button type="submit">Create</button>


          </div>
        </form>

      </div>
    </div>
  )
}