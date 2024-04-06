import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import '../styles/profile.css'
import fetchAJAX from '../helpers/fetch';

const Profile = ()=>{


    const [dataUser, setDataUser] = useState(null)
    const [dataAccount, setDataAccount] = useState(null)

    const [alertVisible, setAlertVisible] = useState(false)
    const [msgAlert, setMsgAlert] = useState('')


    const previewImage = useRef()
    const file = useRef(null)


    const handleChangeInputUser = (e)=>{
        setDataUser({
            ...dataUser,
            [e.target.name]:e.target.value
        })
    }

    const handleChangeInputAccount = (e)=>{
        setDataAccount({
            ...dataAccount,
            [e.target.name]:e.target.value
        })
    }

    const uploadImg = (e)=>{
        let src = URL.createObjectURL(e.target.files[0])
        previewImage.current.src = src
    }

    const handleBtn = (e)=>{
        if(dataUser.name == '' || dataUser.last == '' || dataUser.email == ''
        || dataAccount.email == ''){
            alert("Complete the Form")
            return
        }

        const formData = new FormData()

        if (file.current.files[0]) {
            formData.append('File', file.current.files[0])
        }

        formData.append('Form', new Blob([JSON.stringify({ idUser: localStorage.getItem('id'), dataAccount, dataUser})], {
          type: 'application/json'
        }))

        fetchAJAX({
            url: `http://${location.hostname}:5000/updateProfile`,
            settings: {
                method: 'POST',
                header: {
                  'Content-Type': 'multipart/form-data',
                },
                body: formData
            },
            resSuccess: (res) => {
                setMsgAlert('Updated profile')
                setAlertVisible(true)

                setTimeout(()=>{
                    setAlertVisible(false)
                }, 1800)
            },
            resError: (err) => {
                console.log(err)
            }
        })

        //UPDATE THE ACCOUNT AND DATA USER

    }
    

    useEffect(()=>{
       
        fetchAJAX({
            url:`finduser/${localStorage.getItem('id')}`,
            resSuccess: (res) => {
                setDataUser(res.data)
            },
            resError: (err) => {
                console.error(err)
            }
        })

        fetchAJAX({
            url:`findaccount/${localStorage.getItem('id')}`,
            resSuccess: (res) => {
                setDataAccount(res.data)
            },
            resError: (err) => {
                console.error(err)
            }
        })

    },[])

    return(
        <div className='main-container'>

            <Header
                type="home"
                background='background-header-3.jpg'
                data={{
                title: "Profile"
                }}
            />

            <div className='profile'>
                <div className={alertVisible ? 'msg-alert active' : 'msg-alert'}>
                    <p>{msgAlert}</p>
                </div>

                <p className='title'>Profile</p>

                <div className='data-user'>

                    {(dataUser && dataAccount) &&
                    <>
                        <div className='data-user-1'>
                            <article>
                                <label htmlFor="">Name</label>
                                <input name="name" type="text" value={dataUser.name} onChange={(e)=>handleChangeInputUser(e)}/>
                            </article>

                            <article>
                                <label htmlFor="">Last Name</label>
                                <input name="last" type="text" value={dataUser.last} onChange={(e)=>handleChangeInputUser(e)}/>
                            </article>

                            {/*<article>
                                <label htmlFor="">Date Birth</label>
                                <input name="dateBirth" type="date" value={dataUser.dateBirth} onChange={(e)=>handleChangeInputUser(e)}/>
                            </article>*/}
                        </div>

                        <div className='data-user-2'>
                            <article>
                                <label htmlFor="">Email</label>
                                <input name="email" type="text" value={dataUser.email} onChange={(e)=>handleChangeInputUser(e)}/>
                            </article>

                            <article>
                                <label htmlFor="">Username</label>
                                <input name="username" type="text" value={dataAccount.username} onChange={(e)=>handleChangeInputAccount(e)}/>
                            </article>
                        </div>

                        <div className='data-user-3'>
                            <article>

                                <div className='icon-upload' onMouseEnter={(e)=>e.target.classList.add('active')}  onMouseLeave={(e)=>e.target.classList.remove('active')}>
                                    <label htmlFor="upload_image">
                                        <img id="icon-upload" src="/icons/icon_upload.svg" alt="Upload Image" />
                                    </label>
                                </div>    

                                <figure>
                                    <img ref={previewImage} src={dataUser.avatar} alt="Img Placeholder" />
                                </figure>
                                <input 
                                ref={file}
                                onChange={(e)=>uploadImg(e)}
                                type="file" name="" id="upload_image" accept="image/*" />
                            </article>
                        </div>
                    </>
                    }

                    <button onClick={handleBtn}>Guardar Cambios</button>

                </div>
                
            </div>

        </div>
    )
}

export default Profile;