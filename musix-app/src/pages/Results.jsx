import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import SongBoxLarge from '../components/SongBoxLarge';

import '../styles/Results.css'
import OptionsPerSong from '../components/micro/OptionsPerSong';


const Results = ()=>{

    let { search } = useParams()
    const [results, setResults] = useState(null)

    const [visibility, setVisibility] = useState(false)
    const [pointerXY, setPointerXY] = useState({})
    const [pointerXYPrev, setPointerXYPrev] = useState(null)
    const [displayOptionsSong, setDisplayOptionsSong] = useState()
    const [idSong, setIdSong] = useState(null)

    useEffect(()=>{
        fetch(`http://${location.hostname}:5000/search/${search}`)
        .then(res=> res.ok ?res.json():Promise.reject(res))
        .then(json=>{
            console.log(json.data)
            setResults(json.data)
        })
        .catch(err=>{
            console.error("0 Matches")
        })
    },[])

    const displayOptions = (e, idsong) => {

        setIdSong(e.target.dataset.id)
    
        //Set the x, y, with and the position of the scroll of the icon when user clicked it to see the options of the song
        setPointerXY({
          'x': e.target.getBoundingClientRect().x,
          'y': e.target.getBoundingClientRect().y,
          'width': e.target.getBoundingClientRect().width,
          'topScroll': document.querySelector('.main-container').scrollTop
        })
    
        //Now I need to control de previous options that the user opened
        if (pointerXYPrev) {//if true means isn't the first time the user open the options of one song
    
          //so, first verify is the user open a diferent song options or he clicked on the same icon to display the option of the same song
          if (pointerXYPrev.y != e.target.getBoundingClientRect().y) {
    
    
            //So save the same data: x, y, with and the position of the scroll of the icon that display the options of the song
            setPointerXYPrev({
              'x': e.target.getBoundingClientRect().x,
              'y': e.target.getBoundingClientRect().y,
              'width': e.target.getBoundingClientRect().width,
              'topScroll': document.querySelector('.main-container').scrollTop
            })
    
            setDisplayOptionsSong(true)
          } else {
    
            //If the user cliked on the same icon we only have two option display or hide song options.
            if (displayOptionsSong) {
              setDisplayOptionsSong(false)
            } else {
              setDisplayOptionsSong(true)
            }
    
          }
        } else {//If pointerXYPrev it's false means is the first time the user open the options of one song
    
          //So save the same data: x, y, with and the position of the scroll of the icon that display the options of the song
          setPointerXYPrev({
            'x': e.target.getBoundingClientRect().x,
            'y': e.target.getBoundingClientRect().y,
            'width': e.target.getBoundingClientRect().width,
            'topScroll': document.querySelector('.main-container').scrollTop
          })
    
    
          if (displayOptionsSong) {
            setDisplayOptionsSong(false)
          } else {
            setDisplayOptionsSong(true)
          }
    
        }
    }

    const evtSearch = (e, search)=>{
        console.log(search)
        fetch(`http://${location.hostname}:5000/search/${search}`)
        .then(res=> res.ok ?res.json():Promise.reject(res))
        .then(json=>{
            console.log(json.data)
            setResults(json.data)
        })
        .catch(err=>{
            console.error("0 Matches")
        })
    }
    
    return(
        <div className='main-container'>
            <Header
            type="small"
            background=''
            data={null}
            evtSearch = {evtSearch}
            />

            <main>

                {displayOptionsSong &&
                    <OptionsPerSong
                        setDisplayOptionsSong={setDisplayOptionsSong}
                        visibility={visibility}
                        setVisibility={setVisibility}
                        pointerXY={pointerXY}
                        setPointerXY={setPointerXY}
                        idSong={idSong}
                    />
                }

                {
                   (results && results.length !== 0) ?
                        <p className='title'>Search results ({results.length})</p>
                   : 
                        <p className='title'>0 Matches</p>
                }

                {(results && results.length !== 0) &&

                    results.map(el=>{
                        return <SongBoxLarge
                            key={el._id}
                            data={{
                            id: el._id,
                            cover: el.cover,
                            name: el.name,
                            artist: el.artist,
                            duration: el.duration,
                            album: el.album,
                            created: el.created,
                            pathSong: el.url,
                            favoriteSong:el.favorite
                            }
                            }
                            _favorite={el.favorite ? true : false}
                            displayOptions={displayOptions}
                        />
                    })
                    
                }

            </main>


        </div>
    )
}

export default Results;