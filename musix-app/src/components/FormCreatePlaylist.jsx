import Input from "./micro/Input"
import ButtonToggle from "./micro/ButtonToggle"
import "../styles/form-create-playlist.css"
import { useState } from "react"
import { useRef } from "react"
import fetchAJAX from "../helpers/fetch"

export default function FormCreatePlaylist({ displayForm, handleForm, update, setUpdate }) {

  const [visibility, setVisibility] = useState()
  const [dataForm, setDataForm] = useState({ 'name': '' })
  const previewImage = useRef(null)
  const file = useRef(null)

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
          if (update) {
            setUpdate(false)
          } else {
            setUpdate(true)
          }
          handleForm()
        } else {
          console.log(res.message)
        }

      },
      resError: (err) => {
        console.log(err)
      }
    }
    )

  }


  return (
    <div className={!displayForm ? "form-playlist" : "form-playlist active"}>

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

          <button type="submit">Create</button>


        </div>
      </form>

    </div>
  )
}